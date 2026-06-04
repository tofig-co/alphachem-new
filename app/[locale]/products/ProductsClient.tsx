'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ProductCard from '@/components/products/ProductCard'
import type { ProductWithTranslation, Category } from '@/types'

interface Props {
  locale: string
  allProducts: ProductWithTranslation[]
  categories: Category[]
  initialCategory?: string
}

export default function ProductsClient({ locale, allProducts, categories, initialCategory }: Props) {
  const t  = useTranslations('products')
  const tc = useTranslations('categories')
  const router = useRouter()

  const [query,         setQuery]         = useState('')
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? '')

  const filtered = useMemo(() => {
    let list = allProducts
    if (activeCategory) list = list.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id)
      return cat?.slug === activeCategory
    })
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [allProducts, activeCategory, query, categories])

  const selectCategory = (slug: string) => {
    setActiveCategory(slug)
    const url = slug ? `/${locale}/products?category=${slug}` : `/${locale}/products`
    router.replace(url, { scroll: false })
  }

  const activeLabel = activeCategory
    ? (categories.find((c) => c.slug === activeCategory)?.[`label_${locale}` as 'label_en'] ?? '')
    : ''

  const base     = 'text-[11px] font-semibold px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap'
  const inactive = 'bg-surface-2 text-[--muted] hover:bg-brand-light hover:text-brand'

  return (
    <>
      {/* Page header */}
      <div className="bg-corp" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="container-site">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px bg-brand" />
            <span className="font-mono-chem text-[9px] tracking-[0.22em] uppercase text-brand">Alphachem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight">
            {activeLabel || t('title')}
          </h1>
        </div>
      </div>

      {/* Filter + Search bar */}
      <div className="bg-white border-b border-[--border] sticky top-[68px] z-30 shadow-sm">
        <div className="container-site py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[--subtle]" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="field pl-9 py-2 text-[13px] rounded-full"
                style={{paddingLeft: "30px"}}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => selectCategory('')} className={`${base} ${!activeCategory ? 'bg-corp text-white' : inactive}`}>
                {t('all_categories')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.slug)}
                  className={`${base} ${activeCategory === cat.slug ? 'bg-brand text-white' : inactive}`}
                >
                  {tc(cat.slug as Parameters<typeof tc>[0])}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="py-14 bg-surface min-h-[50vh]">
        <div className="container-site">
          {filtered.length === 0 ? (
            <div className="py-28 text-center">
              <p className="text-xl font-light text-[--muted]">{t('no_products')}</p>
            </div>
          ) : (
            <>
              <p className="font-mono-chem text-[8px] tracking-widest uppercase text-[--subtle] mb-7">
                {filtered.length} {locale === 'az' ? 'məhsul' : locale === 'ru' ? 'продуктов' : 'products'}
                {activeLabel ? ` — ${activeLabel}` : ''}
                {query ? ` · "${query}"` : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((product) => {
                  const cat = categories.find((c) => c.id === product.category_id)
                  const catLabel = cat ? (cat[`label_${locale}` as keyof typeof cat] as string) : undefined
                  return <ProductCard key={product.id} product={product} locale={locale} categoryLabel={catLabel} />
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
