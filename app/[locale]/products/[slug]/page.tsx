import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string; slug: string }> }

/* ── Spec parser ─────────────────────────────────────────
   Extracts "Label: Value" lines that match known chemical
   property keywords (EN / AZ / RU), returns the rest as
   prose paragraphs.
──────────────────────────────────────────────────────── */
function parseDescription(text: string | null): {
  specs: { label: string; value: string }[]
  paragraphs: string[]
} {
  if (!text?.trim()) return { specs: [], paragraphs: [] }

  // Greedy match: "KnownKeyword[optional suffix]: Value[up to 80 chars]"
  const specRe = /\b(Formula|Формула|IUPAC[^:]{0,25}|Molar[^:]{0,20}|Молярная масса|Молекулярный вес|Molekulyar[^:]{0,12}|Density|Плотность|Sıxlıq|Melting[^:]{0,12}|Ərimə[^:]{0,20}|Температура[^:]{0,20}|CAS[^:]{0,8}):\s*([^\n.]{1,80})/g

  const specs: { label: string; value: string }[] = []
  const seen  = new Set<string>()
  let   prose = text

  for (const m of text.matchAll(specRe)) {
    const label = m[1].trim()
    const value = m[2].trim()
    const key   = label.toLowerCase().replace(/\s+/g, '-')
    if (!seen.has(key)) {
      seen.add(key)
      specs.push({ label, value })
      prose = prose.replace(m[0], '')
    }
  }

  // Clean up leftover whitespace / punctuation and split into paragraphs
  const paragraphs = prose
    .replace(/\s{2,}/g, ' ')
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 25)

  return { specs, paragraphs }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('products')

  const product = await getProductBySlug(slug, locale as Locale)
  if (!product) notFound()

  const category      = product.category as { label_az?: string; label_en?: string; label_ru?: string; slug?: string } | undefined
  const categoryLabel = category?.[`label_${locale}` as keyof typeof category] as string | undefined

  const { specs, paragraphs } = parseDescription(product.description)

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="bg-[--card] border-b border-[--border]">
        <div className="container-site py-4 flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase text-[--muted]">
          <Link href={`/${locale}/products`} className="hover:text-[--gold] transition-colors duration-200">
            {t('back')}
          </Link>
          <span className="text-[--border]">/</span>
          <span className="text-[--navy]">{product.name}</span>
        </div>
      </div>

      {/* ── Detail layout ── */}
      <div className="py-16">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

            {/* Image */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-[--gold]/20 pointer-events-none" />
              <div className="relative bg-[--card] border border-[--border] overflow-hidden" style={{ aspectRatio: '1/1' }}>
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-12"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[--background]">
                    <span className="font-display text-8xl font-100 text-[--border]">α</span>
                  </div>
                )}
                {/* Gold top bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[--gold]" />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {/* Category */}
              {categoryLabel && (
                <Link
                  href={`/${locale}/products?category=${category?.slug ?? ''}`}
                  className="tag self-start mb-5 hover:bg-[--gold] hover:text-white transition-colors duration-200"
                >
                  {categoryLabel}
                </Link>
              )}

              {/* Name */}
              <h1 className="font-display text-4xl sm:text-5xl font-300 uppercase tracking-[0.04em] text-[--navy] leading-tight mb-8">
                {product.name}
              </h1>

              {/* Spec table */}
              {specs.length > 0 && (
                <div className="mb-8 border border-[--border]">
                  <div className="bg-[--navy] px-5 py-2.5">
                    <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-[--gold]">
                      {locale === 'az' ? 'Texniki Göstəricilər'
                       : locale === 'ru' ? 'Технические Данные'
                       : 'Technical Specifications'}
                    </p>
                  </div>
                  <table className="w-full">
                    <tbody>
                      {specs.map((s, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-[--card]' : 'bg-[--background]'}>
                          <td className="px-5 py-3 font-mono text-[9px] tracking-widest uppercase text-[--muted] border-r border-[--border] w-2/5 align-top">
                            {s.label}
                          </td>
                          <td className="px-5 py-3 font-body text-[13px] text-[--navy]">
                            {s.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Prose paragraphs */}
              {paragraphs.length > 0 && (
                <div className="space-y-4 mb-10">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="font-body text-[14px] text-[--muted] leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto border-t border-[--border] pt-8">
                <p className="font-mono text-[8px] tracking-widest uppercase text-[--muted] mb-5">
                  {locale === 'az' ? 'Bu məhsul üçün sorğu göndərin'
                   : locale === 'ru' ? 'Отправить запрос по этому продукту'
                   : 'Send an inquiry for this product'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/${locale}/contact`} className="btn-primary">
                    {t('inquire')} →
                  </Link>
                  <Link href={`/${locale}/products`} className="btn-outline">
                    {t('back')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
