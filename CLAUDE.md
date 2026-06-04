# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

No test suite exists. Verify changes by running the dev server.

## What This Project Is

Alphachem is a Azerbaijani chemical raw materials supplier (since 2000). This is their marketing/catalogue site — three pages plus a product catalogue with detail pages and an inquiry form. Target languages: Azerbaijani (default), English, Russian.

## Architecture

### Routing & i18n

All user-facing routes live under `app/[locale]/`. The locale segment (`az` | `en` | `ru`) is always present in the URL (`localePrefix: 'always'`). Browser language detection is **disabled** (`localeDetection: false`) — the default is always `az`.

- `middleware.ts` — next-intl middleware handles locale routing and redirects `/` → `/az`
- `i18n/routing.ts` — single source of truth for locales and default
- `i18n/request.ts` — loads the correct `messages/{locale}.json` for server components
- Translation strings live in `messages/az.json`, `messages/en.json`, `messages/ru.json`

In **server components**, use `getTranslations('namespace')` from `next-intl/server`.  
In **client components**, use `useTranslations('namespace')` from `next-intl`.

### Server vs Client Split (Products Page Pattern)

The products page uses an important pattern to combine server-side data fetching with client-side filtering:

- `app/[locale]/products/page.tsx` — Server Component: fetches **all** products and categories from Supabase, passes them as props
- `app/[locale]/products/ProductsClient.tsx` — Client Component (`'use client'`): handles search query state and category filtering entirely in-memory (no re-fetching)

This pattern avoids waterfall fetches while keeping filtering instant.

### Supabase

Server-side queries go through `lib/supabase/server.ts` (uses `@supabase/ssr` with cookie store). Direct Supabase client (no cookies) is used in `app/api/` routes and `app/sitemap.ts`.

All query functions are in `lib/supabase/queries.ts`. Products have a **translations table** (`product_translations`) with a `locale` column — queries always fall back to `'az'` if the requested locale translation is missing.

Database tables:
- `products` — `slug`, `category_id`, `image_url`, `sort_order`, `active`
- `product_translations` — `product_id`, `locale`, `name`, `description`
- `categories` — `slug`, `label_az/en/ru`, `sort_order`
- `site_content` — `key`, `locale`, `value` (CMS-style text blobs, e.g. `about_text`)
- `inquiries` — contact/product inquiry submissions
- `slider_images` — `image_url`, `sort_order`, `active`

The `SUPABASE_SERVICE_ROLE_KEY` (server-only, not prefixed `NEXT_PUBLIC_`) is used only in `app/api/inquire/route.ts` for writes that bypass RLS.

### API Route

`app/api/inquire/route.ts` — POST endpoint that:
1. Validates required fields (`name`, `email`, `message`)
2. Inserts into `inquiries` table via service-role client
3. Sends an HTML email via Resend (`RESEND_API_KEY`) — silently skipped if key is absent

### Styling System

**Tailwind v4** (not v3). Configuration is in `app/globals.css` via `@theme {}` — there is no `tailwind.config.js`. Brand colors are defined as Tailwind tokens (`brand`, `brand-dark`, `brand-light`, `corp`, `corp-mid`, `surface`, `surface-2`). Semantic CSS variables (`--text`, `--muted`, `--subtle`, `--border`, `--bg`) are defined in `:root` and used via `var()` or Tailwind's arbitrary-value syntax `text-[--muted]`.

Reusable utility classes defined in `globals.css`:
- `.container-site` — max-width layout wrapper
- `.btn-primary`, `.btn-outline`, `.btn-outline-white` — button variants
- `.field`, `.field-label` — form input styles
- `.eyebrow` — small monospace section label
- `.teal-line` — decorative brand-color underline
- `.tag` — pill badge
- `.font-mono-chem` — JetBrains Mono font

### SVG Images

Next.js image optimization does not process SVGs. Always add `unoptimized` to any `<Image>` component that loads an `.svg` file, otherwise it renders as a grey placeholder.

### Navbar Behaviour

`Navbar.tsx` has an `isHero` flag (`true` when on the home page and not scrolled) that makes the header transparent. Only the header background and logo change — nav link colours are always dark. The `scrolled` state is tracked via a scroll event listener in `useEffect`.

The products dropdown uses `onMouseEnter/Leave` on a wrapper div. The dropdown panel has `pt-2` padding (not `mt-`) so there is no gap that would trigger `onMouseLeave` prematurely.

### Page Transition Loading

`nextjs-toploader` is installed. It is rendered in `app/[locale]/layout.tsx` before `<NextIntlClientProvider>` and shows a thin brand-coloured bar at the top during navigation.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon key (public)
SUPABASE_SERVICE_ROLE_KEY      # Supabase service role key (server-only)
RESEND_API_KEY                 # Optional — email sending via Resend
```

## Scripts

- `scripts/create-inquiries-table.sql` — run in Supabase SQL editor to create the `inquiries` table
- `scripts/seed.ts` — database seeding script
