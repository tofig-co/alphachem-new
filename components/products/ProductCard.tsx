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
      className="group flex flex-col bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-light text-[--subtle]">α</span>
          </div>
        )}
        {/* teal bar reveals on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {categoryLabel && (
          <span className="font-mono-chem text-[8px] tracking-widest uppercase text-[--subtle] group-hover:text-brand transition-colors mb-1">
            {categoryLabel}
          </span>
        )}
        <h3 className="text-[13px] font-semibold text-[--text] leading-snug line-clamp-2 group-hover:text-brand-dark transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] font-semibold text-brand">Details →</span>
        </div>
      </div>
    </Link>
  )
}
