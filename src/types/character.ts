/** Tipos basados en las respuestas reales de https://rickandmortyapi.com/documentation */

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown'

export interface NamedResource {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: CharacterGender
  origin: NamedResource
  location: NamedResource
  image: string
  episode: string[]
  url: string
  created: string
}

/**
 * Subconjunto mínimo que necesitan las tarjetas y que se guarda en favoritos.
 * `Character` es asignable a este tipo, por lo que cualquier personaje completo
 * puede pasarse directamente a una tarjeta.
 */
export type CharacterSummary = Pick<
  Character,
  'id' | 'name' | 'image' | 'status' | 'species'
> & { origin: Pick<NamedResource, 'name'> }

export interface PageInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface CharacterListResponse {
  info: PageInfo
  results: Character[]
}

/** Valores del filtro de estado en la UI (coinciden con los admitidos por la API, en minúscula). */
export type StatusFilterValue = 'all' | 'alive' | 'dead' | 'unknown'

export interface CharacterQuery {
  name: string
  status: StatusFilterValue
  page: number
}
