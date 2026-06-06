import { requireAdmin } from '@/lib/admin/auth'
import { AdminNav } from './_components/AdminNav'
import { logoutAction } from './actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <html lang="en">
      <body style={{ fontFamily: "'IBM Plex Sans', sans-serif", margin: 0 }}>
        <div className="flex min-h-screen">
          <aside className="w-56 bg-corp text-white flex flex-col shrink-0 fixed top-0 bottom-0">
            <div className="h-0.5 bg-brand shrink-0" />
            <div className="px-5 py-5 border-b border-white/10">
              <p className="font-mono-chem text-[9px] tracking-widest uppercase text-brand">Alphachem</p>
              <p className="text-[14px] font-semibold text-white mt-0.5">Admin</p>
            </div>
            <AdminNav />
            <div className="px-5 py-4 border-t border-white/10">
              <form action={logoutAction}>
                <button type="submit" className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          </aside>
          <main className="flex-1 ml-56 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
