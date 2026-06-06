'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 w-full max-w-sm">
          <div className="mb-6">
            <p className="font-mono-chem text-[9px] tracking-widest uppercase text-brand mb-1.5">Alphachem</p>
            <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="text-[13px] text-slate-400 mt-1">Sign in to manage your content</p>
          </div>
          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-white"
                placeholder="••••••••"
              />
            </div>
            {state?.error && (
              <p className="text-[13px] text-red-600 flex items-center gap-1.5">
                <span aria-hidden>⚠</span> {state.error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white text-[13px] font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>
        </div>
      </body>
    </html>
  )
}
