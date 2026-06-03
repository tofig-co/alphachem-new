import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const t    = useTranslations('footer')
  const tnav = useTranslations('nav')
  const tc   = useTranslations('contact')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-corp text-white mt-16">
      <div className="h-[3px] bg-brand" />
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* Brand */}
          <div>
            <Image
              src="/images/alpha_logo_colored.svg"
              alt="Alphachem"
              width={140}
              height={36}
              className="brightness-0 invert mb-5 opacity-75"
            />
            <p className="font-['Space_Mono'] text-[8px] tracking-[0.2em] uppercase text-brand mb-3">Est. 2000</p>
            <p className="text-[13px] text-white/45 leading-relaxed max-w-[200px]">{tc('address')}</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-['Space_Mono'] text-[8px] tracking-[0.2em] uppercase text-brand mb-5">Navigation</p>
            <nav className="space-y-2.5">
              {[
                { path: '/',        label: tnav('home') },
                { path: '/about',   label: tnav('about') },
                { path: '/products',label: tnav('products') },
                { path: '/contact', label: tnav('contact') },
              ].map((item) => (
                <div key={item.path}>
                  <Link
                    href={item.path}
                    className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-['Space_Mono'] text-[8px] tracking-[0.2em] uppercase text-brand mb-5">
              {tc('title')}
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-white/25 mb-1">{tc('phone_label')}</p>
                <a
                  href={`tel:${tc('phone').replace(/\s/g, '')}`}
                  className="text-[13px] text-white/60 hover:text-white transition-colors duration-200"
                >
                  {tc('phone')}
                </a>
              </div>
              <div>
                <p className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-white/25 mb-1">{tc('email_label')}</p>
                <a
                  href={`mailto:${tc('email')}`}
                  className="text-[13px] text-white/60 hover:text-white transition-colors duration-200"
                >
                  {tc('email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex items-center justify-between">
          <p className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-white/20">
            © {year} Alphachem. {t('rights')}.
          </p>
          <p className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-white/15">
            alphachem.az
          </p>
        </div>
      </div>
    </footer>
  )
}
