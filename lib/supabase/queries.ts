import { createClient } from './server'
import type { Locale, ProductWithTranslation, Category, SliderImage, SiteContent } from '@/types'

export async function getProducts(locale: Locale, categorySlug?: string): Promise<ProductWithTranslation[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      translations:product_translations(*)
    `)
    .eq('active', true)
    .order('sort_order')

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  const { data, error } = await query
  if (error || !data) return []

  return data.map((product) => {
    const translation = product.translations?.find((t: { locale: string }) => t.locale === locale)
      || product.translations?.find((t: { locale: string }) => t.locale === 'az')
    return {
      ...product,
      name: translation?.name ?? '',
      description: translation?.description ?? null,
    }
  })
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<ProductWithTranslation | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      translations:product_translations(*)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null

  const translation = data.translations?.find((t: { locale: string }) => t.locale === locale)
    || data.translations?.find((t: { locale: string }) => t.locale === 'az')

  return {
    ...data,
    name: translation?.name ?? '',
    description: translation?.description ?? null,
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  return data ?? []
}

export async function getSliderImages(): Promise<SliderImage[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('slider_images')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  return data ?? []
}

export async function getSiteContent(key: string, locale: Locale): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .eq('locale', locale)
    .single()
  return data?.value ?? ''
}
