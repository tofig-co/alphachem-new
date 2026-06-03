import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { getSiteContent } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('about')

  const aboutText = await getSiteContent('about_text', locale as Locale)

  return (
    <div className="py-14">
      <div className="container-site">
        <div className="mb-12 pb-8 border-b border-[--border]">
          <p className="section-label">{t('title')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <Image
              src="https://alphachem.az/images/about-new.jpg"
              alt="Alphachem"
              width={600}
              height={450}
              className="w-full object-cover"
            />
          </div>
          <div className="text-sm text-[--muted] leading-relaxed space-y-5">
            {aboutText ? (
              aboutText.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <p>
                Kimyəvi xammal tədarükü və marketinq şirkəti olan firmamız Alphachem
                2000-ci ildən xidmətə başlamışdır.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
