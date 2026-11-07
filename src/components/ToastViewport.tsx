import Toast, { type ToastData } from './Toast'

interface ToastViewportProps {
  toasts: ToastData[]
  onDismiss: (id: number) => void
}

/**
 * Zona fija donde se apilan los avisos. No bloquea la página (pointer-events-none en
 * el contenedor). Abajo en móvil, arriba a la derecha desde `sm`.
 */
export default function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:bottom-auto sm:top-20 sm:items-end sm:px-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
