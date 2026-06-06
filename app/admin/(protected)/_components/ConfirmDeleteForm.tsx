'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'

interface Props {
  id: string
  action: (formData: FormData) => Promise<void>
  message?: string
  label?: string
  className?: string
}

function DeleteButton({
  label,
  message,
  className,
  formRef,
}: {
  label: string
  message: string
  className: string
  formRef: React.RefObject<HTMLFormElement | null>
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="button"
      disabled={pending}
      className={`${className} ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => {
        if (confirm(message)) formRef.current?.requestSubmit()
      }}
    >
      {pending ? 'Deleting…' : label}
    </button>
  )
}

export function ConfirmDeleteForm({
  id,
  action,
  message = 'Are you sure? This cannot be undone.',
  label = 'Delete',
  className = 'text-[12px] text-red-500 hover:text-red-700 transition-colors font-medium',
}: Props) {
  const ref = useRef<HTMLFormElement | null>(null)
  return (
    <form ref={ref} action={action}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton label={label} message={message} className={className} formRef={ref} />
    </form>
  )
}
