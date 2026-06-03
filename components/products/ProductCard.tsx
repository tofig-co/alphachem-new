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
      className="group flex flex-col bg-white border border-[--border] hover:border-brand hover:shadow-md transition-all duration-250"
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#D8E2E9" strokeWidth="1.5" />
              <path d="M10 16h12M16 10v12" stroke="#D8E2E9" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Teal top-bar on hover — driven by parent group */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1 border-t border-[--border] group-hover:border-brand-light transition-colors duration-250">
        {categoryLabel && (
          <span className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-[--muted] group-hover:text-brand transition-colors duration-200">
            {categoryLabel}
          </span>
        )}
        <h3 className="text-[13px] font-semibold text-[--text] leading-snug line-clamp-2 mt-0.5 group-hover:text-brand-dark transition-colors duration-200">
          {product.name}
        </h3>
        <div className="mt-auto pt-3">
          <span className="text-[10px] font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-250">
            Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
