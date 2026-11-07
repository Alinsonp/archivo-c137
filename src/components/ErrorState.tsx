import type { ReactNode } from 'react'
import { buttonClass } from '../utils/buttonStyles'
import { AlertIcon } from './icons'

interface ErrorStateProps {
  title?: string
  message: string
  /** Si se pasa, se muestra el botón «Reintentar». */
  onRetry?: () => void
  /** Acciones adicionales (por ejemplo, un enlace para volver). */
  children?: ReactNode
}

/** Estado "error": fallo real de red o servidor, con salida clara para el usuario. */
export default function ErrorState({
  title = 'No se pudo cargar la información',
  message,
  onRetry,
  children,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-md border border-line bg-surface px-6 py-12 text-center"
    >
      <AlertIcon className="size-10 text-danger" />
      <h2 className="title-card text-4xl">{title}</h2>
      <p className="text-muted">{message}</p>
      {(onRetry || children) && (
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {onRetry && (
            <button type="button" onClick={onRetry} className={buttonClass('primary')}>
              Reintentar
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  )
}
