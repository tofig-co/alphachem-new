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
      title: locale === 'az' ? 'Keyfiyyət' : locale === 'ru' ? 'Качество' : 'Quality',
      desc:  locale === 'az'
        ? 'Məhsullarımız Səhiyyə Nazirliyinin şərtlərinə uyğun saxlama şəraitinə malik anbarlarda saxlanılır.'
        : locale === 'ru'
        ? 'Наша продукция хранится на складах, соответствующих требованиям Министерства Здравоохранения.'
        : 'Our products are stored in warehouses that meet the conditions established by the Ministry of Health.',
    },
    {
      title: locale === 'az' ? 'Etibarlılıq' : locale === 'ru' ? 'Надёжность' : 'Reliability',
      desc:  locale === 'az'
        ? '2000-ci ildən bəri Azərbaycan kimya sənayesinin etibarlı tərəfdaşıyıq.'
        : locale === 'ru'
        ? 'С 2000 года — надёжный партнёр химической промышленности Азербайджана.'
        : 'A trusted partner of the Azerbaijani chemical industry since 2000.',
    },
    {
      title: locale === 'az' ? 'Geniş Şəbəkə' : locale === 'ru' ? 'Широкая Сеть' : 'Wide Network',
      desc:  locale === 'az'
        ? 'Ölkə daxilində və xaricdə sektorun aparıcı təşkilatları ilə əməkdaşlıq edirik.'
        : locale === 'ru'
        ? 'Работаем с ведущими отраслевыми организациями в Азербайджане и за рубежом.'
        : 'We cooperate with leading organisations domestically and internationally.',
    },
  ]

  return (
    <>
      {/* Header */}
      <div className="bg-corp" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div className="container-site">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-7 bg-brand" />
            <span className="font-['Space_Mono'] text-[9px] tracking-[0.22em] uppercase text-brand">Est. 2000</span>
          </div>
          <h1 className="text-5xl font-light text-white tracking-tight">{t('title')}</h1>
        </div>
      </div>

      {/* Content */}
      <section className="py-20 bg-white border-b border-[--border]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="relative lg:sticky lg:top-24">
              <div className="overflow-hidden shadow-lg rounded-sm" style={{ aspectRatio: '4/3', backgroundColor: '#0D2137' }}>
                <Image src="https://alphachem.az/images/about-new.jpg" alt="Alphachem" fill className="object-cover opacity-90" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-2 border-brand opacity-20 rounded-sm pointer-events-none" />
            </div>

            <div>
              <span className="section-label">{t('title')}</span>
              <div className="teal-rule mb-8" />
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
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface">
        <div className="container-site">
          <div className="mb-10">
            <span className="section-label">{locale === 'az' ? 'Prinsiplərimiz' : locale === 'ru' ? 'Наши принципы' : 'Our Principles'}</span>
            <div className="teal-rule" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white border border-[--border] p-8 hover:border-brand hover:shadow-sm transition-all duration-200">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center mb-5">
                  <span className="text-brand font-bold text-[13px]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[--text] mb-3">{v.title}</h3>
                <p className="text-[13px] text-[--muted] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-[--border] py-12 bg-white">
        <div className="container-site flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[13px] font-semibold text-[--text] mb-0.5">
              {locale === 'az' ? 'Sualınız var?' : locale === 'ru' ? 'Есть вопросы?' : 'Have a question?'}
            </p>
            <p className="text-[13px] text-[--muted]">{tc('email')}</p>
          </div>
          <Link href={`/${locale}/contact`} className="btn-primary shrink-0">
            {locale === 'az' ? 'Əlaqəyə Keç' : locale === 'ru' ? 'Написать нам' : 'Contact Us'} →
          </Link>
        </div>
      </section>
    </>
  )
}
