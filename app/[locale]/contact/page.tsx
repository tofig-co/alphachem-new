import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function ContactPage({ params }: Props) {
  await params
  const t = await getTranslations('contact')

  const contactItems = [
    {
      labelKey: 'address_label' as const,
      valueKey:  'address'      as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.485-2.015-4.5-4.5-4.5z" stroke="#C4921F" strokeWidth="1.2" strokeLinejoin="round"/>
          <circle cx="8" cy="6" r="1.5" stroke="#C4921F" strokeWidth="1.2"/>
        </svg>
      ),
      href: undefined as string | undefined,
    },
    {
      labelKey: 'phone_label' as const,
      valueKey:  'phone'      as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 3C2.5 3 4 1.5 5 1.5s1.5 1 2 2-1 2.5-1 3.5 3 3 3 3 1-2.5 2-2.5 2.5.5 2.5 1.5-2 3-2 3C8 14 2 8 2.5 3z" stroke="#C4921F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: `tel:${t('phone').replace(/\s/g, '')}`,
    },
    {
      labelKey: 'email_label' as const,
      valueKey:  'email'      as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="#C4921F" strokeWidth="1.2"/>
          <path d="M1.5 5l6.5 4.5L14.5 5" stroke="#C4921F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: `mailto:${t('email')}`,
    },
  ]

  return (
    <>
      {/* ── Page header ── */}
      <div className="bg-[--navy] py-20 relative overflow-hidden">
        <span className="absolute top-6 right-12 w-12 h-12 border-t border-r border-[--gold] opacity-20" />
        <span className="absolute bottom-6 left-12 w-12 h-12 border-b border-l border-[--gold] opacity-20" />
        <div className="container-site">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-7 h-px bg-[--gold] block" />
            <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-[--gold]">Alphachem</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-300 uppercase tracking-[0.06em] text-white">
            {t('title')}
          </h1>
          <p className="font-body text-[14px] text-white/45 mt-3">{t('subtitle')}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="py-20">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact details */}
            <div>
              <span className="section-label">{t('title')}</span>
              <div className="gold-rule mb-10" />

              <div className="space-y-10">
                {contactItems.map((item) => (
                  <div key={item.labelKey} className="flex gap-5">
                    <div className="w-9 h-9 border border-[--gold]/25 flex items-center justify-center shrink-0 mt-0.5 bg-[--gold-light]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-[--gold] mb-2">
                        {t(item.labelKey)}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-body text-[14px] text-[--foreground] hover:text-[--gold] transition-colors duration-200"
                        >
                          {t(item.valueKey)}
                        </a>
                      ) : (
                        <p className="font-body text-[14px] text-[--foreground]">{t(item.valueKey)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="mt-12 pt-10 border-t border-[--border]">
                <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-[--muted] mb-3">
                  {`Working Hours`}
                </p>
                <p className="font-body text-[14px] text-[--foreground]">Monday – Friday: 09:00 – 18:00</p>
                <p className="font-body text-[13px] text-[--muted] mt-1">Baku time (UTC +4)</p>
              </div>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-4">
              <div className="relative flex-1 overflow-hidden border border-[--border]" style={{ minHeight: '380px' }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[--gold] z-10" />
                <iframe
                  src="https://maps.google.com/maps?ll=40.4736823,49.9491262&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: 'grayscale(0.5) contrast(1.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="bg-[--gold-light] border border-[--gold]/20 px-5 py-4 flex items-center gap-3">
                <span className="w-4 h-px bg-[--gold] block shrink-0" />
                <p className="font-mono text-[9px] tracking-widest uppercase text-[--gold-hover]">
                  {t('address')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
