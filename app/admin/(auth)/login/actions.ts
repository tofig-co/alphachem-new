'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyPassword } from '@/lib/admin/auth'

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = formData.get('password') as string

  if (!verifyPassword(password)) {
    return { error: 'Invalid password' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect('/admin/products')
}
