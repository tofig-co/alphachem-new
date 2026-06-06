import { createClient } from '@/lib/supabase/server'
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm'
import { deleteInquiry } from './actions'

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="px-8 py-8">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Inquiries</h1>
        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-medium">
          {inquiries?.length ?? 0}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Date', 'Name', 'Company', 'Email', 'Phone', 'Product', 'Message', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries?.map((inq) => (
              <tr key={inq.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                <td className="px-4 py-3.5 text-[12px] text-slate-400 whitespace-nowrap">
                  {new Date(inq.created_at).toLocaleDateString('en-GB')}
                </td>
                <td className="px-4 py-3.5 text-[13px] font-medium text-slate-900 whitespace-nowrap">{inq.name}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600">{inq.company ?? '—'}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600">{inq.email}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600 whitespace-nowrap">{inq.phone ?? '—'}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600">{inq.product_name ?? '—'}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600 max-w-[180px] truncate" title={inq.message}>
                  {inq.message}
                </td>
                <td className="px-4 py-3.5">
                  <ConfirmDeleteForm id={inq.id} action={deleteInquiry} message="Delete this inquiry?" />
                </td>
              </tr>
            ))}
            {(!inquiries || inquiries.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[13px] text-slate-400">No inquiries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
