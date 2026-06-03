import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const tc = useTranslations('contact')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[--foreground] text-white mt-24">
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & tagline */}
          <div>
            <Image
              src="https://alphachem.az/alpha_logo_colored.svg"
              alt="Alphachem"
              width={120}
              height={32}
              className="brightness-0 invert mb-4"
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {tc('address')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/40 mb-4">
              {tc('subtitle')}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-white/70">{tc('phone')}</p>
              <p className="text-sm text-white/70">{tc('email')}</p>
            </div>
          </div>

          {/* Empty column for balance */}
          <div />
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex items-center justify-between">
          <p className="text-xs text-white/30 font-mono">
            © {year} Alphachem. {t('rights')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
