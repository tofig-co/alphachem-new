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
      className="group flex flex-col bg-[--card] border border-[--border] hover:border-[--gold] hover:shadow-[0_6px_32px_rgba(13,31,53,0.08)] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[--background] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-7 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl font-100 text-[--border]">α</span>
          </div>
        )}

        {/* Gold top line on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[--gold] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1 border-t border-[--border] group-hover:border-[--gold]/30 transition-colors duration-300">
        {categoryLabel && (
          <span className="font-mono text-[8px] tracking-widest uppercase text-[--muted] group-hover:text-[--gold] transition-colors duration-200">
            {categoryLabel}
          </span>
        )}
        <h3 className="font-display text-[13px] font-600 tracking-wide uppercase text-[--navy] leading-snug line-clamp-2 mt-0.5">
          {product.name}
        </h3>
        <div className="mt-auto pt-3">
          <span className="font-mono text-[8px] tracking-widest uppercase text-[--gold] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
