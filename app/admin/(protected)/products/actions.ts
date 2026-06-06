'use server'

import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/admin/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import slugify from 'slugify'

async function uploadImage(file: File, bucket: string, name: string): Promise<string | null> {
  const supabase = createAdminClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${name}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: true })
  if (error) return null
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()

  const nameAz = formData.get('name_az') as string
  const slug = slugify(nameAz.trim(), { lower: true, strict: true }) || `product-${Date.now()}`

  const imageFile = formData.get('image') as File | null
  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, 'products', `product-${Date.now()}`)
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      slug,
      category_id: formData.get('category_id') as string,
      sort_order:  Number(formData.get('sort_order') ?? 0),
      active:      formData.get('active') === 'on',
      image_url:   imageUrl,
    })
    .select()
    .single()

  if (error || !product) throw new Error(error?.message ?? 'Failed to create product')

  await supabase.from('product_translations').insert([
    { product_id: product.id, locale: 'az', name: (formData.get('name_az') as string).trim(), description: (formData.get('desc_az') as string) || null },
    { product_id: product.id, locale: 'en', name: (formData.get('name_en') as string)?.trim() ?? '', description: (formData.get('desc_en') as string) || null },
    { product_id: product.id, locale: 'ru', name: (formData.get('name_ru') as string)?.trim() ?? '', description: (formData.get('desc_ru') as string) || null },
  ])

  redirect('/admin/products')
}

export async function updateProduct(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const id = formData.get('id') as string

  const imageFile = formData.get('image') as File | null
  let imageUrl: string | null = (formData.get('currentImageUrl') as string) || null
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, 'products', `product-${id}`)
  }

  await supabase.from('products').update({
    category_id: formData.get('category_id') as string,
    sort_order:  Number(formData.get('sort_order') ?? 0),
    active:      formData.get('active') === 'on',
    image_url:   imageUrl,
  }).eq('id', id)

  await supabase.from('product_translations').upsert([
    { product_id: id, locale: 'az', name: (formData.get('name_az') as string).trim(), description: (formData.get('desc_az') as string) || null },
    { product_id: id, locale: 'en', name: (formData.get('name_en') as string)?.trim() ?? '', description: (formData.get('desc_en') as string) || null },
    { product_id: id, locale: 'ru', name: (formData.get('name_ru') as string)?.trim() ?? '', description: (formData.get('desc_ru') as string) || null },
  ], { onConflict: 'product_id,locale' })

  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const id = formData.get('id') as string
  await supabase.from('product_translations').delete().eq('product_id', id)
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
}
