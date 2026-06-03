import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteContent } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations('about')
  const tc = await getTranslations('contact')

  const aboutText  = await getSiteContent('about_text', locale as Locale)
  const paragraphs = aboutText?.split('\n').filter(Boolean) ?? []

  const values = [
    {
      num: '01',
      title: locale === 'az' ? 'Keyfiyyət' : locale === 'ru' ? 'Качество' : 'Quality',
      body:  locale === 'az'
        ? 'Məhsullarımız Səhiyyə Nazirliyinin müəyyən etdiyi saxlama şərtlərinə uyğun anbarlarda saxlanılır.'
        : locale === 'ru'
        ? 'Наша продукция хранится на складах, соответствующих требованиям Министерства Здравоохранения.'
        : 'Our products are stored in warehouses meeting conditions set by the Ministry of Health.',
    },
    {
      num: '02',
      title: locale === 'az' ? 'Etibarlılıq' : locale === 'ru' ? 'Надёжность' : 'Reliability',
      body:  locale === 'az'
        ? '2000-ci ildən bəri Azərbaycan kimya sənayesinin etibarlı tərəfdaşıyıq.'
        : locale === 'ru'
        ? 'С 2000 года мы являемся надёжным партнёром химической промышленности Азербайджана.'
        : 'A trusted partner of the Azerbaijani chemical industry since 2000.',
    },
    {
      num: '03',
      title: locale === 'az' ? 'Geniş Şəbəkə' : locale === 'ru' ? 'Широкая Сеть' : 'Wide Network',
      body:  locale === 'az'
        ? 'Ölkə daxilində və xaricdə sektorun aparıcı təşkilatları ilə əməkdaşlıq edirik.'
        : locale === 'ru'
        ? 'Сотрудничаем с ведущими организациями отрасли внутри страны и за рубежом.'
        : 'We cooperate with leading industry organisations domestically and internationally.',
    },
  ]

  return (
    <>
      {/* ── Page header ── */}
      <div className="bg-[--navy] py-20 relative overflow-hidden">
        {/* Deco corner */}
        <span className="absolute top-6 right-12 w-12 h-12 border-t border-r border-[--gold] opacity-20" />
        <span className="absolute bottom-6 left-12 w-12 h-12 border-b border-l border-[--gold] opacity-20" />
        <div className="container-site">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-7 h-px bg-[--gold] block" />
            <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-[--gold]">
              Est. 2000
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-300 uppercase tracking-[0.06em] text-white">
            {t('title')}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="py-20 border-b border-[--border]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Image */}
            <div className="relative lg:sticky lg:top-28">
              <div className="absolute -top-4 -left-4 w-full h-full border border-[--gold]/20 pointer-events-none" />
              <div className="relative bg-[--navy] overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src="https://alphachem.az/images/about-new.jpg"
                  alt="Alphachem"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[--gold]" />
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="section-label">{t('title')}</span>
              <div className="gold-rule mb-8" />
              <div className="space-y-5">
                {paragraphs.length > 0 ? (
                  paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className={`leading-relaxed font-body ${
                        i === 0
                          ? 'text-[15px] text-[--foreground] font-500'
                          : 'text-[14px] text-[--muted]'
                      }`}
                    >
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-[14px] text-[--muted] leading-relaxed font-body">
                    Kimyəvi xammal tədarükü və marketinq şirkəti olan firmamız Alphachem 2000-ci ildən xidmətə başlamışdır.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-[--gold-light]">
        <div className="container-site">
          <div className="mb-10">
            <span className="section-label">
              {locale === 'az' ? 'Prinsiplərimiz' : locale === 'ru' ? 'Наши принципы' : 'Our Principles'}
            </span>
            <div className="gold-rule" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.num} className="bg-[--card] border border-[--border] p-8">
                <p className="font-display text-5xl font-100 text-[--gold] opacity-30 mb-5 tracking-wide">
                  {v.num}
                </p>
                <h3 className="font-display text-[11px] font-700 tracking-[0.15em] uppercase text-[--navy] mb-3">
                  {v.title}
                </h3>
                <p className="font-body text-[13px] text-[--muted] leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="border-t border-[--border] py-14">
        <div className="container-site flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-[11px] tracking-[0.14em] uppercase text-[--muted] mb-1">
              {locale === 'az' ? 'Sualınız var?' : locale === 'ru' ? 'Есть вопросы?' : 'Have a question?'}
            </p>
            <p className="font-body text-[14px] text-[--navy] font-500">{tc('email')}</p>
          </div>
          <Link href={`/${locale}/contact`} className="btn-primary shrink-0">
            {locale === 'az' ? 'Əlaqəyə Keç' : locale === 'ru' ? 'Написать нам' : 'Contact Us'} →
          </Link>
        </div>
      </section>
    </>
  )
}
