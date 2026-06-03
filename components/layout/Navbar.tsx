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
  const pathname   = usePathname()
  const router     = useRouter()
  const [open,     setOpen]     = useState(false)
  const [products, setProducts] = useState(false)

  const switchLocale = (code: string) => {
    const segs = pathname.split('/')
    segs[1] = code
    router.push(segs.join('/'))
  }

  const href = (p: string) => `/${locale}${p}`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[--border] shadow-sm">
      <div className="container-site flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link href={href('/')} className="flex items-center shrink-0">
          <Image
            src="/images/alpha_logo_colored.svg"
            alt="Alphachem"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { path: '/',      label: t('home') },
            { path: '/about', label: t('about') },
          ].map((item) => (
            <Link
              key={item.path}
              href={href(item.path)}
              className="text-[13px] font-medium text-[--muted] hover:text-brand transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}

          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProducts(true)}
            onMouseLeave={() => setProducts(false)}
          >
            <Link
              href={href('/products')}
              className="text-[13px] font-medium text-[--muted] hover:text-brand transition-colors duration-200 flex items-center gap-1"
            >
              {t('products')}
              <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className="mt-px">
                <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {products && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-68 bg-white border border-[--border] shadow-lg rounded-sm overflow-hidden">
                <div className="h-[3px] bg-brand" />
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`${href('/products')}?category=${cat.slug}`}
                    onClick={() => setProducts(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-[--muted] hover:text-brand hover:bg-brand-light transition-colors duration-150"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[--border] shrink-0" />
                    {tc(cat.key)}
                  </Link>
                ))}
                <div className="border-t border-[--border] px-4 py-2.5">
                  <Link
                    href={href('/products')}
                    onClick={() => setProducts(false)}
                    className="text-[11px] font-semibold text-brand hover:text-brand-dark transition-colors"
                  >
                    {t('products')} →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href={href('/contact')}
            className="text-[13px] font-medium text-[--muted] hover:text-brand transition-colors duration-200"
          >
            {t('contact')}
          </Link>
        </nav>

        {/* Right: locale + CTA */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-1">
            {LOCALES.map((l, i) => (
              <span key={l.code} className="flex items-center">
                <button
                  onClick={() => switchLocale(l.code)}
                  className={`font-['Space_Mono'] text-[9px] tracking-widest uppercase px-2 py-1 transition-colors ${
                    locale === l.code ? 'text-brand font-bold' : 'text-[--subtle] hover:text-[--muted]'
                  }`}
                >
                  {l.label}
                </button>
                {i < LOCALES.length - 1 && (
                  <span className="text-[--border] text-[10px] select-none">·</span>
                )}
              </span>
            ))}
          </div>

          <Link
            href={href('/contact')}
            className="btn-primary text-[11px] py-2 px-4"
          >
            {t('contact')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-[--text] transition-all duration-300 ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-px bg-[--text] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-[--text] transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-corp border-t border-[--border]">
          <div className="container-site py-6">
            {[
              { path: '/',        label: t('home') },
              { path: '/about',   label: t('about') },
              { path: '/products',label: t('products') },
              { path: '/contact', label: t('contact') },
            ].map((item) => (
              <Link
                key={item.path}
                href={href(item.path)}
                onClick={() => setOpen(false)}
                className="flex justify-between items-center py-3.5 border-b border-white/10 text-[13px] font-medium text-white/80 hover:text-white transition-colors"
              >
                {item.label}
                <span className="text-brand text-xs">→</span>
              </Link>
            ))}
            <div className="flex items-center gap-5 pt-5">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { switchLocale(l.code); setOpen(false) }}
                  className={`font-['Space_Mono'] text-[9px] tracking-widest uppercase ${
                    locale === l.code ? 'text-brand' : 'text-white/30'
                  }`}
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
