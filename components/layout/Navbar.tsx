'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const LOCALES = [
  { code: 'az', label: 'AZ' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
]

const CATEGORIES = [
  { slug: 'api', key: 'api' },
  { slug: 'excipient-pharma', key: 'excipient-pharma' },
  { slug: 'vitamin', key: 'vitamin' },
  { slug: 'excipient-food', key: 'excipient-food' },
  { slug: 'excipient-technical', key: 'excipient-technical' },
  { slug: 'intermediate', key: 'intermediate' },
  { slug: 'other', key: 'other' },
  { slug: 'mineral', key: 'mineral' },
]

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const tc = useTranslations('categories')
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  const href = (path: string) => `/${locale}${path}`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[--border]">
      <div className="container-site flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={href('/')} className="flex items-center">
          <Image
            src="https://alphachem.az/alpha_logo_colored.svg"
            alt="Alphachem"
            width={140}
            height={36}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={href('/')}
            className="text-sm text-[--muted] hover:text-[--foreground] transition-colors"
          >
            {t('home')}
          </Link>
          <Link
            href={href('/about')}
            className="text-sm text-[--muted] hover:text-[--foreground] transition-colors"
          >
            {t('about')}
          </Link>

          {/* Products dropdown */}
          <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
            <Link
              href={href('/products')}
              className="text-sm text-[--muted] hover:text-[--foreground] transition-colors flex items-center gap-1"
            >
              {t('products')}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            {productsOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-[--border] shadow-lg py-2 mt-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`${href('/products')}?category=${cat.slug}`}
                    className="block px-4 py-2 text-xs font-mono tracking-wide uppercase text-[--muted] hover:text-[--accent] hover:bg-[--accent-light] transition-colors"
                  >
                    {tc(cat.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={href('/contact')}
            className="text-sm text-[--muted] hover:text-[--foreground] transition-colors"
          >
            {t('contact')}
          </Link>
        </nav>

        {/* Locale switcher */}
        <div className="hidden md:flex items-center gap-1">
          {LOCALES.map((l, i) => (
            <span key={l.code} className="flex items-center">
              <button
                onClick={() => switchLocale(l.code)}
                className={`text-xs font-mono tracking-widest px-1 transition-colors ${
                  locale === l.code
                    ? 'text-[--accent] font-medium'
                    : 'text-[--muted] hover:text-[--foreground]'
                }`}
              >
                {l.label}
              </button>
              {i < LOCALES.length - 1 && (
                <span className="text-[--border] text-xs">|</span>
              )}
            </span>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-px bg-[--foreground] mb-1.5" />
          <div className="w-5 h-px bg-[--foreground] mb-1.5" />
          <div className="w-5 h-px bg-[--foreground]" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[--border] px-6 py-4 space-y-4">
          <Link href={href('/')} className="block text-sm" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
          <Link href={href('/about')} className="block text-sm" onClick={() => setMenuOpen(false)}>{t('about')}</Link>
          <Link href={href('/products')} className="block text-sm" onClick={() => setMenuOpen(false)}>{t('products')}</Link>
          <Link href={href('/contact')} className="block text-sm" onClick={() => setMenuOpen(false)}>{t('contact')}</Link>
          <div className="flex gap-3 pt-2 border-t border-[--border]">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => { switchLocale(l.code); setMenuOpen(false) }}
                className={`text-xs font-mono ${locale === l.code ? 'text-[--accent] font-medium' : 'text-[--muted]'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
