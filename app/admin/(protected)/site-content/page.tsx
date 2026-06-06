import { createClient } from '@/lib/supabase/server'
import { updateSiteContent } from './actions'

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
      <h1 className="text-xl font-semibold text-[--text] mb-6">Site Content</h1>
      <div className="space-y-6">
        {Object.entries(grouped).map(([key, values]) => (
          <div key={key} className="bg-white border border-[--border] p-6">
            <p className="font-mono-chem text-[9px] tracking-widest uppercase text-brand mb-4">{key}</p>
            <form action={updateSiteContent} className="space-y-4">
              <input type="hidden" name="key" value={key} />
              {(['az', 'en', 'ru'] as const).map((locale) => (
                <div key={locale}>
                  <label className="field-label">{locale.toUpperCase()}</label>
                  <textarea
                    name={locale}
                    rows={5}
                    defaultValue={values[locale] ?? ''}
                    className="field"
                  />
                </div>
              ))}
              <button type="submit" className="btn-primary text-[12px] py-2 px-4">Save</button>
            </form>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="text-[--subtle] text-[13px]">No site content rows found in the database.</p>
        )}
      </div>
    </div>
  )
}
