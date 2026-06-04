import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { timingSafeEqual } from 'crypto'

export async function requireAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  const secret = process.env.ADMIN_SECRET

  if (!secret || !session) redirect('/admin/login')

  const a = Buffer.from(session)
  const b = Buffer.from(secret)
  if (a.length !== b.length || !timingSafeEqual(a, b)) redirect('/admin/login')
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !input) return false
  try {
    const a = Buffer.from(input)
    const b = Buffer.from(password)
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}
