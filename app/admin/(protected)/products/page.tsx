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
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Products</h1>
          <span className="ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-medium">
            {products?.length ?? 0}
          </span>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-[13px] font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Name (AZ)</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => {
              const nameAz = (p.translations as Array<{ locale: string; name: string }>)
                ?.find(t => t.locale === 'az')?.name ?? p.slug
              const catLabel = (p.category as unknown as { label_en: string } | null)?.label_en ?? '—'
              return (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                  <td className="px-4 py-3.5 text-[13px] font-medium text-slate-900">{nameAz}</td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-600">{catLabel}</td>
                  <td className="px-4 py-3.5">
                    {p.active
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">Active</span>
                      : <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">Hidden</span>
                    }
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-400">{p.sort_order}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/products/${p.id}`} className="text-[12px] text-brand hover:text-brand-dark transition-colors font-medium">Edit</Link>
                      <ConfirmDeleteForm id={p.id} action={deleteProduct} message={`Delete "${nameAz}"?`} />
                    </div>
                  </td>
                </tr>
              )
            })}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[13px] text-slate-400">No products yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
