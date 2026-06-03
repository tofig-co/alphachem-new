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

  const select = (slug?: string) => {
    router.push(slug ? `/${locale}/products?category=${slug}` : `/${locale}/products`)
  }

  const base    = 'font-display text-[9px] font-700 tracking-[0.15em] uppercase px-4 py-2.5 border transition-all duration-200'
  const active  = 'bg-[--navy] text-white border-[--navy]'
  const inactive = 'bg-transparent text-[--muted] border-[--border] hover:border-[--navy] hover:text-[--navy]'

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => select()} className={`${base} ${!activeSlug ? active : inactive}`}>
        {t('all_categories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => select(cat.slug)}
          className={`${base} ${activeSlug === cat.slug ? 'bg-[--gold] text-white border-[--gold]' : inactive}`}
        >
          {tc(cat.slug as Parameters<typeof tc>[0])}
        </button>
      ))}
    </div>
  )
}
