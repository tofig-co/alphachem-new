import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    await supabase.from('categories').select('slug').limit(1)
    return NextResponse.json({ ok: true, time: new Date().toISOString() })
  } catch {
    return NextResponse.json({ ok: false, time: new Date().toISOString() })
  }
}
