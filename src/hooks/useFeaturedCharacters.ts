import { useEffect, useState } from 'react'
import { fetchCharactersByIds, isAbortError } from '../services/characterApi'
import type { Character } from '../types/character'

export type FeaturedState =
  | { status: 'loading' }
  | { status: 'success'; characters: Character[] }
  | { status: 'error' }

/** Personajes destacados del inicio, obtenidos de la API (no incluidos en el código). */
export function useFeaturedCharacters(ids: readonly number[]): FeaturedState {
  const [state, setState] = useState<FeaturedState>({ status: 'loading' })
  const key = ids.join(',')

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })

    fetchCharactersByIds(key.split(',').map(Number), controller.signal)
      .then((characters) => {
        if (controller.signal.aborted) return
        setState({ status: 'success', characters })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return
        setState({ status: 'error' })
      })

    return () => controller.abort()
  }, [key])

  return state
}
