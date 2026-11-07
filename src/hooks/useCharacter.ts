import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  describeError,
  fetchCharacterById,
  isAbortError,
} from '../services/characterApi'
import type { Character } from '../types/character'

export type CharacterState =
  | { status: 'loading' }
  | { status: 'success'; character: Character }
  | { status: 'not-found' }
  | { status: 'error'; message: string }

function parseId(raw: string | undefined): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null
  const id = Number(raw)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

/**
 * Carga un personaje por ID con su propio ciclo de loading/error.
 * Distingue "no existe" (404 o ID inválido) de un fallo real de red o servidor.
 */
export function useCharacter(rawId: string | undefined) {
  const [state, setState] = useState<CharacterState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const id = parseId(rawId)
    if (id === null) {
      setState({ status: 'not-found' })
      return
    }

    const controller = new AbortController()
    setState({ status: 'loading' })

    fetchCharacterById(id, controller.signal)
      .then((character) => {
        if (controller.signal.aborted) return
        setState({ status: 'success', character })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return
        if (error instanceof ApiError && error.kind === 'not-found') {
          setState({ status: 'not-found' })
          return
        }
        setState({ status: 'error', message: describeError(error) })
      })

    return () => controller.abort()
  }, [rawId, attempt])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  return { state, retry }
}
