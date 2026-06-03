import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function ContactPage({ params }: Props) {
  await params
  const t = await getTranslations('contact')

  return (
    <div className="py-14">
      <div className="container-site">
        <div className="mb-12 pb-8 border-b border-[--border]">
          <p className="section-label">{t('title')}</p>
          <h1 className="text-2xl font-light text-[--foreground] tracking-tight mt-1">
            {t('subtitle')}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-[--muted] mb-2">
                {t('address_label')}
              </p>
              <p className="text-sm text-[--foreground]">{t('address')}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-[--muted] mb-2">
                {t('phone_label')}
              </p>
              <a
                href={`tel:${t('phone').replace(/\s/g, '')}`}
                className="text-sm text-[--foreground] hover:text-[--accent] transition-colors"
              >
                {t('phone')}
              </a>
            </div>
            <div>
              <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-[--muted] mb-2">
                {t('email_label')}
              </p>
              <a
                href={`mailto:${t('email')}`}
                className="text-sm text-[--foreground] hover:text-[--accent] transition-colors"
              >
                {t('email')}
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="h-80 bg-[--border] overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?ll=40.4736823,49.9491262&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
