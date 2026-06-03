import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import ProductCard from '@/components/products/ProductCard'
import CategoryFilter from '@/components/products/CategoryFilter'
import { getProducts, getCategories } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = {
  params:       Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale }   = await params
  const { category } = await searchParams
  const t            = await getTranslations('products')

  const [products, categories] = await Promise.all([
    getProducts(locale as Locale, category),
    getCategories(),
  ])

  const activeCat   = categories.find((c) => c.slug === category)
  const activeLabel = activeCat ? (activeCat[`label_${locale}` as keyof typeof activeCat] as string) : null

  return (
    <>
      {/* Header */}
      <div className="bg-corp" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container-site">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-7 bg-brand" />
            <span className="font-['Space_Mono'] text-[9px] tracking-[0.22em] uppercase text-brand">Alphachem</span>
          </div>
          <h1 className="text-4xl font-light text-white tracking-tight">{activeLabel ?? t('title')}</h1>
          {activeLabel && (
            <p className="font-['Space_Mono'] text-[9px] uppercase tracking-widest text-white/30 mt-2">
              {products.length} {locale === 'az' ? 'məhsul' : locale === 'ru' ? 'продуктов' : 'products'}
            </p>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-[--border] sticky top-[68px] z-30">
        <div className="container-site py-4">
          <Suspense>
            <CategoryFilter categories={categories} locale={locale} activeSlug={category} />
          </Suspense>
        </div>
      </div>

      {/* Grid */}
      <div className="py-14 bg-surface min-h-[50vh]">
        <div className="container-site">
          {products.length === 0 ? (
            <div className="py-28 text-center">
              <p className="text-xl font-light text-[--muted]">{t('no_products')}</p>
            </div>
          ) : (
            <>
              <p className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-[--subtle] mb-7">
                {products.length} {locale === 'az' ? 'məhsul' : locale === 'ru' ? 'продуктов' : 'products'}
                {activeLabel ? ` — ${activeLabel}` : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => {
                  const cat = categories.find((c) => c.id === product.category_id)
                  const catLabel = cat ? (cat[`label_${locale}` as keyof typeof cat] as string) : undefined
                  return (
                    <ProductCard key={product.id} product={product} locale={locale} categoryLabel={catLabel} />
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
