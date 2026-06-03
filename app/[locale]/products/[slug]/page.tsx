import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('products')

  const product = await getProductBySlug(slug, locale as Locale)
  if (!product) notFound()

  const category = product.category as { label_az?: string; label_en?: string; label_ru?: string } | undefined
  const categoryLabel = category?.[`label_${locale}` as keyof typeof category] ?? ''

  return (
    <div className="py-14">
      <div className="container-site">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[--muted] mb-10">
          <Link href={`/${locale}/products`} className="hover:text-[--accent] transition-colors">
            {t('back')}
          </Link>
          <span>›</span>
          <span className="text-[--foreground]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image */}
          <div className="bg-white border border-[--border] aspect-square relative flex items-center justify-center p-10">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain p-10"
              />
            ) : (
              <div className="w-20 h-20 bg-[--accent-light] rounded-full" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {categoryLabel && (
              <span className="tag mb-4">{categoryLabel}</span>
            )}
            <h1 className="text-3xl font-light text-[--foreground] tracking-tight mb-6">
              {product.name}
            </h1>

            {product.description && (
              <div className="text-sm text-[--muted] leading-relaxed space-y-3 mb-10">
                {product.description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            <div className="mt-auto border-t border-[--border] pt-8">
              <Link href={`/${locale}/contact`} className="btn-primary">
                {t('inquire')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
