import { useEffect, useId, useRef, type ReactNode } from 'react'
import { buttonClass } from '../utils/buttonStyles'
import { cx } from '../utils/cx'
import { AlertIcon, InfoIcon } from './icons'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DARK PATTERN DIDÁCTICO (requisito pedagógico del Proyecto 01)
 *
 * Patrón: sesgo de jerarquía visual ("visual interference" / opción preseleccionada).
 * Cuando `biased` es true, el botón de CONFIRMAR es grande, saturado, con sombra y
 * anillo dorado, mientras que CANCELAR se reduce a un enlace pequeño y subrayado.
 * Efecto: el ojo se va primero a la acción destructiva, empujando al usuario a
 * confirmar sin pensarlo, aunque la opción de cancelar siga existiendo.
 *
 * Se usa ÚNICAMENTE en el diálogo de «quitar de favoritos» (ver FavoritesProvider)
 * y solo porque el trabajo lo exige para ilustrar el concepto visto en clase.
 * No se debe copiar a un producto real.
 *
 * Límites deliberados para que el ejemplo sea acotado y no abusivo:
 *  - Ambas opciones están visibles, con etiquetas claras y honestas sobre sus consecuencias.
 *  - Cancelar conserva contraste suficiente (≥ 4.5:1) y un área táctil de 44 px.
 *  - El foco inicial va a CANCELAR (opción segura), así que Enter/Espacio no confirma
 *    por accidente. Escape y clic en el fondo también cancelan.
 *  - Sin textos culpabilizadores, cuentas regresivas ni otros trucos adicionales.
 *
 * Con `biased` en false (diálogo del formulario de contacto) ambos botones tienen
 * el mismo peso visual: ese es el comportamiento correcto y honesto.
 * ─────────────────────────────────────────────────────────────────────────────
 */
interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  /** Activa el sesgo visual descrito arriba. Por defecto, diálogo neutral. */
  biased?: boolean
  tone?: 'neutral' | 'danger'
}

/**
 * Diálogo de confirmación con <dialog> nativo + useRef + showModal().
 * El navegador aporta la capa superior, el bloqueo del fondo, el atrapado de foco
 * y la devolución del foco al elemento que lo abrió al cerrarse.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  biased = false,
  tone = 'neutral',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  // Sincroniza el estado de React con el <dialog> nativo.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      // Foco inicial en la opción segura (cancelar).
      cancelRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const cancelClass = biased
    ? 'inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm text-muted underline underline-offset-4 hover:text-ink'
    : buttonClass('secondary')

  const confirmClass = biased
    ? 'inline-flex min-h-14 items-center justify-center rounded-md bg-crimson px-8 text-lg font-bold text-white shadow-lg shadow-crimson/40 ring-2 ring-gold-fill/70 transition-colors hover:bg-crimson-hover'
    : buttonClass('primary')

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      // Escape dispara "cancel": lo gestionamos para mantener un único origen de verdad.
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      // Si el navegador lo cierra por su cuenta mientras React cree que está abierto, se resincroniza.
      onClose={() => {
        if (open) onCancel()
      }}
      // El diálogo no tiene padding propio: un clic directo sobre él es un clic en el fondo.
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
      className="m-auto w-[min(92vw,30rem)] rounded-lg border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/70 open:animate-pop"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          {tone === 'danger' ? (
            <AlertIcon className="mt-1 size-7 shrink-0 text-danger" />
          ) : (
            <InfoIcon className="mt-1 size-7 shrink-0 text-gold" />
          )}
          <div>
            <h2 id={titleId} className="title-card text-4xl">
              {title}
            </h2>
            <p id={descriptionId} className="mt-2 text-muted">
              {description}
            </p>
          </div>
        </div>

        <div
          className={cx(
            'mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end',
            biased && 'sm:gap-5',
          )}
        >
          <button ref={cancelRef} type="button" onClick={onCancel} className={cancelClass}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={confirmClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
