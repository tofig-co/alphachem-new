import { createClient } from '@/lib/supabase/server'
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm'
import { SubmitButton } from '../_components/SubmitButton'
import { createCategory, updateCategory, deleteCategory } from './actions'
import type { Category } from '@/types'

type Props = { searchParams: Promise<{ edit?: string; error?: string }> }

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-white'
const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5'

export default async function CategoriesPage({ searchParams }: Props) {
  const { edit, error } = await searchParams
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const editing = edit ? categories?.find((c: Category) => c.id === edit) : null

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Categories</h1>
        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-medium">
          {categories?.length ?? 0}
        </span>
      </div>

      {error === 'in-use' && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-lg mb-4">
          Cannot delete: this category has products assigned to it.
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Slug', 'AZ', 'EN', 'RU', 'Order', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat: Category) => (
              <tr key={cat.id} className={`border-b border-slate-100 last:border-0 transition-colors ${edit === cat.id ? 'bg-brand-light/40' : 'hover:bg-slate-50'}`}>
                <td className="px-4 py-3.5 font-mono-chem text-[11px] text-slate-500">{cat.slug}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-900">{cat.label_az}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600">{cat.label_en}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600">{cat.label_ru}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-400">{cat.sort_order}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3 justify-end">
                    <a href={`?edit=${cat.id}`} className="text-[12px] text-brand hover:text-brand-dark transition-colors font-medium">Edit</a>
                    <ConfirmDeleteForm id={cat.id} action={deleteCategory} message={`Delete category "${cat.slug}"?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-[14px] font-semibold text-slate-900 mb-5">
          {editing ? `Edit: ${editing.slug}` : 'Add Category'}
        </h2>
        <form action={editing ? updateCategory : createCategory} className="grid grid-cols-2 gap-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          {!editing && (
            <div className="col-span-2">
              <label className={labelClass}>Slug</label>
              <input name="slug" required className={inputClass} placeholder="e.g. excipient-pharma" />
            </div>
          )}
          <div>
            <label className={labelClass}>Label AZ</label>
            <input name="label_az" required defaultValue={editing?.label_az} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Label EN</label>
            <input name="label_en" defaultValue={editing?.label_en} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Label RU</label>
            <input name="label_ru" defaultValue={editing?.label_ru} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className={inputClass} />
          </div>
          <div className="col-span-2 flex gap-3 mt-1">
            <SubmitButton>{editing ? 'Update' : 'Add Category'}</SubmitButton>
            {editing && (
              <a href="/admin/categories" className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
