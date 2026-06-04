import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Reveal from '@/components/ui/Reveal'
import InquiryForm from '@/components/ui/InquiryForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles = { az: 'Əlaqə', en: 'Contact', ru: 'Контакты' }
  return { title: titles[locale as keyof typeof titles] ?? titles.en }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations('contact')
  const ti = await getTranslations('inquiry')

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
          <p className="text-[14px] text-white/45 mt-2">{t('subtitle')}</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

            {/* Contact details — 2 cols */}
            <Reveal className="lg:col-span-2">
              <div>
                <span className="eyebrow">{t('eyebrow')}</span>
                <div className="teal-line" />

                <div className="space-y-8 mb-10">
                  {[
                    {
                      key: 'address',
                      label: t('address_label'),
                      value: t('address'),
                      href: undefined as string | undefined,
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.485-2.015-4.5-4.5-4.5z" stroke="#0086A1" strokeWidth="1.3" strokeLinejoin="round"/>
                          <circle cx="8" cy="6" r="1.5" stroke="#0086A1" strokeWidth="1.3"/>
                        </svg>
                      ),
                    },
                    {
                      key: 'phone',
                      label: t('phone_label'),
                      value: t('phone'),
                      href: `tel:${t('phone').replace(/\s/g, '')}`,
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2.5 3C2.5 3 4 1.5 5 1.5s1.5 1 2 2-1 2.5-1 3.5 3 3 3 3 1-2.5 2-2.5 2.5.5 2.5 1.5-2 3-2 3C8 14 2 8 2.5 3z" stroke="#0086A1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ),
                    },
                    {
                      key: 'email',
                      label: t('email_label'),
                      value: t('email'),
                      href: `mailto:${t('email')}`,
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="#0086A1" strokeWidth="1.3"/>
                          <path d="M1.5 5l6.5 4.5L14.5 5" stroke="#0086A1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-sm bg-brand-light flex items-center justify-center shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-mono-chem text-[8px] tracking-[0.18em] uppercase text-brand mb-1.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-[14px] text-[--text] hover:text-brand transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-[14px] text-[--text]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-[--border]">
                  <p className="font-mono-chem text-[8px] tracking-widest uppercase text-[--subtle] mb-3">{t('hours_label')}</p>
                  <p className="text-[14px] text-[--text]">{t('hours')}</p>
                  <p className="text-[13px] text-[--muted] mt-1">{t('hours_tz')}</p>
                </div>

                {/* WhatsApp */}
                <div className="mt-8 pt-8 border-t border-[--border]">
                  <a
                    href="https://wa.me/994555350001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-white text-[13px] font-semibold transition-opacity hover:opacity-90"
                    style={{ background: '#25D366' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Inquiry form — 3 cols */}
            <Reveal delay={120} className="lg:col-span-3">
              <div className="bg-surface rounded-sm p-8">
                <h2 className="text-xl font-semibold text-[--text] mb-1">{ti('title')}</h2>
                <p className="text-[13px] text-[--muted] mb-6">{ti('subtitle')}</p>
                <InquiryForm locale={locale} />
              </div>
            </Reveal>
          </div>

          {/* Map */}
          <Reveal>
            <div className="mt-14 rounded-sm overflow-hidden shadow-md" style={{ height: '380px' }}>
              <div className="relative h-full">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand z-10" />
                <iframe
                  src="https://maps.google.com/maps?ll=40.4736823,49.9491262&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: 'grayscale(0.2)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
