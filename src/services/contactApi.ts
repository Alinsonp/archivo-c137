import type { ContactValues } from '../utils/validation'

/**
 * Confirmación local de DEMOSTRACIÓN.
 *
 * El enunciado no exige un backend de mensajes, así que esta función no envía nada
 * a ningún servidor ni correo. Existe para que la interfaz tenga un flujo asíncrono
 * real (estado "enviando", éxito y error) que se pueda reemplazar por un servicio
 * real sin tocar el formulario: basta con hacer `fetch` aquí y lanzar si falla.
 */
export async function submitContactDemo(_values: ContactValues): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 700))
}
