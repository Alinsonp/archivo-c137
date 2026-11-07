import type { CharacterSummary, StatusFilterValue } from '../types/character'

const STATUS_LABELS: Record<string, string> = {
  Alive: 'Vivo',
  Dead: 'Muerto',
  unknown: 'Desconocido',
}

const GENDER_LABELS: Record<string, string> = {
  Female: 'Femenino',
  Male: 'Masculino',
  Genderless: 'Sin género',
  unknown: 'Desconocido',
}

export const STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: StatusFilterValue
  label: string
}> = [
  { value: 'all', label: 'Todos' },
  { value: 'alive', label: 'Vivo' },
  { value: 'dead', label: 'Muerto' },
  { value: 'unknown', label: 'Desconocido' },
]

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? 'Desconocido'
}

export function genderLabel(gender: string): string {
  return GENDER_LABELS[gender] ?? 'Desconocido'
}

/** La API devuelve "unknown" cuando no hay dato de origen o ubicación. */
export function placeLabel(name: string | undefined): string {
  if (!name || name.trim().toLowerCase() === 'unknown') return 'Desconocido'
  return name
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value)
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

/** Reduce un personaje a los campos que se persisten en favoritos. */
export function toSummary(character: CharacterSummary): CharacterSummary {
  return {
    id: character.id,
    name: character.name,
    image: character.image,
    status: character.status,
    species: character.species,
    origin: { name: character.origin.name },
  }
}
