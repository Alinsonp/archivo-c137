import { useCallback, useEffect, useState } from 'react'
import { describeError, fetchCharacters, isAbortError } from '../services/characterApi'
import type { Character, CharacterQuery, PageInfo } from '../types/character'

export type CharactersState =
  | { status: 'loading' }
  | { status: 'success'; characters: Character[]; info: PageInfo }
  | { status: 'empty' }
  | { status: 'error'; message: string }

/**
 * Carga el listado según búsqueda, estado y página.
 *
 * Cada cambio de parámetros cancela la petición anterior con `AbortController`
 * y descarta cualquier respuesta tardía, de modo que nunca se pintan resultados
 * obsoletos ni se mezclan páginas o filtros distintos.
 */
export function useCharacters({ name, status, page }: CharacterQuery) {
  const [state, setState] = useState<CharactersState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })

    fetchCharacters({ name, status, page }, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return
        setState(
          response.results.length === 0
            ? { status: 'empty' }
            : { status: 'success', characters: response.results, info: response.info },
        )
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return
        setState({ status: 'error', message: describeError(error) })
      })

    return () => controller.abort()
  }, [name, status, page, attempt])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  return { state, retry }
}
