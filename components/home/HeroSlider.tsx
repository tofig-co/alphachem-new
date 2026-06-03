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
    <section className="relative overflow-hidden" style={{ minHeight: '88vh', backgroundColor: '#0D2137' }}>

      {/* Background images */}
      {images.map((img, i) => (
        <div
          key={img.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={img.image_url}
            alt={`slide ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay — left heavy so text is always legible */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(13,33,55,0.96) 0%, rgba(13,33,55,0.85) 45%, rgba(13,33,55,0.40) 75%, rgba(13,33,55,0.15) 100%)' }}
      />

      {/* Subtle teal top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand z-10" />

      {/* Content */}
      <div className="relative z-10 container-site flex flex-col justify-center h-full py-24" style={{ minHeight: '88vh' }}>
        <div className="max-w-2xl">

          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-brand" />
            <span className="font-['Space_Mono'] text-[9px] tracking-[0.25em] uppercase text-brand">
              Est. 2000 — Baku, Azerbaijan
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight mb-5">
            {t('hero_title')}
          </h1>

          <p className="font-['Space_Mono'] text-[10px] tracking-[0.18em] uppercase text-white/40 mb-12">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/products`} className="btn-primary">
              {t('hero_cta')}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-outline-white">
              {locale === 'az' ? 'Əlaqə' : locale === 'ru' ? 'Контакты' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-px bg-white/25 transition-all duration-500"
              style={{ width: i === current ? '2rem' : '0.75rem', backgroundColor: i === current ? '#0086A1' : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
