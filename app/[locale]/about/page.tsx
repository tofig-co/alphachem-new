import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Reveal from '@/components/ui/Reveal'
import { getSiteContent } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles = { az: 'Haqqımızda', en: 'About Us', ru: 'О нас' }
  return { title: titles[locale as keyof typeof titles] ?? titles.en }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations('about')
  const tc = await getTranslations('contact')

  const aboutText  = await getSiteContent('about_text', locale as Locale)
  const paragraphs = aboutText?.split('\n').filter(Boolean) ?? []

  const values = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2l2.4 4.8L18 7.6l-4 3.9.9 5.5L10 14.4 5.1 17l.9-5.5-4-3.9 5.6-.8L10 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
      ),
      title: locale === 'az' ? 'Keyfiyyət' : locale === 'ru' ? 'Качество' : 'Quality',
      desc: locale === 'az'
        ? 'Məhsullarımız Səhiyyə Nazirliyinin şərtlərinə cavab verən saxlama şəraitinə malik anbarlarda saxlanılır.'
        : locale === 'ru'
        ? 'Продукция хранится на складах, соответствующих требованиям Министерства Здравоохранения.'
        : 'Products stored in warehouses meeting Ministry of Health storage requirements.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 10l4 4 10-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: locale === 'az' ? 'Etibarlılıq' : locale === 'ru' ? 'Надёжность' : 'Reliability',
      desc: locale === 'az'
        ? '2000-ci ildən bəri Azərbaycan kimya sənayesinin etibarlı tərəfdaşıyıq.'
        : locale === 'ru'
        ? 'Надёжный партнёр химической промышленности Азербайджана с 2000 года.'
        : 'Trusted partner of the Azerbaijani chemical industry since 2000.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
      title: locale === 'az' ? 'Sürət' : locale === 'ru' ? 'Скорость' : 'Speed',
      desc: locale === 'az'
        ? 'Tələb olunan xammalı ən qısa müddətdə ən etibarlı mənbələrdən təmin edirik.'
        : locale === 'ru'
        ? 'Поставляем необходимое сырьё в кратчайшие сроки из наиболее надёжных источников.'
        : 'We source required materials as quickly as possible from the most reliable suppliers.',
    },
  ]

  const timeline = [
    { year: '2000', event: locale === 'az' ? 'Alphachem-in əsası qoyuldu' : locale === 'ru' ? 'Основание Alphachem' : 'Alphachem founded' },
    { year: '2005', event: locale === 'az' ? 'Əczaçılıq sektoruna genişlənmə' : locale === 'ru' ? 'Расширение в фармацевтику' : 'Expansion into pharmaceutical sector' },
    { year: '2010', event: locale === 'az' ? 'Beynəlxalq tərəfdaşlıqlar' : locale === 'ru' ? 'Международные партнёрства' : 'International partnerships established' },
    { year: '2020', event: locale === 'az' ? '20 il xidmət' : locale === 'ru' ? '20 лет работы' : '20 years of service' },
    { year: '2025', event: locale === 'az' ? '35+ məhsul, 3 dil' : locale === 'ru' ? '35+ продуктов, 3 языка' : '35+ products, 3 languages' },
  ]

  return (
    <>
      {/* Header */}
      <div className="bg-corp" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div className="container-site">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-px bg-brand" />
            <span className="font-mono-chem text-[9px] tracking-[0.22em] uppercase text-brand">{t('eyebrow')}</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-light text-white tracking-tight">{t('title')}</h1>
        </div>
      </div>

      {/* Main content */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <div className="relative overflow-hidden rounded-sm shadow-xl bg-corp" style={{ aspectRatio: '4/3' }}>
                  <Image src="https://alphachem.az/images/about-new.jpg" alt="Alphachem" fill className="object-cover opacity-90" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-light rounded-sm -z-10" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <span className="eyebrow">{t('eyebrow')}</span>
              <div className="teal-line" />
              <div className="space-y-5">
                {paragraphs.length > 0 ? paragraphs.map((para, i) => (
                  <p key={i} className={`leading-relaxed ${i === 0 ? 'text-[15px] font-medium text-[--text]' : 'text-[14px] text-[--muted]'}`}>
                    {para}
                  </p>
                )) : (
                  <p className="text-[14px] text-[--muted] leading-relaxed">
                    Kimyəvi xammal tədarükü və marketinq şirkəti olan firmamız Alphachem 2000-ci ildən xidmətə başlamışdır.
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-surface">
        <div className="container-site">
          <Reveal>
            <span className="eyebrow">{t('timeline_title')}</span>
            <div className="teal-line" />
          </Reveal>
          <div className="relative mt-8">
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-[--border]" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={i * 80}>
                  <div className="flex items-start gap-6">
                    <div className="w-16 shrink-0 text-right">
                      <span className="font-mono-chem text-[11px] font-bold text-brand">{item.year}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-brand border-2 border-white shadow-sm" />
                    </div>
                    <p className="text-[14px] text-[--text] pt-0.5 pl-2">{item.event}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <Reveal>
            <span className="eyebrow">{t('values_title')}</span>
            <div className="teal-line" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="p-8 bg-surface rounded-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand mb-5">
                    {v.icon}
                  </div>
                  <h3 className="text-[14px] font-bold text-[--text] mb-2">{v.title}</h3>
                  <p className="text-[13px] text-[--muted] leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="border-t border-[--border] py-12 bg-white">
        <div className="container-site flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Reveal>
            <div>
              <p className="text-[14px] font-semibold text-[--text] mb-0.5">
                {locale === 'az' ? 'Sualınız var?' : locale === 'ru' ? 'Есть вопросы?' : 'Have a question?'}
              </p>
              <p className="text-[13px] text-[--muted]">{tc('email')}</p>
            </div>
          </Reveal>
          <Link href={`/${locale}/contact`} className="btn-primary shrink-0">
            {locale === 'az' ? 'Bizimlə Əlaqə' : locale === 'ru' ? 'Написать нам' : 'Contact Us'} →
          </Link>
        </div>
      </div>
    </>
  )
}
