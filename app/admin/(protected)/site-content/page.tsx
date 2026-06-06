import { createClient } from '@/lib/supabase/server'
import { SubmitButton } from '../_components/SubmitButton'
import { updateSiteContent } from './actions'

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-white'
const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5'

export default async function SiteContentPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase.from('site_content').select('*').order('key')

  const grouped = (rows ?? []).reduce<Record<string, Record<string, string>>>((acc, row) => {
    if (!acc[row.key]) acc[row.key] = {}
    acc[row.key][row.locale] = row.value
    return acc
  }, {})

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Site Content</h1>
        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-medium">
          {Object.keys(grouped).length} keys
        </span>
      </div>
      <div className="space-y-6">
        {Object.entries(grouped).map(([key, values]) => (
          <div key={key} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <p className="font-mono-chem text-[9px] tracking-widest uppercase text-brand mb-5">{key}</p>
            <form action={updateSiteContent} className="space-y-4">
              <input type="hidden" name="key" value={key} />
              {(['az', 'en', 'ru'] as const).map((locale) => (
                <div key={locale}>
                  <label className={labelClass}>{locale.toUpperCase()}</label>
                  <textarea
                    name={locale}
                    rows={5}
                    defaultValue={values[locale] ?? ''}
                    className={inputClass}
                  />
                </div>
              ))}
              <SubmitButton>Save changes</SubmitButton>
            </form>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="text-slate-400 text-[13px]">No site content rows found.</p>
        )}
      </div>
    </div>
  )
}
