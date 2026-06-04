# Admin CMS — Design Spec

**Date:** 2026-06-04  
**Project:** alphachem-web  
**Scope:** Password-protected admin panel at `/admin` with full CRUD for all Supabase tables.

---

## Overview

A minimal, functional CMS built inside the existing Next.js 16 App Router codebase. Mutations use Server Actions. Auth is a hardcoded password stored in an env var. No external admin framework or UI library — styling reuses existing Tailwind tokens and utility classes from `globals.css`.

---

## Auth & Session

**Env vars** added to `.env.local` (and `.env.example`):
- `ADMIN_PASSWORD` — checked only at login, never stored anywhere after that
- `ADMIN_SECRET` — a random token (e.g. `openssl rand -hex 32`), used as the session cookie value; completely independent of the password

**Login flow:**
1. User visits any `/admin/*` route
2. `/admin/layout.tsx` reads the `admin_session` cookie and compares it to `process.env.ADMIN_SECRET`
3. If missing or invalid → redirect to `/admin/login`
4. `/admin/login/page.tsx` renders a plain form
5. On submit, a Server Action in `app/admin/login/actions.ts` compares the posted password to `process.env.ADMIN_PASSWORD` using a constant-time comparison (`timingSafeEqual` from Node `crypto`)
6. On match → sets `admin_session` cookie (httpOnly, sameSite: strict, path: /admin) with value `process.env.ADMIN_SECRET` → redirects to `/admin/products`
7. On failure → returns a generic error message ("Invalid password")

**Why two vars:** The cookie value is a random secret unrelated to the password. Even with the source code public, an attacker cannot forge a session without `ADMIN_SECRET`. The password check uses `timingSafeEqual` to prevent timing attacks.

**Logout:** Server Action in the layout that clears the `admin_session` cookie and redirects to `/admin/login`.

**Middleware:** No changes to `middleware.ts`. The existing next-intl middleware only matches `[locale]` paths; `/admin` is outside its matcher.

**Cookie validation helper:** `lib/admin/auth.ts` — exports `requireAdmin()` (redirects to login if not authenticated) and `verifyPassword(input)` (constant-time compare). Called at the top of every admin Server Action and in the layout.

---

## Route Structure

```
app/admin/
  layout.tsx              — auth check, sidebar nav, logout button
  page.tsx                — redirect to /admin/products
  login/
    page.tsx              — login form (email-style field + password)
    actions.ts            — verifyPassword Server Action
  products/
    page.tsx              — paginated product list table
    new/
      page.tsx            — create product form
    [id]/
      page.tsx            — edit product form
    actions.ts            — createProduct, updateProduct, deleteProduct, uploadProductImage
  categories/
    page.tsx              — category list with add/edit/delete
    actions.ts            — createCategory, updateCategory, deleteCategory
  site-content/
    page.tsx              — textarea editor grouped by content key
    actions.ts            — updateSiteContent
  slider/
    page.tsx              — slide list with upload, active toggle, delete
    actions.ts            — createSlide, updateSlide, deleteSlide, uploadSlideImage
  inquiries/
    page.tsx              — read-only inquiry table, delete

lib/admin/
  auth.ts                 — getAdminSession, requireAdmin, hashPassword
  supabase.ts             — service-role Supabase client (reuses SUPABASE_SERVICE_ROLE_KEY)
```

---

## Admin Layout & Navigation

`app/admin/layout.tsx` is a Server Component. It:
- Calls `requireAdmin()` — redirects to login if not authed
- Renders a fixed left sidebar with nav links: Products, Categories, Site Content, Slider, Inquiries
- Renders a logout button (form with Server Action)
- Wraps `{children}` in a main content area

The sidebar uses `bg-corp text-white` to match the site's visual identity. Active link highlighted with `text-brand`. No animations.

---

## Products

### List (`/admin/products`)
Table columns: AZ Name | Category | Active | Sort Order | Actions (Edit / Delete).  
Delete triggers a confirmation (`confirm()`) before calling the `deleteProduct` Server Action.  
"New Product" button links to `/admin/products/new`.

### Create & Edit form (`/admin/products/new` and `/admin/products/[id]`)
Single page form with three sections:

