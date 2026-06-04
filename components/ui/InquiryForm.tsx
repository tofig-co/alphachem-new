'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  locale: string
  productSlug?: string
  productName?: string
}

export default function InquiryForm({ locale, productSlug, productName }: Props) {
  const t = useTranslations('inquiry')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const fd = new FormData(e.currentTarget)
    const body = {
      name:        fd.get('name') as string,
      company:     fd.get('company') as string,
      email:       fd.get('email') as string,
      phone:       fd.get('phone') as string,
      message:     fd.get('message') as string,
      productSlug: productSlug ?? '',
      productName: productName ?? '',
      locale,
    }

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-brand-light rounded-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 11l5 5L18 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="font-semibold text-[--text] text-[15px] mb-1">{t('success_title')}</p>
        <p className="text-[13px] text-[--muted]">{t('success_body')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label">{t('name')} *</label>
          <input name="name" required type="text" placeholder={t('name_ph')} className="field" />
        </div>
        <div>
          <label className="field-label">{t('company')}</label>
          <input name="company" type="text" placeholder={t('company_ph')} className="field" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label">{t('email')} *</label>
          <input name="email" required type="email" placeholder={t('email_ph')} className="field" />
        </div>
        <div>
          <label className="field-label">{t('phone')}</label>
          <input name="phone" type="tel" placeholder={t('phone_ph')} className="field" />
        </div>
      </div>

      <div>
        <label className="field-label">{t('message')} *</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder={t('message_ph')}
          className="field resize-none"
          defaultValue={productName ? `${locale === 'az' ? 'Məhsul' : locale === 'ru' ? 'Продукт' : 'Product'}: ${productName}\n` : ''}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-[13px]">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
