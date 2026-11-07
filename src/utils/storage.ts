import type { CharacterSummary } from '../types/character'

export const FAVORITES_STORAGE_KEY = 'archivo-c137:favorites:v1'

function isSummary(value: unknown): value is CharacterSummary {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  const origin = item.origin as Record<string, unknown> | null | undefined
  return (
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.image === 'string' &&
    typeof item.status === 'string' &&
    typeof item.species === 'string' &&
    typeof origin === 'object' &&
    origin !== null &&
    typeof origin.name === 'string'
  )
}

/**
 * Lee los favoritos guardados. Nunca lanza: si el almacenamiento no está disponible
 * o el contenido está corrupto, devuelve una lista vacía.
 */
export function loadFavorites(): CharacterSummary[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const seen = new Set<number>()
    const result: CharacterSummary[] = []
    for (const item of parsed) {
      if (isSummary(item) && !seen.has(item.id)) {
        seen.add(item.id)
        result.push(item)
      }
    }
    return result
  } catch {
    return []
  }
}

/** Devuelve `false` si no fue posible persistir (modo privado, cuota excedida, etc.). */
export function saveFavorites(favorites: CharacterSummary[]): boolean {
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    return true
  } catch {
    return false
  }
}
