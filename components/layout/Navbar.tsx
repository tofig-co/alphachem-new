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
  { slug: 'api',                key: 'api' },
  { slug: 'excipient-pharma',   key: 'excipient-pharma' },
  { slug: 'vitamin',            key: 'vitamin' },
  { slug: 'excipient-food',     key: 'excipient-food' },
  { slug: 'excipient-technical',key: 'excipient-technical' },
  { slug: 'intermediate',       key: 'intermediate' },
  { slug: 'other',              key: 'other' },
  { slug: 'mineral',            key: 'mineral' },
]

export default function Navbar({ locale }: { locale: string }) {
  const t  = useTranslations('nav')
  const tc = useTranslations('categories')
  const pathname = usePathname()
  const router   = useRouter()
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  const switchLocale = (code: string) => {
    const segs = pathname.split('/')
    segs[1] = code
    router.push(segs.join('/'))
  }

  const href = (path: string) => `/${locale}${path}`

  return (
    <header className="sticky top-0 z-50 bg-[--card] border-b border-[--border]">
      {/* Navy accent stripe */}
      <div className="h-[3px] bg-[--navy]" />

      <div className="container-site flex items-center justify-between h-[70px]">

        {/* Logo */}
        <Link href={href('/')} className="flex items-center shrink-0">
          <Image
            src="/images/alpha_logo_colored.svg"
            alt="Alphachem"
            width={148}
            height={38}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {[
            { path: '/',        label: t('home') },
            { path: '/about',   label: t('about') },
            { path: '/contact', label: t('contact') },
          ].map((item) => (
            <Link
              key={item.path}
              href={href(item.path)}
              className="font-display text-[11px] font-600 tracking-[0.14em] uppercase text-[--navy] hover:text-[--gold] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}

          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <Link
              href={href('/products')}
              className="font-display text-[11px] font-600 tracking-[0.14em] uppercase text-[--navy] hover:text-[--gold] transition-colors duration-200 flex items-center gap-1.5"
            >
              {t('products')}
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {productsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[18px] w-72 bg-[--card] border border-[--border] border-t-2 border-t-[--gold] shadow-[0_8px_40px_rgba(13,31,53,0.12)]">
                {/* caret */}
                <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-[--gold]" />

                <div className="py-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`${href('/products')}?category=${cat.slug}`}
                      onClick={() => setProductsOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 group/item"
                    >
                      <span className="w-px h-3 bg-[--border] group-hover/item:bg-[--gold] transition-colors duration-150" />
                      <span className="font-mono text-[9px] tracking-widest uppercase text-[--muted] group-hover/item:text-[--gold] transition-colors duration-150">
                        {tc(cat.key)}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-[--border] px-5 py-3">
                  <Link
                    href={href('/products')}
                    onClick={() => setProductsOpen(false)}
                    className="font-mono text-[9px] tracking-widest uppercase text-[--gold] hover:text-[--gold-hover] transition-colors"
                  >
                    All Products →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: locale + CTA */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-0">
            {LOCALES.map((l, i) => (
              <span key={l.code} className="flex items-center">
                <button
                  onClick={() => switchLocale(l.code)}
                  className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 transition-colors duration-200 ${
                    locale === l.code
                      ? 'text-[--gold]'
                      : 'text-[--muted] hover:text-[--navy]'
                  }`}
                >
                  {l.label}
                </button>
                {i < LOCALES.length - 1 && (
                  <span className="text-[--border] select-none text-xs">·</span>
                )}
              </span>
            ))}
          </div>

          <Link
            href={href('/contact')}
            className="font-display text-[9px] tracking-[0.15em] uppercase font-700 px-4 py-2.5 border border-[--gold] text-[--gold] hover:bg-[--gold] hover:text-white transition-all duration-200"
          >
            {t('contact')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-[--navy] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-6 h-px bg-[--navy] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-[--navy] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[--navy]">
          <div className="container-site py-8">
            {[
              { path: '/',        label: t('home') },
              { path: '/about',   label: t('about') },
              { path: '/products',label: t('products') },
              { path: '/contact', label: t('contact') },
            ].map((item) => (
              <Link
                key={item.path}
                href={href(item.path)}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 border-b border-white/10 font-display text-[11px] tracking-[0.15em] uppercase text-white hover:text-[--gold] transition-colors duration-200"
              >
                {item.label}
                <span className="text-[--gold] opacity-50 text-xs">→</span>
              </Link>
            ))}
            <div className="flex items-center gap-6 pt-7">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { switchLocale(l.code); setMenuOpen(false) }}
                  className={`font-mono text-[9px] tracking-widest uppercase ${
                    locale === l.code ? 'text-[--gold]' : 'text-white/35 hover:text-white/60'
                  } transition-colors`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
