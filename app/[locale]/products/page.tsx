import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import ProductsClient from './ProductsClient'
import { getProducts, getCategories } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = {
  params:       Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles = { az: 'Məhsullar', en: 'Products', ru: 'Продукты' }
  return { title: titles[locale as keyof typeof titles] ?? titles.en }
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale }   = await params
  const { category } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(locale as Locale),   // load ALL products for client-side search
    getCategories(),
  ])

  return (
    <Suspense>
      <ProductsClient
        locale={locale}
        allProducts={products}
        categories={categories}
        initialCategory={category}
      />
    </Suspense>
  )
}
