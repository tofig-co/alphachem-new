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

  const activeCat = categories.find((c) => c.slug === category)
  const activeLabel = activeCat
    ? (activeCat[`label_${locale}` as keyof typeof activeCat] as string)
    : null

  return (
    <>
      {/* ── Page header ── */}
      <div className="bg-[--navy] py-16 relative overflow-hidden">
        <span className="absolute top-5 right-10 w-10 h-10 border-t border-r border-[--gold] opacity-20" />
        <div className="container-site">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-px bg-[--gold] block" />
            <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-[--gold]">Alphachem</span>
          </div>
          <h1 className="font-display text-5xl font-300 uppercase tracking-[0.06em] text-white">
            {activeLabel ?? t('title')}
          </h1>
          {activeLabel && (
            <p className="font-mono text-[9px] tracking-widest uppercase text-white/35 mt-2">
              {products.length} {locale === 'az' ? 'məhsul' : locale === 'ru' ? 'продуктов' : 'products'}
            </p>
          )}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-[--card] border-b border-[--border] sticky top-[73px] z-30">
        <div className="container-site py-4 overflow-x-auto">
          <Suspense>
            <CategoryFilter categories={categories} locale={locale} activeSlug={category} />
          </Suspense>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="py-16">
        <div className="container-site">
          {products.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-display text-3xl font-300 uppercase tracking-wide text-[--muted]">
                {t('no_products')}
              </p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[8px] tracking-widest uppercase text-[--muted] mb-8">
                {products.length} {locale === 'az' ? 'məhsul' : locale === 'ru' ? 'продуктов' : 'products'}
                {activeLabel ? ` — ${activeLabel}` : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => {
                  const cat = categories.find((c) => c.id === product.category_id)
                  const catLabel = cat
                    ? (cat[`label_${locale}` as keyof typeof cat] as string)
                    : undefined
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      categoryLabel={catLabel}
                    />
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
