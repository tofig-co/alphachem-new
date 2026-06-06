'use server'

import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/admin/supabase'
import { revalidatePath } from 'next/cache'

export async function createSlide(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const file = formData.get('image') as File
  if (!file || file.size === 0) return

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `slide-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from('slider')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) return

  const publicUrl = supabase.storage.from('slider').getPublicUrl(path).data.publicUrl
  await supabase.from('slider_images').insert({
    image_url: publicUrl,
    sort_order: Number(formData.get('sort_order') ?? 0),
    active: formData.get('active') === 'on',
  })
  revalidatePath('/admin/slider')
}

export async function updateSlide(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  await supabase.from('slider_images').update({
    sort_order: Number(formData.get('sort_order') ?? 0),
    active: formData.get('active') === 'on',
  }).eq('id', formData.get('id') as string)
  revalidatePath('/admin/slider')
}

export async function deleteSlide(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const id = formData.get('id') as string

  const { data: slide } = await supabase.from('slider_images').select('image_url').eq('id', id).single()
  if (slide?.image_url) {
    const raw = slide.image_url.split('/').pop() ?? ''
    const path = raw.split('?')[0]
    if (path) await supabase.storage.from('slider').remove([path])
  }

  await supabase.from('slider_images').delete().eq('id', id)
  revalidatePath('/admin/slider')
}
