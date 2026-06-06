'use server'

import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/admin/supabase'
import { revalidatePath } from 'next/cache'

export async function updateSiteContent(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const key = formData.get('key') as string

  await supabase.from('site_content').upsert([
    { key, locale: 'az', value: (formData.get('az') as string) ?? '' },
    { key, locale: 'en', value: (formData.get('en') as string) ?? '' },
    { key, locale: 'ru', value: (formData.get('ru') as string) ?? '' },
  ], { onConflict: 'key,locale' })

  revalidatePath('/admin/site-content')
}