**Base fields:**
- Category — `<select>` populated from `getCategories()`
- Active — checkbox
- Sort order — number input
- Image — file input; on submit the Server Action uploads to Supabase Storage bucket `products` using the service-role client, gets the public URL, stores it in `image_url`. If no new file is provided on edit, the existing URL is preserved. Current image shown as a small thumbnail.

**Translations — tab switcher (AZ / EN / RU):**
Each tab contains:
- Name — text input (required for AZ, optional for EN/RU)
- Description — textarea (~8 rows)

The entire product form is a Client Component (`'use client'`) — the tab switcher requires state, and wrapping the whole form keeps it simple. It calls a Server Action on submit.

**Slug:** auto-generated on create from the AZ name using `slugify` (same logic as seed script). Displayed as readonly on the edit form.

**Server Actions (`products/actions.ts`):**
- `createProduct(formData)` — inserts into `products` + `product_translations` (3 rows)
- `updateProduct(id, formData)` — updates `products` + upserts `product_translations`
- `deleteProduct(id)` — deletes translations first, then product
- `uploadProductImage(file)` — uploads to `products` bucket, returns public URL

All actions call `requireAdmin()` as first step.

---

## Categories

### List & Edit (`/admin/categories`)
Single page. Shows a table of all categories: Slug | AZ Label | EN Label | RU Label | Sort Order | Actions.  
Each row has an Edit button that navigates to a small edit form rendered below the table on the same page (no separate route). Active edit row is highlighted.  
"Add Category" button reveals an empty add form below the table.

**Fields:** slug (text, required, immutable after creation — shown readonly on edit), label_az, label_en, label_ru, sort_order.

**Server Actions (`categories/actions.ts`):**
- `createCategory(formData)`
- `updateCategory(id, formData)`
- `deleteCategory(id)` — only if no products reference it (check before delete, show error if blocked)

---

## Site Content

### Editor (`/admin/site-content`)
All content rows fetched from `site_content` table, grouped by `key`.  
Each key renders as a card with the key name as header and three stacked textareas (AZ / EN / RU), each pre-filled with the current value.  
A "Save" button per key submits that key's three values via Server Action.

**Current keys:** `about_text`, `contact_address_az`. New keys added directly to Supabase; the UI reflects whatever is in the DB — no hardcoded key list.

**Server Action (`site-content/actions.ts`):**
- `updateSiteContent(key, formData)` — upserts rows for all 3 locales

---

## Slider

### List & Upload (`/admin/slider`)
Grid of current slides showing: thumbnail | Sort Order | Active toggle | Delete button.  
"Add Slide" form at the top: file input + sort_order number input + active checkbox.

**Server Actions (`slider/actions.ts`):**
- `createSlide(formData)` — uploads image to `slider` bucket, inserts row
- `updateSlide(id, formData)` — updates sort_order and active
- `deleteSlide(id)` — removes from storage and DB

Storage path convention: `slide-{sort_order}.{ext}` (matches seed script pattern).

---

## Inquiries

### View (`/admin/inquiries`)
Read-only table, newest first. Columns: Date | Name | Company | Email | Phone | Product | Locale | Message (truncated to 60 chars with tooltip or expand).  
Delete button per row (with `confirm()`).  
No create or edit.

**Server Action (`inquiries/actions.ts`):**
- `deleteInquiry(id)`

---

## Service-Role Supabase Client

`lib/admin/supabase.ts` exports `createAdminClient()` — uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Used in all admin Server Actions for writes. Read queries in Server Component pages can use the regular SSR client from `lib/supabase/server.ts` since all tables are readable.

---

## Styling

- Sidebar: `bg-corp text-white`, fixed width `w-56`
- Main content: white background, `container` with `px-8 py-8`
- Tables: standard HTML `<table>` with `border-collapse`, `border-[--border]`, alternating `bg-surface` rows
- Forms: use existing `.field` and `.field-label` classes
- Buttons: use existing `.btn-primary` and `.btn-outline`
- Active nav item: `text-brand font-bold`
- No page transition loader needed (admin is not public-facing)

---

## Environment Variables Added

```
ADMIN_PASSWORD=your-admin-password
ADMIN_SECRET=<output of: openssl rand -hex 32>
```

Added to `.env.local` and `.env.example`.

---

## Out of Scope

- Supabase Auth / user accounts (deferred)
- Rich text editor for descriptions (plain textarea is sufficient)
- Pagination for products list (acceptable until product count grows significantly)
- Image cropping / resizing
- Bulk operations
