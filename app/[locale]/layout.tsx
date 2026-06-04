import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import NextTopLoader from 'nextjs-toploader'
import type { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const META = {
  az: {
    title: 'Alphachem — Kimyəvi Xammal Tədarükü',
    description: 'Azərbaycanda əczaçılıq, baytarlıq və texniki sahələr üçün kimyəvi xammal tədarükü. 2000-ci ildən etibarən.',
  },
  en: {
    title: 'Alphachem — Chemical Raw Materials Supplier',
    description: 'Trusted supplier of pharmaceutical, veterinary and technical chemical raw materials in Azerbaijan. Est. 2000.',
  },
  ru: {
    title: 'Alphachem — Поставщик Химического Сырья',
    description: 'Надёжный поставщик химического сырья для фармацевтики, ветеринарии и технических нужд в Азербайджане. С 2000 года.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale as keyof typeof META] ?? META.en
  return {
    title: { default: m.title, template: '%s | Alphachem' },
    description: m.description,
    metadataBase: new URL('https://alphachem.az'),
    openGraph: {
      siteName: 'Alphachem',
      locale,
      type: 'website',
      images: [{ url: '/images/alpha_logo_colored.svg', width: 332, height: 169 }],
    },
    robots: { index: true, follow: true },
    alternates: {
      languages: {
        az: '/az',
        en: '/en',
        ru: '/ru',
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'az' | 'en' | 'ru')) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextTopLoader color="#0086A1" height={2} showSpinner={false} />
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
