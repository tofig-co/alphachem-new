import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import InquiryForm from '@/components/ui/InquiryForm'
import ProductCard from '@/components/products/ProductCard'
import Reveal from '@/components/ui/Reveal'
import { getProductBySlug, getProducts } from '@/lib/supabase/queries'
import type { Locale, Category } from '@/types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug, locale as Locale)
  if (!product) return { title: 'Product' }
  return {
    title: product.name,
    description: product.description?.slice(0, 155).replace(/\n/g, ' ') ?? undefined,
  }
}

function parseDescription(text: string | null) {
  if (!text?.trim()) return { specs: [] as { label: string; value: string }[], paragraphs: [] as string[] }

  const specRe = /\b(Formula|Формула|IUPAC[^:]{0,25}|Molar[^:]{0,20}|Молярная масса|Молекулярный вес|Molekulyar[^:]{0,12}|Density|Плотность|Sıxlıq|Melting[^:]{0,12}|Ərimə[^:]{0,20}|Температура[^:]{0,20}|CAS[^:]{0,8}):\s*([^\n.]{1,80})/g

  const specs: { label: string; value: string }[] = []
  const seen = new Set<string>()
  let prose = text

  for (const m of text.matchAll(specRe)) {
    const label = m[1].trim()
    const key = label.toLowerCase().split(/\s+/)[0]
    if (!seen.has(key)) {
      seen.add(key)
      specs.push({ label, value: m[2].trim() })
      prose = prose.replace(m[0], '')
    }
  }

  return {
    specs,
    paragraphs: prose.replace(/\s{2,}/g, ' ').split('\n').map((p) => p.trim()).filter((p) => p.length > 25),
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('products')

  const product = await getProductBySlug(slug, locale as Locale)
  if (!product) notFound()

  const category = product.category as (Category & { slug: string }) | undefined
  const categoryLabel = category?.[`label_${locale}` as keyof typeof category] as string | undefined
  const { specs, paragraphs } = parseDescription(product.description)

  // Related products: same category, exclude current
  const allInCategory = await getProducts(locale as Locale, category?.slug)
  const related = allInCategory.filter((p) => p.slug !== slug).slice(0, 4)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: product.image_url ?? undefined,
    brand: { '@type': 'Brand', name: 'Alphachem' },
    offers: {
      '@type': 'Offer',
      seller: { '@type': 'Organization', name: 'Alphachem' },
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-surface border-b border-[--border]">
        <div className="container-site py-3 flex items-center gap-2 font-mono-chem text-[9px] tracking-widest uppercase text-[--subtle]">
          <Link href={`/${locale}/products`} className="hover:text-brand transition-colors">{t('back')}</Link>
          {categoryLabel && <><span>/</span><Link href={`/${locale}/products?category=${category?.slug}`} className="hover:text-brand transition-colors">{categoryLabel}</Link></>}
          <span>/</span>
          <span className="text-[--muted] truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="py-14 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20">

            {/* Image */}
            <Reveal>
              <div className="relative bg-surface rounded-sm overflow-hidden shadow-md" style={{ aspectRatio: '1/1' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand z-10" />
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-contain p-10" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-light text-[--border]">α</span>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Info */}
            <Reveal delay={100}>
              <div className="flex flex-col">
                {categoryLabel && (
                  <Link href={`/${locale}/products?category=${category?.slug}`} className="tag self-start mb-4 hover:bg-brand hover:text-white transition-colors">
                    {categoryLabel}
                  </Link>
                )}

                <h1 className="text-3xl sm:text-4xl font-semibold text-[--text] leading-tight tracking-tight mb-6">
                  {product.name}
                </h1>

                {/* Specs table */}
                {specs.length > 0 && (
                  <div className="mb-6 rounded-sm overflow-hidden shadow-sm">
                    <div className="bg-corp px-5 py-3">
                      <p className="font-mono-chem text-[8px] tracking-[0.2em] uppercase text-brand">{t('specs_title')}</p>
                    </div>
                    <table className="w-full">
                      <tbody className="divide-y divide-[--border]">
                        {specs.map((s, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-surface'}>
                            <td className="px-5 py-3 font-mono-chem text-[9px] tracking-widest uppercase text-[--muted] border-r border-[--border] w-[38%] align-top">
                              {s.label}
                            </td>
                            <td className="px-5 py-3 text-[13px] text-[--text] font-medium font-mono-chem">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Description */}
                {paragraphs.length > 0 && (
                  <div className="space-y-3 mb-8">
                    {paragraphs.map((p, i) => (
                      <p key={i} className="text-[14px] text-[--muted] leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-[--border] pt-8 mt-auto">
                  <p className="font-mono-chem text-[8px] tracking-widest uppercase text-[--subtle] mb-5">{t('inquiry_prompt')}</p>
                  <InquiryForm locale={locale} productSlug={slug} productName={product.name} />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-[--border]">
              <Reveal>
                <h2 className="text-xl font-semibold text-[--text] mb-8">{t('related_title')}</h2>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.map((product, i) => (
                  <Reveal key={product.id} delay={i * 60}>
                    <ProductCard product={product} locale={locale} categoryLabel={categoryLabel} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
