'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  locale: string
  activeSlug?: string
}

export default function CategoryFilter({ categories, locale, activeSlug }: Props) {
  const t  = useTranslations('products')
  const tc = useTranslations('categories')
  const router = useRouter()

  const go = (slug?: string) =>
    router.push(slug ? `/${locale}/products?category=${slug}` : `/${locale}/products`)

  const base     = 'text-[11px] font-semibold px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap'
  const inactive = 'bg-surface-2 text-[--muted] hover:bg-brand-light hover:text-brand'

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => go()} className={`${base} ${!activeSlug ? 'bg-corp text-white' : inactive}`}>
        {t('all_categories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => go(cat.slug)}
          className={`${base} ${activeSlug === cat.slug ? 'bg-brand text-white' : inactive}`}
        >
          {tc(cat.slug as Parameters<typeof tc>[0])}
        </button>
      ))}
    </div>
  )
}
