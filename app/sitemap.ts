import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://alphachem.az'
const LOCALES = ['az', 'en', 'ru']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('active', true)

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    { url: `${BASE}/${locale}`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/${locale}/products`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/${locale}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/${locale}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ])

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).flatMap((p) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  return [...staticRoutes, ...productRoutes]
}
