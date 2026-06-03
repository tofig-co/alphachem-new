'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  locale: string
  activeSlug?: string
}

export default function CategoryFilter({ categories, locale, activeSlug }: Props) {
  const t = useTranslations('products')
  const tc = useTranslations('categories')
  const router = useRouter()

  const select = (slug?: string) => {
    const url = slug
      ? `/${locale}/products?category=${slug}`
      : `/${locale}/products`
    router.push(url)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select()}
        className={`text-xs font-mono tracking-wide uppercase px-3 py-1.5 border transition-colors ${
          !activeSlug
            ? 'bg-[--accent] text-white border-[--accent]'
            : 'border-[--border] text-[--muted] hover:border-[--accent] hover:text-[--accent]'
        }`}
      >
        {t('all_categories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => select(cat.slug)}
          className={`text-xs font-mono tracking-wide uppercase px-3 py-1.5 border transition-colors ${
            activeSlug === cat.slug
              ? 'bg-[--accent] text-white border-[--accent]'
              : 'border-[--border] text-[--muted] hover:border-[--accent] hover:text-[--accent]'
          }`}
        >
          {tc(cat.slug as Parameters<typeof tc>[0])}
        </button>
      ))}
    </div>
  )
}
