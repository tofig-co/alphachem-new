'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const LOCALES = [{ code: 'az', label: 'AZ' }, { code: 'en', label: 'EN' }, { code: 'ru', label: 'RU' }]

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
  const t       = useTranslations('nav')
  const tc      = useTranslations('categories')
  const pathname = usePathname()
  const router   = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)
  const [prodOpen, setProdOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const switchLocale = (code: string) => {
    const segs = pathname.split('/')
    segs[1] = code
    router.push(segs.join('/'))
  }

  const href = (p: string) => `/${locale}${p}`

  const isHero = !scrolled && pathname === `/${locale}`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHero
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white border-b border-[--border] shadow-sm'
      }`}
    >
      <div className="container-site flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link href={href('/')} className="flex items-center shrink-0">
          <Image
            src="/images/alpha_logo_colored.svg"
            alt="Alphachem"
            width={148}
            height={38}
            priority
            unoptimized
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
              className="text-[13px] font-medium transition-colors duration-200 text-[--muted] hover:text-brand"
            >
              {item.label}
            </Link>
          ))}

          {/* Products dropdown */}
          <div className="relative" onMouseEnter={() => setProdOpen(true)} onMouseLeave={() => setProdOpen(false)}>
            <Link
              href={href('/products')}
              className="text-[13px] font-medium transition-colors duration-200 flex items-center gap-1 text-[--muted] hover:text-brand"
            >
              {t('products')}
              <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {prodOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-68 pt-2">
              <div className="bg-white border border-[--border] shadow-xl overflow-hidden rounded-sm">
                <div className="h-[3px] bg-brand" />
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`${href('/products')}?category=${cat.slug}`}
                    onClick={() => setProdOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-[--muted] hover:text-brand hover:bg-brand-light transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-light group-hover:bg-brand shrink-0" style={{ background: '#0086A1', opacity: .4 }} />
                    {tc(cat.key)}
                  </Link>
                ))}
                <div className="border-t border-[--border] px-4 py-2.5">
                  <Link href={href('/products')} onClick={() => setProdOpen(false)} className="text-[11px] font-semibold text-brand hover:text-brand-dark">
                    {t('products')} →
                  </Link>
                </div>
              </div>
              </div>
            )}
          </div>

          <Link
            href={href('/contact')}
            className="text-[13px] font-medium transition-colors duration-200 text-[--muted] hover:text-brand"
          >
            {t('contact')}
          </Link>
        </nav>

        {/* Right: locale + CTA */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center">
            {LOCALES.map((l, i) => (
              <span key={l.code} className="flex items-center">
                <button
                  onClick={() => switchLocale(l.code)}
                  className={`font-mono-chem text-[9px] tracking-widest uppercase px-2 py-1 transition-colors ${
                    locale === l.code
                      ? 'text-brand font-bold'
                      : isHero ? 'text-[--subtle] hover:text-[--muted]' : 'text-[--subtle] hover:text-[--muted]'
                  }`}
                >
                  {l.label}
                </button>
                {i < LOCALES.length - 1 && (
                  <span className={`text-[10px] select-none ${isHero ? 'text-white/20' : 'text-[--border]'}`}>·</span>
                )}
              </span>
            ))}
          </div>

          <Link href={href('/contact')} className="btn-primary text-[11px] py-2 px-4">
            {t('request_quote')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px transition-all duration-300 ${isHero ? 'bg-white' : 'bg-[--text]'} ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-px transition-all duration-300 ${isHero ? 'bg-white' : 'bg-[--text]'} ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px transition-all duration-300 ${isHero ? 'bg-white' : 'bg-[--text]'} ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-corp border-t border-white/10">
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
                onClick={() => setMenuOpen(false)}
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
                  onClick={() => { switchLocale(l.code); setMenuOpen(false) }}
                  className={`font-mono-chem text-[9px] tracking-widest uppercase ${locale === l.code ? 'text-brand' : 'text-white/30'}`}
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
