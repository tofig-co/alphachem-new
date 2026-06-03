import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/supabase/queries'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string; slug: string }> }

function parseDescription(text: string | null): {
  specs: { label: string; value: string }[]
  paragraphs: string[]
} {
  if (!text?.trim()) return { specs: [], paragraphs: [] }

  const specRe = /\b(Formula|Формула|IUPAC[^:]{0,25}|Molar[^:]{0,20}|Молярная масса|Молекулярный вес|Molekulyar[^:]{0,12}|Density|Плотность|Sıxlıq|Melting[^:]{0,12}|Ərimə[^:]{0,20}|Температура[^:]{0,20}|CAS[^:]{0,8}):\s*([^\n.]{1,80})/g

  const specs: { label: string; value: string }[] = []
  const seen  = new Set<string>()
  let   prose = text

  for (const m of text.matchAll(specRe)) {
    const label = m[1].trim()
    const value = m[2].trim()
    const key   = label.toLowerCase().split(/\s+/)[0]
    if (!seen.has(key)) {
      seen.add(key)
      specs.push({ label, value })
      prose = prose.replace(m[0], '')
    }
  }

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

  const category = product.category as { label_az?: string; label_en?: string; label_ru?: string; slug?: string } | undefined
  const categoryLabel = category?.[`label_${locale}` as keyof typeof category] as string | undefined

  const { specs, paragraphs } = parseDescription(product.description)

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[--border]">
        <div className="container-site py-3.5 flex items-center gap-2 font-['Space_Mono'] text-[9px] tracking-widest uppercase text-[--subtle]">
          <Link href={`/${locale}/products`} className="hover:text-brand transition-colors">{t('back')}</Link>
          <span>/</span>
          <span className="text-[--muted]">{product.name}</span>
        </div>
      </div>

      <div className="py-14 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20">

            {/* Image */}
            <div>
              <div
                className="relative bg-surface border border-[--border] overflow-hidden rounded-sm"
                style={{ aspectRatio: '1/1' }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand" />
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-contain p-10" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-light text-[--border]">α</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {categoryLabel && (
                <Link
                  href={`/${locale}/products?category=${category?.slug ?? ''}`}
                  className="tag self-start mb-5 hover:bg-brand hover:text-white transition-colors duration-200"
                >
                  {categoryLabel}
                </Link>
              )}

              <h1 className="text-3xl sm:text-4xl font-semibold text-[--text] leading-tight tracking-tight mb-8">
                {product.name}
              </h1>

              {/* Spec table */}
              {specs.length > 0 && (
                <div className="mb-8 border border-[--border] overflow-hidden rounded-sm">
                  <div className="bg-corp px-5 py-3">
                    <p className="font-['Space_Mono'] text-[8px] tracking-[0.2em] uppercase text-brand">
                      {locale === 'az' ? 'Texniki Göstəricilər'
                       : locale === 'ru' ? 'Технические данные'
                       : 'Technical Specifications'}
                    </p>
                  </div>
                  <table className="w-full">
                    <tbody className="divide-y divide-[--border]">
                      {specs.map((s, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-surface'}>
                          <td className="px-5 py-3 font-['Space_Mono'] text-[9px] tracking-widest uppercase text-[--muted] border-r border-[--border] w-[38%] align-top whitespace-nowrap">
                            {s.label}
                          </td>
                          <td className="px-5 py-3 text-[13px] text-[--text] font-medium">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Prose */}
              {paragraphs.length > 0 && (
                <div className="space-y-3.5 mb-10">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-[14px] text-[--muted] leading-relaxed">{p}</p>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto border-t border-[--border] pt-8">
                <p className="font-['Space_Mono'] text-[8px] tracking-widest uppercase text-[--subtle] mb-5">
                  {locale === 'az' ? 'Bu məhsul üçün sorğu göndərin'
                   : locale === 'ru' ? 'Отправить запрос по этому продукту'
                   : 'Send an inquiry for this product'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/${locale}/contact`} className="btn-primary">{t('inquire')} →</Link>
                  <Link href={`/${locale}/products`} className="btn-outline">{t('back')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
