'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { SliderImage } from '@/types'

export default function HeroSlider({ images, locale }: { images: SliderImage[]; locale: string }) {
  const t = useTranslations('home')
  const [current, setCurrent] = useState(0)
  const count = Math.max(images.length, 1)

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count])

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [images.length, next])

  return (
    <div className="relative flex flex-col md:flex-row min-h-[90vh] overflow-hidden">

      {/* ── Left panel — text ── */}
      <div className="relative z-10 flex flex-col justify-center bg-[--navy] px-8 md:px-16 lg:px-20 py-20 md:py-0 md:w-[55%] lg:w-[52%] shrink-0">

        {/* Art Deco corner ornaments */}
        <span className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[--gold] opacity-40" />
        <span className="absolute bottom-8 right-8 md:right-0 w-6 h-6 border-b border-r border-[--gold] opacity-40" />

        {/* Label row */}
        <div className="flex items-center gap-3 mb-10">
          <span className="block w-7 h-px bg-[--gold]" />
          <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-[--gold]">
            Est. 2000 — Baku, Azerbaijan
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-300 text-5xl sm:text-6xl lg:text-7xl text-white uppercase tracking-[0.04em] leading-[1.05] mb-6">
          {t('hero_title')}
        </h1>

        {/* Sector subtitle */}
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-12">
          {t('hero_subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Link href={`/${locale}/products`} className="btn-primary">
            {t('hero_cta')}
          </Link>
          <Link href={`/${locale}/contact`} className="btn-outline-white">
            {locale === 'az' ? 'Əlaqə' : locale === 'ru' ? 'Контакты' : 'Contact Us'}
          </Link>
        </div>

        {/* Slide indicators */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 mt-14">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-px transition-all duration-500 bg-white/30 ${
                  i === current ? 'w-10 !bg-[--gold]' : 'w-4 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Right panel — image ── */}
      <div className="relative flex-1 min-h-[40vh] md:min-h-0">
        {/* Art Deco gold frame on the left edge */}
        <div className="absolute left-0 top-8 bottom-8 w-px bg-[--gold] opacity-30 z-10" />

        {images.length === 0 ? (
          <div className="absolute inset-0 bg-[--navy-mid]" />
        ) : (
          images.map((img, i) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={img.image_url}
                alt={`Alphachem product ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
              />
              {/* Subtle navy vignette on right side */}
              <div className="absolute inset-0 bg-gradient-to-r from-[--navy]/20 to-transparent" />
            </div>
          ))
        )}

        {/* Slide counter — bottom right */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
            <span className="font-mono text-[10px] text-white/60 tabular-nums">
              {String(current + 1).padStart(2, '0')}
            </span>
            <span className="w-6 h-px bg-white/30" />
            <span className="font-mono text-[10px] text-white/30 tabular-nums">
              {String(images.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
