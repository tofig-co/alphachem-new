'use server'

import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/admin/supabase'
import { revalidatePath } from 'next/cache'

export async function deleteInquiry(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const supabase = createAdminClient()
  await supabase.from('inquiries').delete().eq('id', id)
  revalidatePath('/admin/inquiries')
}
