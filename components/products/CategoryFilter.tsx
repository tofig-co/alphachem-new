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

  const go = (slug?: string) => {
    router.push(slug ? `/${locale}/products?category=${slug}` : `/${locale}/products`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => go()}
        className={`text-[11px] font-semibold px-4 py-2 border transition-all duration-200 ${
          !activeSlug
            ? 'bg-corp text-white border-corp'
            : 'bg-white text-[--muted] border-[--border] hover:border-corp hover:text-corp'
        }`}
      >
        {t('all_categories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => go(cat.slug)}
          className={`text-[11px] font-semibold px-4 py-2 border transition-all duration-200 ${
            activeSlug === cat.slug
              ? 'bg-brand text-white border-brand'
              : 'bg-white text-[--muted] border-[--border] hover:border-brand hover:text-brand'
          }`}
        >
          {tc(cat.slug as Parameters<typeof tc>[0])}
        </button>
      ))}
    </div>
  )
}
