'use client'

import { useState } from 'react'
import { createProduct, updateProduct } from './actions'
import type { Category } from '@/types'

interface Translation { locale: string; name: string; description: string | null }
interface Product {
  id: string; slug: string; category_id: string; image_url: string | null;
  sort_order: number; active: boolean; translations: Translation[]
}
interface Props { categories: Category[]; product?: Product }

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
        <div>
          <label className="field-label">Slug</label>
          <input value={product.slug} readOnly className="field bg-surface text-[--subtle] cursor-default" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Category</label>
          <select name="category_id" defaultValue={product?.category_id} required className="field">
            <option value="">— select —</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label_en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Sort Order</label>
          <input type="number" name="sort_order" defaultValue={product?.sort_order ?? 0} className="field" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="active" id="active" defaultChecked={product?.active ?? true} className="w-4 h-4" />
        <label htmlFor="active" className="field-label mb-0 cursor-pointer">Active (visible on site)</label>
      </div>

      <div>
        <label className="field-label">Product Image</label>
        {preview && (
          <div className="w-28 h-28 relative mb-2 bg-surface border border-[--border] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
          </div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          className="field"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) setPreview(URL.createObjectURL(file))
          }}
        />
      </div>

      <div>
        <div className="flex gap-1 mb-4">
          {(['az', 'en', 'ru'] as const).map(locale => (
            <button
              key={locale}
              type="button"
              onClick={() => setTab(locale)}
              className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                tab === locale ? 'bg-corp text-white' : 'bg-surface-2 text-[--muted] hover:bg-surface'
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
                <label className="field-label">
                  Name ({locale.toUpperCase()}) {locale === 'az' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={`name_${locale}`}
                  defaultValue={t(locale)?.name ?? ''}
                  required={locale === 'az'}
                  className="field"
                />
              </div>
              <div>
                <label className="field-label">Description ({locale.toUpperCase()})</label>
                <textarea
                  name={`desc_${locale}`}
                  defaultValue={t(locale)?.description ?? ''}
                  rows={8}
                  className="field"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {product ? 'Update Product' : 'Create Product'}
        </button>
        <a href="/admin/products" className="btn-outline">Cancel</a>
      </div>
    </form>
  )
}
