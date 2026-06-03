import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import ProductCard from '@/components/products/ProductCard'
import CategoryFilter from '@/components/products/CategoryFilter'
import { getProducts, getCategories } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { category } = await searchParams
  const t = await getTranslations('products')

  const [products, categories] = await Promise.all([
    getProducts(locale as Locale, category),
    getCategories(),
  ])

  return (
    <div className="py-14">
      <div className="container-site">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-[--border]">
          <p className="section-label">{t('title')}</p>
          <Suspense>
            <CategoryFilter categories={categories} locale={locale} activeSlug={category} />
          </Suspense>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[--muted]">{t('no_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-[--border]">
            {products.map((product) => {
              const cat = categories.find((c) => c.id === product.category_id)
              const catLabel = cat ? (cat[`label_${locale}` as keyof typeof cat] as string) : undefined
              return (
                <div key={product.id} className="bg-[--background]">
                  <ProductCard product={product} locale={locale} categoryLabel={catLabel} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
