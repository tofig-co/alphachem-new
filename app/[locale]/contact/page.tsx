import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function ContactPage({ params }: Props) {
  await params
  const t = await getTranslations('contact')

  return (
    <>
      {/* Header */}
      <div className="bg-corp" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div className="container-site">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-7 bg-brand" />
            <span className="font-['Space_Mono'] text-[9px] tracking-[0.22em] uppercase text-brand">Alphachem</span>
          </div>
          <h1 className="text-5xl font-light text-white tracking-tight">{t('title')}</h1>
          <p className="text-[14px] text-white/45 mt-2">{t('subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* Contact details */}
            <div>
              <span className="section-label">{t('title')}</span>
              <div className="teal-rule mb-10" />

              <div className="space-y-8">
                {/* Address */}
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-sm bg-brand-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.485-2.015-4.5-4.5-4.5z" stroke="#0086A1" strokeWidth="1.3" strokeLinejoin="round"/>
                      <circle cx="8" cy="6" r="1.5" stroke="#0086A1" strokeWidth="1.3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-['Space_Mono'] text-[8px] tracking-[0.18em] uppercase text-brand mb-2">{t('address_label')}</p>
                    <p className="text-[14px] text-[--text]">{t('address')}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-sm bg-brand-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2.5 3C2.5 3 4 1.5 5 1.5s1.5 1 2 2-1 2.5-1 3.5 3 3 3 3 1-2.5 2-2.5 2.5.5 2.5 1.5-2 3-2 3C8 14 2 8 2.5 3z" stroke="#0086A1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-['Space_Mono'] text-[8px] tracking-[0.18em] uppercase text-brand mb-2">{t('phone_label')}</p>
                    <a href={`tel:${t('phone').replace(/\s/g, '')}`} className="text-[14px] text-[--text] hover:text-brand transition-colors">{t('phone')}</a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-sm bg-brand-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="#0086A1" strokeWidth="1.3"/>
                      <path d="M1.5 5l6.5 4.5L14.5 5" stroke="#0086A1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-['Space_Mono'] text-[8px] tracking-[0.18em] uppercase text-brand mb-2">{t('email_label')}</p>
                    <a href={`mailto:${t('email')}`} className="text-[14px] text-[--text] hover:text-brand transition-colors">{t('email')}</a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-10 pt-8 border-t border-[--border]">
                <p className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-[--subtle] mb-3">Working Hours</p>
                <p className="text-[14px] text-[--text]">Monday – Friday: 09:00 – 18:00</p>
                <p className="text-[13px] text-[--muted] mt-1">Baku time (UTC +4)</p>
              </div>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-4">
              <div className="relative flex-1 border border-[--border] overflow-hidden rounded-sm" style={{ minHeight: '400px' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand z-10" />
                <iframe
                  src="https://maps.google.com/maps?ll=40.4736823,49.9491262&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: 'grayscale(0.3)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="bg-brand-light border border-brand/20 px-5 py-4 flex items-center gap-3 rounded-sm">
                <div className="h-px w-5 bg-brand shrink-0" />
                <p className="font-['Space_Mono'] text-[9px] tracking-widest uppercase text-brand-dark">{t('address')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
