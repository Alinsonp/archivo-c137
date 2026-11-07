import type {
  Character,
  CharacterListResponse,
  CharacterQuery,
  PageInfo,
} from '../types/character'

/** Única fuente de la URL base de la API (sin claves ni secretos). */
export const API_BASE_URL = 'https://rickandmortyapi.com/api'

export type ApiErrorKind = 'network' | 'http' | 'not-found' | 'invalid-response'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | undefined

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** Mensaje comprensible para mostrar en la interfaz. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
      case 'http':
        return error.status
          ? `El servidor respondió con un error (${error.status}). Inténtalo de nuevo en unos minutos.`
          : 'El servidor respondió con un error. Inténtalo de nuevo en unos minutos.'
      case 'invalid-response':
        return 'El servidor envió una respuesta que no se pudo interpretar.'
      case 'not-found':
        return 'No se encontró el recurso solicitado.'
    }
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}

async function request(url: string, signal?: AbortSignal): Promise<Response> {
  try {
    return await fetch(url, { signal })
  } catch (error) {
    // Una cancelación deliberada no es un fallo de red: se propaga tal cual.
    if (isAbortError(error)) throw error
    throw new ApiError('network', 'No se pudo conectar con el servidor.')
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown
  } catch {
    throw new ApiError('invalid-response', 'La respuesta no es JSON válido.', response.status)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCharacter(value: unknown): value is Character {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.image === 'string' &&
    Array.isArray(value.episode) &&
    isRecord(value.origin) &&
    isRecord(value.location)
  )
}

const EMPTY_LIST: CharacterListResponse = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

/**
 * Fetch #1 — listado paginado con búsqueda por nombre y filtro por estado.
 *
 * La API responde HTTP 404 ("There is nothing here") cuando no hay coincidencias.
 * Eso no es un fallo: aquí se traduce a una lista vacía para que la UI muestre el
 * estado "empty". Los demás errores HTTP y los fallos de red sí se propagan.
 */
export async function fetchCharacters(
  query: CharacterQuery,
  signal?: AbortSignal,
): Promise<CharacterListResponse> {
  const url = new URL(`${API_BASE_URL}/character`)
  url.searchParams.set('page', String(query.page))
  if (query.name) url.searchParams.set('name', query.name)
  if (query.status !== 'all') url.searchParams.set('status', query.status)

  const response = await request(url.toString(), signal)
  if (response.status === 404) return EMPTY_LIST
  if (!response.ok) {
    throw new ApiError('http', `HTTP ${response.status}`, response.status)
  }

  const data = await readJson(response)
  if (
    !isRecord(data) ||
    !isRecord(data.info) ||
    !Array.isArray(data.results) ||
    !data.results.every(isCharacter)
  ) {
    throw new ApiError('invalid-response', 'Estructura de listado inesperada.')
  }

  return { info: data.info as unknown as PageInfo, results: data.results }
}

/**
 * Fetch #2 — detalle individual por ID (`/character/:id`).
 * Un 404 aquí sí significa "ese personaje no existe" y se distingue de un fallo.
 */
export async function fetchCharacterById(id: number, signal?: AbortSignal): Promise<Character> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ApiError('not-found', 'ID inválido.', 404)
  }

  const response = await request(`${API_BASE_URL}/character/${id}`, signal)
  if (response.status === 404) {
    throw new ApiError('not-found', 'No existe un personaje con ese ID.', 404)
  }
  if (!response.ok) {
    throw new ApiError('http', `HTTP ${response.status}`, response.status)
  }

  const data = await readJson(response)
  if (!isCharacter(data)) {
    throw new ApiError('invalid-response', 'Estructura de personaje inesperada.')
  }
  return data
}

/** Varios personajes en una sola petición (`/character/1,2,3`), usado en el inicio. */
export async function fetchCharactersByIds(
  ids: readonly number[],
  signal?: AbortSignal,
): Promise<Character[]> {
  if (ids.length === 0) return []

  const response = await request(`${API_BASE_URL}/character/${ids.join(',')}`, signal)
  if (!response.ok) {
    throw new ApiError('http', `HTTP ${response.status}`, response.status)
  }

  const data = await readJson(response)
  const list: unknown[] = Array.isArray(data) ? data : [data]
  if (!list.every(isCharacter)) {
    throw new ApiError('invalid-response', 'Estructura de personajes inesperada.')
  }
  return list
}
