import { useEffect, useState, type ReactNode } from 'react'
import type { ToastType } from '../context/toast-context'
import { AlertIcon, CheckCircleIcon, CloseIcon, InfoIcon } from './icons'

export interface ToastData {
  id: number
  type: ToastType
  message: string
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: number) => void
}

/** Auto-dismiss: los errores permanecen más tiempo para dar tiempo a leerlos. */
const DURATION_MS: Record<ToastType, number> = {
  success: 4000,
  info: 4000,
  error: 6500,
}

const VARIANTS: Record<ToastType, { icon: ReactNode; accent: string; label: string }> = {
  success: {
    icon: <CheckCircleIcon className="size-5 text-ok" />,
    accent: 'border-l-ok',
    label: 'Éxito',
  },
  error: {
    icon: <AlertIcon className="size-5 text-danger" />,
    accent: 'border-l-danger',
    label: 'Error',
  },
  info: {
    icon: <InfoIcon className="size-5 text-gold" />,
    accent: 'border-l-gold',
    label: 'Información',
  },
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  // Pausar con el puntero o el foco evita que el mensaje desaparezca mientras se lee.
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => onDismiss(toast.id), DURATION_MS[toast.type])
    return () => window.clearTimeout(timer)
  }, [paused, toast.id, toast.type, onDismiss])

  const variant = VARIANTS[toast.type]

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-md border border-l-4 border-line bg-surface p-4 shadow-xl ${variant.accent}`}
    >
      <span className="mt-0.5 shrink-0">{variant.icon}</span>
      <p className="flex-1 text-sm leading-snug">
        <span className="sr-only">{variant.label}: </span>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="-m-1 flex size-9 shrink-0 items-center justify-center rounded-md text-muted hover:text-ink"
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  )
}
