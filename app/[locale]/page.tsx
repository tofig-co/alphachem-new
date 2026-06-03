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

  const featured = products.slice(0, 8)

  return (
    <>
      <HeroSlider images={sliderImages} locale={locale} />

      {/* About section */}
      <section className="py-20 border-b border-[--border]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label">{t('about_title')}</p>
              <h2 className="text-2xl font-light text-[--foreground] leading-relaxed mb-6 tracking-tight">
                Alpha Chemicals
              </h2>
              <div className="text-sm text-[--muted] leading-relaxed space-y-4">
                {aboutText ? (
                  aboutText.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>
                    Kimyəvi xammal tədarükü və marketinq şirkəti olan firmamız Alphachem
                    2000-ci ildən xidmətə başlamışdır.
                  </p>
                )}
              </div>
              <Link href={`/${locale}/about`} className="btn-outline mt-8 inline-flex">
                Ətraflı →
              </Link>
            </div>
            <div className="relative">
              <Image
                src="https://alphachem.az/images/about-new.jpg"
                alt="Alphachem facility"
                width={560}
                height={420}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section className="py-20">
        <div className="container-site">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label">{t('products_title')}</p>
            </div>
            <Link href={`/${locale}/products`} className="text-sm text-[--accent] hover:underline font-medium">
              {t('view_all')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[--border]">
            {featured.map((product) => (
              <div key={product.id} className="bg-[--background]">
                <ProductCard product={product} locale={locale} />
              </div>
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
