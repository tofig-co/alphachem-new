import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import HeroSlider from '@/components/home/HeroSlider'
import ProductCard from '@/components/products/ProductCard'
import { getSliderImages, getProducts, getSiteContent } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('home')

  const [sliderImages, products, aboutText] = await Promise.all([
    getSliderImages(),
    getProducts(locale as Locale),
    getSiteContent('about_text', locale as Locale),
  ])

  const featured       = products.slice(0, 8)
  const firstParagraph = aboutText?.split('\n').filter(Boolean)[0] ?? ''

  return (
    <>
      {/* ── Hero ── */}
      <HeroSlider images={sliderImages} locale={locale} />

      {/* ── About ── */}
      <section className="py-24 border-b border-[--border]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-28 items-center">

            {/* Text */}
            <div>
              <span className="section-label">{t('about_title')}</span>
              <div className="gold-rule mb-8" />
              <h2 className="font-display text-4xl lg:text-5xl font-300 uppercase tracking-[0.06em] text-[--navy] leading-tight mb-8">
                Alphachem
              </h2>
              <p className="font-body text-[14px] text-[--muted] leading-relaxed mb-10 max-w-lg">
                {firstParagraph || 'Kimyəvi xammal tədarükü və marketinq şirkəti olan firmamız Alphachem 2000-ci ildən xidmətə başlamışdır.'}
              </p>
              <Link href={`/${locale}/about`} className="btn-outline">
                {locale === 'az' ? 'Ətraflı' : locale === 'ru' ? 'Подробнее' : 'Learn More'} →
              </Link>
            </div>

            {/* Image with deco frame */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full border border-[--gold]/20 pointer-events-none" />
              <div className="relative bg-[--navy] overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src="https://alphachem.az/images/about-new.jpg"
                  alt="Alphachem"
                  fill
                  className="object-cover opacity-90"
                />
                {/* Gold left-edge accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[--gold]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="py-24">
        <div className="container-site">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="section-label">{t('products_title')}</span>
              <div className="gold-rule" />
            </div>
            <Link
              href={`/${locale}/products`}
              className="font-mono text-[9px] tracking-widest uppercase text-[--gold] hover:text-[--gold-hover] transition-colors self-start sm:self-auto"
            >
              {t('view_all')} →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>

          {products.length > 8 && (
            <div className="mt-12 text-center">
              <Link href={`/${locale}/products`} className="btn-primary">
                {t('view_all')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
