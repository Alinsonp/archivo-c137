import { useMemo, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { submitContactDemo } from '../services/contactApi'
import { useToast } from '../hooks/useToast'
import { buttonClass } from '../utils/buttonStyles'
import { fieldClass } from '../utils/fieldStyles'
import { CONTACT_LIMITS, validateContact, type ContactValues } from '../utils/validation'
import ConfirmDialog from './ConfirmDialog'
import FormField from './FormField'
import { CheckCircleIcon } from './icons'

type Touched = Record<keyof ContactValues, boolean>

const EMPTY_VALUES: ContactValues = { name: '', email: '', message: '' }
const UNTOUCHED: Touched = { name: false, email: false, message: false }
const ALL_TOUCHED: Touched = { name: true, email: true, message: true }

/**
 * Formulario controlado con validación en vivo.
 *
 * - Cada campo muestra su error en cuanto el usuario lo toca (cambio o salida del campo).
 * - «Enviar mensaje» queda deshabilitado mientras haya errores o se esté procesando.
 * - Antes de completar el envío se pide confirmación con un diálogo neutral.
 * - No hay backend: la confirmación es local y así se le dice al usuario con claridad.
 */
export default function ContactForm() {
  const toast = useToast()
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES)
  const [touched, setTouched] = useState<Touched>(UNTOUCHED)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const errors = useMemo(() => validateContact(values), [values])
  const isValid = Object.keys(errors).length === 0
  const visibleError = (field: keyof ContactValues) => (touched[field] ? errors[field] : undefined)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as keyof ContactValues
    const value = event.target.value
    setValues((current) => ({ ...current, [field]: value }))
    setTouched((current) => ({ ...current, [field]: true }))
    setSent(false)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as keyof ContactValues
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    if (!isValid) {
      setTouched(ALL_TOUCHED)
      return
    }
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    setConfirmOpen(false)
    setSubmitting(true)
    try {
      await submitContactDemo(values)
      setSent(true)
      setValues(EMPTY_VALUES)
      setTouched(UNTOUCHED)
      toast.success('Formulario validado y confirmado (demostración: no se envía a ningún servidor).')
    } catch {
      // Los datos se conservan para que el usuario pueda reintentar sin reescribir.
      toast.error('No se pudo completar el envío. Tus datos siguen en el formulario; inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const describedBy = (field: keyof ContactValues, hasHint = false) =>
    visibleError(field) ? `contact-${field}-error` : hasHint ? `contact-${field}-hint` : undefined

  return (
    <>
      {sent && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-md border border-l-4 border-line border-l-ok bg-surface-2 p-4"
        >
          <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-ok" />
          <p className="text-sm">
            <strong>Formulario validado y confirmado.</strong> Es una demostración: tu mensaje no se
            envió a ningún servidor ni correo.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-busy={submitting} className="space-y-6">
        <FormField id="contact-name" label="Nombre" error={visibleError('name')}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.nameMax}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={visibleError('name') ? true : undefined}
            aria-describedby={describedBy('name')}
            className={fieldClass(Boolean(visibleError('name')))}
          />
        </FormField>

        <FormField id="contact-email" label="Correo electrónico" error={visibleError('email')}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={CONTACT_LIMITS.emailMax}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={visibleError('email') ? true : undefined}
            aria-describedby={describedBy('email')}
            className={fieldClass(Boolean(visibleError('email')))}
          />
        </FormField>

        <FormField
          id="contact-message"
          label="Mensaje"
          error={visibleError('message')}
          hint={`${values.message.length} de ${CONTACT_LIMITS.messageMax} caracteres`}
        >
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            maxLength={CONTACT_LIMITS.messageMax}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={visibleError('message') ? true : undefined}
            aria-describedby={describedBy('message', true)}
            className={`${fieldClass(Boolean(visibleError('message')))} resize-y`}
          />
        </FormField>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className={buttonClass('primary', 'lg')}
          >
            {submitting ? 'Procesando…' : 'Enviar mensaje'}
          </button>
          {!isValid && (
            <p className="text-sm text-muted">
              Completa todos los campos correctamente para habilitar el envío.
            </p>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Enviar este mensaje?"
        description={
          <>
            Vas a confirmar el mensaje de <strong className="text-ink">{values.name.trim()}</strong>{' '}
            ({values.email.trim()}). Es una demostración: no se enviará a ningún servidor.
          </>
        }
        confirmLabel="Confirmar envío"
        cancelLabel="Seguir editando"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
