import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, message, productSlug, productName, locale } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save to Supabase
    const { error: dbError } = await supabase.from('inquiries').insert({
      name: name.trim(),
      company: company?.trim() || null,
      email: email.trim(),
      phone: phone?.trim() || null,
      message: message.trim(),
      product_slug: productSlug || null,
      product_name: productName || null,
      locale: locale || 'en',
    })

    if (dbError) {
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // 2. Send email via Resend (gracefully skip if key not set)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)

      const subject = productName
        ? `New Inquiry: ${productName} — from ${company || name}`
        : `New Inquiry from ${company || name}`

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0D2137; padding: 24px 32px;">
            <h1 style="color: #0086A1; font-size: 20px; margin: 0;">New Inquiry — Alphachem</h1>
          </div>
          <div style="padding: 32px; background: #f8fafc;">
            ${productName ? `<p style="background:#DCF3F8;padding:12px 16px;border-left:3px solid #0086A1;margin-bottom:24px;"><strong>Product:</strong> ${productName}</p>` : ''}
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#556070;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${name}</td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#556070;font-size:13px;">Company</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${company}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#556070;font-size:13px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#0086A1;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#556070;font-size:13px;">Phone</td><td style="padding:8px 0;font-size:14px;">${phone}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#556070;font-size:13px;">Language</td><td style="padding:8px 0;font-size:14px;">${locale?.toUpperCase()}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:#fff;border:1px solid #D8E2EA;">
              <p style="color:#556070;font-size:12px;margin:0 0 8px;">Message</p>
              <p style="font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="padding:16px 32px;background:#0D2137;text-align:center;">
            <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">alphachem.az · Baku, Azerbaijan</p>
          </div>
        </div>`

      const { error: emailError } = await resend.emails.send({
        from: 'Alphachem <sales@alphachem.az>',
        to: ['sales@alphachem.az'],
        replyTo: email,
        subject,
        html,
      })

      if (emailError) console.error('Resend error:', emailError)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Inquiry API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
