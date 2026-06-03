export type Locale = 'az' | 'en' | 'ru'

export interface Category {
  id: string
  slug: string
  label_az: string
  label_en: string
  label_ru: string
  sort_order: number
}

export interface Product {
  id: string
  slug: string
  category_id: string
  image_url: string | null
  sort_order: number
  active: boolean
  created_at: string
  category?: Category
  translations?: ProductTranslation[]
}

export interface ProductTranslation {
  id: string
  product_id: string
  locale: Locale
  name: string
  description: string | null
}

export interface ProductWithTranslation extends Product {
  name: string
  description: string | null
}

export interface SliderImage {
  id: string
  image_url: string
  sort_order: number
  active: boolean
}

export interface SiteContent {
  id: string
  key: string
  locale: Locale
  value: string
}
