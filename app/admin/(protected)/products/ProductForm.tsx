'use client'

import { useState } from 'react'
import { createProduct, updateProduct } from './actions'
import { SubmitButton } from '../_components/SubmitButton'
import type { Category } from '@/types'

interface Translation { locale: string; name: string; description: string | null }
interface Product {
  id: string; slug: string; category_id: string; image_url: string | null;
  sort_order: number; active: boolean; translations: Translation[]
}
interface Props { categories: Category[]; product?: Product }

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-white'
const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5'

export function ProductForm({ categories, product }: Props) {
  const [tab, setTab] = useState<'az' | 'en' | 'ru'>('az')
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null)

  const t = (locale: string) => product?.translations.find(x => x.locale === locale)
  const action = product ? updateProduct : createProduct

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      {product && <input type="hidden" name="id" value={product.id} />}
      {product && <input type="hidden" name="currentImageUrl" value={product.image_url ?? ''} />}

      {product && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className={labelClass}>Slug</label>
          <input value={product.slug} readOnly className={`${inputClass} bg-slate-50 text-slate-400 cursor-default`} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select name="category_id" defaultValue={product?.category_id} required className={inputClass}>
              <option value="">— select —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input type="number" name="sort_order" defaultValue={product?.sort_order ?? 0} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input type="checkbox" name="active" id="active" defaultChecked={product?.active ?? true} className="w-4 h-4 rounded accent-brand" />
          <label htmlFor="active" className="text-[13px] text-slate-700 cursor-pointer">Active (visible on site)</label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className={labelClass}>Product Image</label>
        {preview && (
          <div className="w-28 h-28 relative mb-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
          </div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          className={inputClass}
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) setPreview(URL.createObjectURL(file))
          }}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex gap-1 mb-5">
          {(['az', 'en', 'ru'] as const).map(locale => (
            <button
              key={locale}
              type="button"
              onClick={() => setTab(locale)}
              className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                tab === locale
                  ? 'bg-corp text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {locale}
            </button>
          ))}
        </div>

        {(['az', 'en', 'ru'] as const).map(locale => (
          <div key={locale} className={locale === tab ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Name ({locale.toUpperCase()}){locale === 'az' && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                <input
                  type="text"
                  name={`name_${locale}`}
                  defaultValue={t(locale)?.name ?? ''}
                  required={locale === 'az'}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Description ({locale.toUpperCase()})</label>
                <textarea
                  name={`desc_${locale}`}
                  defaultValue={t(locale)?.description ?? ''}
                  rows={8}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pb-2">
        <SubmitButton>{product ? 'Update Product' : 'Create Product'}</SubmitButton>
        <a
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
