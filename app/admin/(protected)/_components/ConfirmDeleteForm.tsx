'use client'

import { useRef } from 'react'

interface Props {
  id: string
  action: (formData: FormData) => Promise<void>
  message?: string
  label?: string
  className?: string
}

export function ConfirmDeleteForm({
  id,
  action,
  message = 'Are you sure? This cannot be undone.',
  label = 'Delete',
  className = 'text-[12px] text-red-500 hover:text-red-700 transition-colors',
}: Props) {
  const ref = useRef<HTMLFormElement>(null)
  return (
    <form ref={ref} action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        className={className}
        onClick={() => {
          if (confirm(message)) ref.current?.requestSubmit()
        }}
      >
        {label}
      </button>
    </form>
  )
}
