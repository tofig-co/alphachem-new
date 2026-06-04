'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <html lang="en">
      <body className="min-h-screen bg-surface flex items-center justify-center" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <div className="bg-white border border-[--border] shadow-sm p-8 w-full max-w-sm">
          <div className="mb-6">
            <p className="font-mono-chem text-[9px] tracking-widest uppercase text-brand mb-1">Alphachem</p>
            <h1 className="text-xl font-semibold text-[--text]">Admin</h1>
          </div>
          <form action={action} className="space-y-4">
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                name="password"
                required
                autoFocus
                className="field"
                placeholder="••••••••"
              />
            </div>
            {state?.error && (
              <p className="text-[13px] text-red-600">{state.error}</p>
            )}
            <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </body>
    </html>
  )
}
