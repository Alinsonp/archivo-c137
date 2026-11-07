import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastApi, type ToastType } from '../context/toast-context'
import type { ToastData } from './Toast'
import ToastViewport from './ToastViewport'

const MAX_VISIBLE = 4

/** Implementación propia de toasts con useState + setTimeout (sin librerías). */
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback((type: ToastType, message: string) => {
    nextId.current += 1
    const toast: ToastData = { id: nextId.current, type, message }
    setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), toast])
  }, [])

  // Objeto estable: los consumidores pueden usarlo en dependencias de efectos sin re-ejecutarlos.
  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
