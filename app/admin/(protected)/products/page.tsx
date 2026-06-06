import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm'
import { deleteProduct } from './actions'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, slug, sort_order, active,
      category:categories(label_en),
      translations:product_translations(locale, name)
    `)
    .order('sort_order')

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[--text]">
          Products <span className="text-[--subtle] font-normal text-base ml-2">{products?.length ?? 0}</span>
        </h1>
        <Link href="/admin/products/new" className="btn-primary text-[11px] py-2 px-4">+ Add Product</Link>
      </div>

      <div className="bg-white border border-[--border] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface border-b border-[--border] text-left">
              {['Name (AZ)', 'Category', 'Active', 'Order', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-[--muted]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border]">
            {products?.map((p) => {
              const nameAz = (p.translations as Array<{locale: string; name: string}>)
                ?.find(t => t.locale === 'az')?.name ?? p.slug
              const catLabel = (p.category as unknown as {label_en: string} | null)?.label_en ?? '—'
              return (
                <tr key={p.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-[--text]">{nameAz}</td>
                  <td className="px-4 py-3 text-[--muted]">{catLabel}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-sm ${p.active ? 'bg-green-100 text-green-700' : 'bg-surface-2 text-[--subtle]'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[--subtle]">{p.sort_order}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-[12px] text-brand hover:text-brand-dark transition-colors">Edit</Link>
                    <ConfirmDeleteForm id={p.id} action={deleteProduct} message={`Delete "${nameAz}"?`} />
                  </td>
                </tr>
              )
            })}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[--subtle]">No products yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
