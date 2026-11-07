import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import CharacterGrid from '../components/CharacterGrid'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { SearchIcon } from '../components/icons'
import LoadingState from '../components/LoadingState'
import PageHeading from '../components/PageHeading'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import StatusFilter from '../components/StatusFilter'
import { useCharacters, type CharactersState } from '../hooks/useCharacters'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePageTitle } from '../hooks/usePageTitle'
import { useToast } from '../hooks/useToast'
import type { StatusFilterValue } from '../types/character'
import { buttonClass } from '../utils/buttonStyles'
import { formatCount, pluralize, STATUS_FILTER_OPTIONS } from '../utils/format'

function parseStatus(value: string | null): StatusFilterValue {
  return value === 'alive' || value === 'dead' || value === 'unknown' ? value : 'all'
}

function parsePage(value: string | null): number {
  const page = Number.parseInt(value ?? '', 10)
  return Number.isSafeInteger(page) && page >= 1 ? page : 1
}

function summarize(state: CharactersState, page: number): string {
  switch (state.status) {
    case 'loading':
      return 'Buscando personajes…'
    case 'success': {
      const { count, pages } = state.info
      return `Mostrando ${state.characters.length} de ${formatCount(count)} ${pluralize(count, 'resultado', 'resultados')}. Página ${page} de ${pages}.`
    }
    case 'empty':
      return 'Sin resultados.'
    case 'error':
      return 'No se pudo completar la búsqueda.'
  }
}

/**
 * Exploración con búsqueda, filtro y paginación.
 *
 * Búsqueda, estado y página viven en la URL (?q=&status=&page=): así se pueden
 * compartir, el botón Atrás funciona y «Volver» desde el detalle regresa al mismo
 * listado. Cambiar la búsqueda o el filtro reinicia siempre a la página 1.
 */
export default function ExplorePage() {
  usePageTitle('Explorar')
  const toast = useToast()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const urlQuery = searchParams.get('q') ?? ''
  const name = urlQuery.trim()
  const status = parseStatus(searchParams.get('status'))
  const page = parsePage(searchParams.get('page'))

  const [input, setInput] = useState(urlQuery)
  const debouncedInput = useDebouncedValue(input, 350)
  // Último término que este componente sincronizó con la URL; evita bucles entre input y URL.
  const lastSyncedTerm = useRef(name)

  const { state, retry } = useCharacters({ name, status, page })

  const updateParams = useCallback(
    (changes: Record<string, string | null>, replace: boolean) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          for (const [key, value] of Object.entries(changes)) {
            if (value === null) next.delete(key)
            else next.set(key, value)
          }
          return next
        },
        { replace },
      )
    },
    [setSearchParams],
  )

  // Escribir -> URL (con debounce). Siempre vuelve a la página 1.
  useEffect(() => {
    const term = debouncedInput.trim()
    if (term === lastSyncedTerm.current) return
    lastSyncedTerm.current = term
    updateParams({ q: term || null, page: null }, true)
  }, [debouncedInput, updateParams])

  // URL -> input (botón Atrás/Adelante o enlaces). Ignora los cambios provocados aquí mismo.
  useEffect(() => {
    if (name === lastSyncedTerm.current) return
    lastSyncedTerm.current = name
    setInput(urlQuery)
  }, [name, urlQuery])

  // Refuerzo no bloqueante del estado de error (el estado visible sigue en la página).
  useEffect(() => {
    if (state.status === 'error') toast.error('No se pudieron cargar los personajes.')
  }, [state.status, toast])

  const handleClearSearch = () => {
    lastSyncedTerm.current = ''
    setInput('')
    updateParams({ q: null, page: null }, true)
  }

  const handleStatusChange = (value: StatusFilterValue) => {
    updateParams({ status: value === 'all' ? null : value, page: null }, false)
  }

  const handlePageChange = (next: number) => {
    updateParams({ page: next <= 1 ? null : String(next) }, false)
  }

  const handleResetFilters = () => {
    lastSyncedTerm.current = ''
    setInput('')
    updateParams({ q: null, status: null, page: null }, false)
    toast.info('Se restablecieron la búsqueda y el filtro.')
  }

  const statusText = STATUS_FILTER_OPTIONS.find((option) => option.value === status)?.label.toLowerCase()
  const from = `${location.pathname}${location.search}`

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeading
        title="Explorar personajes"
        description="Datos obtenidos en tiempo real desde The Rick and Morty API."
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:max-w-md lg:flex-1">
          <SearchBar value={input} onChange={setInput} onClear={handleClearSearch} />
        </div>
        <StatusFilter value={status} onChange={handleStatusChange} />
      </div>

      <p role="status" aria-live="polite" className="mb-6 text-muted">
        {summarize(state, page)}
      </p>

      <div aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && <LoadingState variant="grid" label="Cargando personajes…" />}

        {state.status === 'error' && <ErrorState message={state.message} onRetry={retry} />}

        {state.status === 'empty' &&
          (page > 1 ? (
            <EmptyState
              icon={<SearchIcon className="size-10" />}
              title="Esta página no existe"
              description="Los resultados no llegan tan lejos. Vuelve a la primera página."
            >
              <button type="button" onClick={() => handlePageChange(1)} className={buttonClass('primary')}>
                Ir a la primera página
              </button>
            </EmptyState>
          ) : (
            <EmptyState
              icon={<SearchIcon className="size-10" />}
              title="Sin coincidencias"
              description={
                name
                  ? `No encontramos personajes llamados «${name}»${status !== 'all' ? ` con estado ${statusText}` : ''}. Prueba con otro nombre o quita el filtro.`
                  : `No hay personajes con estado ${statusText}.`
              }
            >
              <button type="button" onClick={handleResetFilters} className={buttonClass('primary')}>
                Limpiar filtros
              </button>
            </EmptyState>
          ))}

        {state.status === 'success' && (
          <>
            <CharacterGrid characters={state.characters} from={from} />
            <Pagination page={page} totalPages={state.info.pages} onChange={handlePageChange} />
          </>
        )}
      </div>
    </section>
  )
}
