import { createClient } from '@/lib/supabase/server'
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm'
import { createCategory, updateCategory, deleteCategory } from './actions'
import type { Category } from '@/types'

type Props = { searchParams: Promise<{ edit?: string; error?: string }> }

export default async function CategoriesPage({ searchParams }: Props) {
  const { edit, error } = await searchParams
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const editing = edit ? categories?.find((c: Category) => c.id === edit) : null

  const fieldClass = 'field text-[13px]'
  const labelClass = 'field-label'

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-xl font-semibold text-[--text] mb-6">Categories</h1>

      {error === 'in-use' && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 mb-4">
          Cannot delete: this category has products assigned to it.
        </div>
      )}

      <div className="bg-white border border-[--border] overflow-x-auto mb-8">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface border-b border-[--border] text-left">
              {['Slug', 'AZ', 'EN', 'RU', 'Order', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-[--muted]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border]">
            {categories?.map((cat: Category) => (
              <tr key={cat.id} className={`transition-colors ${edit === cat.id ? 'bg-brand-light' : 'hover:bg-surface'}`}>
                <td className="px-4 py-3 font-mono-chem text-[11px] text-[--muted]">{cat.slug}</td>
                <td className="px-4 py-3 text-[--text]">{cat.label_az}</td>
                <td className="px-4 py-3 text-[--muted]">{cat.label_en}</td>
                <td className="px-4 py-3 text-[--muted]">{cat.label_ru}</td>
                <td className="px-4 py-3 text-[--subtle]">{cat.sort_order}</td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <a href={`?edit=${cat.id}`} className="text-[12px] text-brand hover:text-brand-dark transition-colors">Edit</a>
                  <ConfirmDeleteForm id={cat.id} action={deleteCategory} message={`Delete category "${cat.slug}"?`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-[--border] p-6">
        <h2 className="text-[13px] font-semibold text-[--text] mb-4">
          {editing ? `Edit: ${editing.slug}` : 'Add Category'}
        </h2>
        <form action={editing ? updateCategory : createCategory} className="grid grid-cols-2 gap-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          {!editing && (
            <div className="col-span-2">
              <label className={labelClass}>Slug</label>
              <input name="slug" required className={fieldClass} placeholder="e.g. excipient-pharma" />
            </div>
          )}
          <div>
            <label className={labelClass}>Label AZ</label>
            <input name="label_az" required defaultValue={editing?.label_az} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Label EN</label>
            <input name="label_en" defaultValue={editing?.label_en} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Label RU</label>
            <input name="label_ru" defaultValue={editing?.label_ru} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className={fieldClass} />
          </div>
          <div className="col-span-2 flex gap-3 mt-2">
            <button type="submit" className="btn-primary text-[12px] py-2 px-4">
              {editing ? 'Update' : 'Add Category'}
            </button>
            {editing && <a href="/admin/categories" className="btn-outline text-[12px] py-2 px-4">Cancel</a>}
          </div>
        </form>
      </div>
    </div>
  )
}
