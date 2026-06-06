'use server'

import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/admin/supabase'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  await supabase.from('categories').insert({
    slug:       formData.get('slug') as string,
    label_az:   formData.get('label_az') as string,
    label_en:   formData.get('label_en') as string,
    label_ru:   formData.get('label_ru') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  })
  redirect('/admin/categories')
}

export async function updateCategory(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  await supabase.from('categories').update({
    label_az:   formData.get('label_az') as string,
    label_en:   formData.get('label_en') as string,
    label_ru:   formData.get('label_ru') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', formData.get('id') as string)
  redirect('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const id = formData.get('id') as string

  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1)

  if (products && products.length > 0) {
    redirect('/admin/categories?error=in-use')
  }

  await supabase.from('categories').delete().eq('id', id)
  redirect('/admin/categories')
}
