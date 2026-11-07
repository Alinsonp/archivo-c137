import type { ReactNode } from 'react'
import { AlertIcon } from './icons'

interface FormFieldProps {
  id: string
  label: string
  /** Mensaje de error ya visible (el formulario decide cuándo mostrarlo). */
  error?: string
  hint?: string
  /** El control (input o textarea). Debe usar `id` y enlazar `aria-describedby`. */
  children: ReactNode
}

/**
 * Etiqueta persistente + control + ayuda/error.
 * El error lleva icono y texto, de modo que no depende solo del color rojo.
 * Los ids `${id}-error` y `${id}-hint` son los que el control referencia con aria-describedby.
 */
export default function FormField({ id, label, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm font-medium text-danger">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
