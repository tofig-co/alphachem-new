import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

// Real formulas from our product catalog — decorative background
const BG_FORMULAS = [
  { text: 'CaCl₂',     x: '4%',  y: '12%', size: '2rem',   rot: '-8deg',  op: 0.055 },
  { text: 'NaOH',      x: '82%', y: '8%',  size: '2.6rem', rot: '6deg',   op: 0.04  },
  { text: 'MgSO₄',    x: '55%', y: '20%', size: '1.5rem', rot: '-4deg',  op: 0.045 },
  { text: 'KCl',       x: '88%', y: '52%', size: '3rem',   rot: '10deg',  op: 0.035 },
  { text: 'Ca(OH)₂',  x: '12%', y: '72%', size: '1.6rem', rot: '5deg',   op: 0.05  },
  { text: 'ZnSO₄',    x: '68%', y: '78%', size: '1.8rem', rot: '-7deg',  op: 0.04  },
  { text: 'Na₂CO₃',   x: '38%', y: '88%', size: '1.4rem', rot: '3deg',   op: 0.045 },
  { text: 'NH₄Cl',    x: '75%', y: '36%', size: '2.2rem', rot: '-12deg', op: 0.04  },
  { text: 'K₂SO₄',    x: '28%', y: '18%', size: '1.3rem', rot: '8deg',   op: 0.035 },
  { text: 'FeSO₄',    x: '92%', y: '72%', size: '1.5rem', rot: '-5deg',  op: 0.04  },
  { text: 'NaCl',      x: '48%', y: '55%', size: '4rem',   rot: '4deg',   op: 0.025 },
  { text: 'CaCO₃',    x: '6%',  y: '42%', size: '1.4rem', rot: '-6deg',  op: 0.05  },
  { text: 'MgCO₃',    x: '58%', y: '65%', size: '1.6rem', rot: '9deg',   op: 0.04  },
  { text: 'KBr',       x: '22%', y: '55%', size: '2rem',   rot: '-3deg',  op: 0.04  },
  { text: 'NaHCO₃',   x: '35%', y: '35%', size: '1.3rem', rot: '7deg',   op: 0.045 },
]

interface Props {
  locale: string
}

export default async function HeroSection({ locale }: Props) {
  const t = await getTranslations('home')

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0D2137 0%, #0D2D47 60%, #0A1E30 100%)' }}
    >
      {/* Teal accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand z-10" />

      {/* Background chemical formulas */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {BG_FORMULAS.map((f, i) => (
          <span
            key={i}
            className="absolute font-mono-chem font-medium text-white"
            style={{
              left: f.x,
              top: f.y,
              fontSize: f.size,
              opacity: f.op,
              transform: `rotate(${f.rot})`,
              whiteSpace: 'nowrap',
            }}
          >
            {f.text}
          </span>
        ))}
      </div>

      {/* Molecular SVG — right side decorative */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden lg:block" aria-hidden="true">
        <svg viewBox="0 0 600 700" className="w-full h-full opacity-[0.04]" fill="none">
          {/* Nodes */}
          {[
            [120,80],[280,120],[450,80],[540,200],[490,350],[400,480],[250,520],[130,420],[60,280],[200,250],
            [360,260],[470,160],[350,400],[180,380],[310,160],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 8 : 5} fill="white" />
          ))}
          {/* Bonds */}
          {[
            [120,80,280,120],[280,120,450,80],[450,80,540,200],[540,200,490,350],
            [490,350,400,480],[400,480,250,520],[250,520,130,420],[130,420,60,280],
            [60,280,120,80],[200,250,280,120],[200,250,130,420],[360,260,280,120],
            [360,260,490,350],[360,260,400,480],[470,160,450,80],[470,160,540,200],
            [310,160,280,120],[310,160,450,80],[180,380,130,420],[180,380,250,520],
            [350,400,360,260],[350,400,400,480],[200,250,360,260],
          ].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.5" />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container-site py-32">
        <div className="max-w-2xl">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand" />
            <span className="font-mono-chem text-[9px] tracking-[0.28em] uppercase text-brand">
              {t('hero_eyebrow')}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.08] tracking-tight mb-6">
            {t('hero_title')}
          </h1>

          <p className="font-mono-chem text-[10px] tracking-[0.2em] uppercase text-white/40 mb-12">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/products`} className="btn-primary">
              {t('hero_cta')} →
            </Link>
            <Link href={`/${locale}/contact`} className="btn-outline-white">
              {t('hero_cta_secondary')}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { n: '25+', label: t('stats_years') },
              { n: '35+', label: t('stats_products') },
              { n: '✓',   label: t('stats_compliance') },
              { n: '→',   label: t('stats_delivery') },
            ].map((s) => (
              <div key={s.label} className="py-5 px-4 text-center">
                <p className="text-2xl font-bold text-brand mb-0.5 leading-none">{s.n}</p>
                <p className="font-mono-chem text-[8px] tracking-widest uppercase text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
