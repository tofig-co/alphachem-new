import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import ProductCard from '@/components/products/ProductCard'
import Reveal from '@/components/ui/Reveal'
import { getProducts, getSiteContent } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles = { az: 'Kimyəvi Xammal Tədarükü', en: 'Chemical Raw Materials Supplier', ru: 'Поставщик химического сырья' }
  return { title: titles[locale as keyof typeof titles] ?? titles.en }
}

const INDUSTRY_ICONS = {
  pharma: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="8" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 13v6M11 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  vet: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3C8.477 3 4 7.477 4 13c0 4.1 2.4 7.6 5.9 9.3L14 25l4.1-2.7C21.6 20.6 24 17.1 24 13c0-5.523-4.477-10-10-10z" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 10v6M11 13h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  tech: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 4v3M14 21v3M4 14h3M21 14h3M6.34 6.34l2.12 2.12M19.54 19.54l2.12 2.12M6.34 21.66l2.12-2.12M19.54 8.46l2.12-2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('home')

  const [products, aboutText] = await Promise.all([
    getProducts(locale as Locale),
    getSiteContent('about_text', locale as Locale),
  ])

  const featured = products.slice(0, 8)
  const firstParagraph = aboutText?.split('\n').filter(Boolean)[0] ?? ''

  const industries = [
    { key: 'pharma', icon: INDUSTRY_ICONS.pharma, cat: 'excipient-pharma', title: t('industries_pharma_title'), desc: t('industries_pharma_desc') },
    { key: 'vet',    icon: INDUSTRY_ICONS.vet,    cat: 'other',            title: t('industries_vet_title'),   desc: t('industries_vet_desc') },
    { key: 'tech',   icon: INDUSTRY_ICONS.tech,   cat: 'excipient-technical', title: t('industries_tech_title'), desc: t('industries_tech_desc') },
  ]

  return (
    <>
      {/* Hero — NOT wrapped in Reveal (LCP) */}
      <HeroSection locale={locale} />

      {/* Industries */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <Reveal>
            <span className="eyebrow">{t('industries_eyebrow')}</span>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {industries.map((ind, i) => (
              <Reveal key={ind.key} delay={i * 100}>
                <Link
                  href={`/${locale}/products?category=${ind.cat}`}
                  className="group block p-8 bg-surface rounded-sm hover:bg-brand-light hover:shadow-md transition-all duration-250"
                >
                  <div className="text-brand mb-5 group-hover:scale-110 transition-transform duration-200 w-fit">
                    {ind.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-[--text] mb-2 group-hover:text-brand transition-colors">
                    {ind.title}
                  </h3>
                  <p className="text-[13px] text-[--muted] leading-relaxed">{ind.desc}</p>
                  <p className="text-[11px] font-semibold text-brand mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 bg-surface">
        <div className="container-site">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="eyebrow">{t('products_eyebrow')}</span>
                <h2 className="text-3xl font-semibold text-[--text] tracking-tight">{t('products_title')}</h2>
              </div>
              <Link href={`/${locale}/products`} className="text-[13px] font-semibold text-brand hover:text-brand-dark self-start sm:self-auto">
                {t('view_all')} →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 50, 250)}>
                <ProductCard product={product} locale={locale} />
              </Reveal>
            ))}
          </div>
          {products.length > 8 && (
            <Reveal>
              <div className="mt-10 text-center">
                <Link href={`/${locale}/products`} className="btn-primary">{t('view_all')}</Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* About strip */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="eyebrow">{t('about_eyebrow')}</span>
              <h2 className="text-3xl lg:text-4xl font-semibold text-[--text] leading-tight tracking-tight mb-6">
                {t('about_title')}
              </h2>
              <p className="text-[14px] text-[--muted] leading-relaxed mb-8 max-w-lg">
                {firstParagraph}
              </p>
              <Link href={`/${locale}/about`} className="btn-outline">{t('learn_more')} →</Link>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative">
                <div className="overflow-hidden rounded-sm shadow-xl bg-corp" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src="https://alphachem.az/images/about-new.jpg"
                    alt="Alphachem"
                    fill
                    className="object-cover opacity-90"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-light rounded-sm -z-10" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <Reveal>
        <section className="bg-corp py-16">
          <div className="container-site text-center">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-3 tracking-tight">
              {t('cta_title')}
            </h2>
            <p className="text-[14px] text-white/50 mb-10 max-w-xl mx-auto">{t('cta_sub')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/994555350001"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ background: '#25D366' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                {t('cta_whatsapp')}
              </a>
              <Link href={`/${locale}/contact`} className="btn-outline-white">{t('cta_email')} →</Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  )
}
