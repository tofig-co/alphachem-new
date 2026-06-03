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
      <HeroSlider images={sliderImages} locale={locale} />

      {/* ── Stats strip ── */}
      <div className="bg-surface border-b border-[--border]">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[--border]">
            {[
              { n: '25+', label: locale === 'az' ? 'İllik Təcrübə' : locale === 'ru' ? 'Лет опыта' : 'Years Experience' },
              { n: '35+', label: locale === 'az' ? 'Məhsul' : locale === 'ru' ? 'Продуктов' : 'Products' },
              { n: '8',   label: locale === 'az' ? 'Kateqoriya' : locale === 'ru' ? 'Категорий' : 'Categories' },
              { n: '3',   label: locale === 'az' ? 'Dil' : locale === 'ru' ? 'Языка' : 'Languages' },
            ].map((s) => (
              <div key={s.label} className="py-7 px-4 text-center">
                <p className="text-3xl font-bold text-brand mb-0.5">{s.n}</p>
                <p className="font-['Space_Mono'] text-[9px] tracking-widest uppercase text-[--muted]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <section className="py-20 bg-white border-b border-[--border]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <span className="section-label">{t('about_title')}</span>
              <div className="teal-rule mb-8" />
              <h2 className="text-3xl lg:text-4xl font-semibold text-[--text] leading-tight mb-6 tracking-tight">
                Alphachem
              </h2>
              <p className="text-[14px] text-[--muted] leading-relaxed mb-8 max-w-lg">
                {firstParagraph || 'Kimyəvi xammal tədarükü və marketinq şirkəti olan firmamız Alphachem 2000-ci ildən xidmətə başlamışdır.'}
              </p>
              <Link href={`/${locale}/about`} className="btn-outline">
                {locale === 'az' ? 'Ətraflı' : locale === 'ru' ? 'Подробнее' : 'Learn More'} →
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-sm shadow-md" style={{ aspectRatio: '4/3', backgroundColor: '#0D2137' }}>
                <Image
                  src="https://alphachem.az/images/about-new.jpg"
                  alt="Alphachem"
                  fill
                  className="object-cover opacity-90"
                />
              </div>
              {/* Offset border accent */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-brand opacity-20 pointer-events-none rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="py-20 bg-surface">
        <div className="container-site">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="section-label">{t('products_title')}</span>
              <div className="teal-rule" />
            </div>
            <Link href={`/${locale}/products`} className="text-[12px] font-semibold text-brand hover:text-brand-dark transition-colors self-start sm:self-auto">
              {t('view_all')} →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>

          {products.length > 8 && (
            <div className="mt-10 text-center">
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
