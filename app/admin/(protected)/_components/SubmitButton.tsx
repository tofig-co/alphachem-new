'use client'

import { useFormStatus } from 'react-dom'

interface Props {
  children?: React.ReactNode
  className?: string
}

export function SubmitButton({ children = 'Save', className }: Props) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-[13px] font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className ?? ''}`}
    >
      {pending && (
        <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {pending ? 'Saving…' : children}
    </button>
  )
}
