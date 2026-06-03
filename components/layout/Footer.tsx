import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const t    = useTranslations('footer')
  const tnav = useTranslations('nav')
  const tc   = useTranslations('contact')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[--navy] text-white mt-20">
      {/* Gold top rule */}
      <div className="h-[2px] bg-[--gold]" />

      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">

          {/* Brand */}
          <div>
            <Image
              src="/images/alpha_logo_colored.svg"
              alt="Alphachem"
              width={136}
              height={35}
              className="brightness-0 invert mb-5 opacity-80"
            />
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[--gold] mb-3">
              Est. 2000
            </p>
            <p className="text-[13px] text-white/45 leading-relaxed max-w-[200px] font-body">
              {tc('address')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-display text-[9px] tracking-[0.2em] uppercase text-[--gold] mb-6 font-700">
              Navigation
            </p>
            <nav className="space-y-3">
              {[
                { path: '/',        label: tnav('home') },
                { path: '/about',   label: tnav('about') },
                { path: '/products',label: tnav('products') },
                { path: '/contact', label: tnav('contact') },
              ].map((item) => (
                <div key={item.path}>
                  <Link
                    href={item.path}
                    className="font-body text-[13px] text-white/50 hover:text-[--gold] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display text-[9px] tracking-[0.2em] uppercase text-[--gold] mb-6 font-700">
              {tc('title')}
            </p>
            <div className="space-y-5">
              <div>
                <p className="font-mono text-[8px] tracking-widest uppercase text-white/25 mb-1.5">
                  {tc('phone_label')}
                </p>
                <a
                  href={`tel:${tc('phone').replace(/\s/g, '')}`}
                  className="font-body text-[13px] text-white/60 hover:text-[--gold] transition-colors duration-200"
                >
                  {tc('phone')}
                </a>
              </div>
              <div>
                <p className="font-mono text-[8px] tracking-widest uppercase text-white/25 mb-1.5">
                  {tc('email_label')}
                </p>
                <a
                  href={`mailto:${tc('email')}`}
                  className="font-body text-[13px] text-white/60 hover:text-[--gold] transition-colors duration-200"
                >
                  {tc('email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[9px] tracking-widest uppercase text-white/20">
            © {year} Alphachem. {t('rights')}.
          </p>
          <p className="font-mono text-[9px] tracking-widest uppercase text-white/15">
            alphachem.az
          </p>
        </div>
      </div>
    </footer>
  )
}
