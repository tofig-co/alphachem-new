'use server'

import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/admin/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import slugify from 'slugify'

export async function deleteProduct(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const id = formData.get('id') as string
  await supabase.from('product_translations').delete().eq('product_id', id)
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
}
