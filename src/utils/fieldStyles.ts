import { cx } from './cx'

/** Clases compartidas por inputs y textareas; el borde cambia además del color del texto de error. */
export function fieldClass(hasError: boolean): string {
  return cx(
    'min-h-12 w-full rounded-md border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted',
    hasError ? 'border-danger' : 'border-line focus:border-gold',
  )
}
