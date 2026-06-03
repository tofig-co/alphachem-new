'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { SliderImage } from '@/types'

export default function HeroSlider({ images, locale }: { images: SliderImage[]; locale: string }) {
  const t = useTranslations('home')
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [images.length, next])

  if (images.length === 0) {
    return (
      <div className="relative h-[500px] bg-[--accent-light] flex items-center justify-center">
        <div className="container-site text-center">
          <h1 className="text-4xl font-light text-[--foreground] mb-6 tracking-tight">
            Alpha Chemicals
          </h1>
          <Link href={`/${locale}/products`} className="btn-primary">
            {t('hero_cta')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[520px] overflow-hidden bg-gray-100">
      {images.map((img, i) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={img.image_url}
            alt={`Alphachem slide ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Overlay content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container-site pb-14">
          <Link href={`/${locale}/products`} className="btn-primary">
            {t('hero_cta')} →
          </Link>
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-10 z-10 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
