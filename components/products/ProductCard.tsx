import Link from 'next/link'
import Image from 'next/image'
import type { ProductWithTranslation } from '@/types'

interface Props {
  product: ProductWithTranslation
  locale: string
  categoryLabel?: string
}

export default function ProductCard({ product, locale, categoryLabel }: Props) {
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group bg-white border border-[--border] hover:border-[--accent] transition-colors duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[--background] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="4" fill="#E8F0EB" />
              <path d="M20 10v20M10 20h20" stroke="#1A4D2E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {categoryLabel && (
          <span className="text-[10px] font-mono tracking-widest uppercase text-[--muted]">
            {categoryLabel}
          </span>
        )}
        <h3 className="text-sm font-medium text-[--foreground] leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto pt-2">
          <span className="text-xs text-[--accent] font-medium group-hover:underline">
            → Ətraflı
          </span>
        </div>
      </div>
    </Link>
  )
}
