export interface ContactValues {
  name: string
  email: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>

/**
 * Las longitudes exactas son una decisión de implementación: el enunciado solo
 * pide validar nombre, email y mensaje.
 */
export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 60,
  emailMax: 254,
  messageMin: 10,
  messageMax: 1000,
} as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}

  if (values.name.trim().length < CONTACT_LIMITS.nameMin) {
    errors.name = `El nombre debe tener al menos ${CONTACT_LIMITS.nameMin} caracteres.`
  }

  const email = values.email.trim()
  if (email.length === 0) {
    errors.email = 'Escribe tu correo electrónico.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Ingresa un correo válido, por ejemplo nombre@dominio.com.'
  }

  if (values.message.trim().length < CONTACT_LIMITS.messageMin) {
    errors.message = `El mensaje debe tener al menos ${CONTACT_LIMITS.messageMin} caracteres.`
  }

  return errors
}
