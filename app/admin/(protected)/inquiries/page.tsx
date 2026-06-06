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
      <h1 className="text-xl font-semibold text-[--text] mb-6">
        Inquiries <span className="text-[--subtle] font-normal text-base ml-2">{inquiries?.length ?? 0}</span>
      </h1>

      <div className="bg-white border border-[--border] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface border-b border-[--border] text-left">
              {['Date', 'Name', 'Company', 'Email', 'Phone', 'Product', 'Message', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-[--muted] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border]">
            {inquiries?.map((inq) => (
              <tr key={inq.id} className="hover:bg-surface transition-colors">
                <td className="px-4 py-3 text-[--subtle] whitespace-nowrap">
                  {new Date(inq.created_at).toLocaleDateString('en-GB')}
                </td>
                <td className="px-4 py-3 font-medium text-[--text] whitespace-nowrap">{inq.name}</td>
                <td className="px-4 py-3 text-[--muted]">{inq.company ?? '—'}</td>
                <td className="px-4 py-3 text-[--muted]">{inq.email}</td>
                <td className="px-4 py-3 text-[--muted] whitespace-nowrap">{inq.phone ?? '—'}</td>
                <td className="px-4 py-3 text-[--muted]">{inq.product_name ?? '—'}</td>
                <td className="px-4 py-3 text-[--muted] max-w-[200px] truncate" title={inq.message}>
                  {inq.message}
                </td>
                <td className="px-4 py-3">
                  <ConfirmDeleteForm id={inq.id} action={deleteInquiry} message="Delete this inquiry?" />
                </td>
              </tr>
            ))}
            {(!inquiries || inquiries.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[--subtle]">No inquiries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
