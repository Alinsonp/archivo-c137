import type { ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FavoriteButton from '../components/FavoriteButton'
import { ChevronLeftIcon, SearchIcon } from '../components/icons'
import LoadingState from '../components/LoadingState'
import PosterImage from '../components/PosterImage'
import StatusBadge from '../components/StatusBadge'
import { useCharacter } from '../hooks/useCharacter'
import { usePageTitle } from '../hooks/usePageTitle'
import type { Character } from '../types/character'
import { buttonClass } from '../utils/buttonStyles'
import { genderLabel, placeLabel, pluralize } from '../utils/format'

interface DetailLocationState {
  from?: string
}

/**
 * Detalle: el `id` sale de la URL (useParams) y se consulta SIEMPRE a la API con un
 * fetch individual, también al abrir el enlace directamente o recargar la página.
 */
export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { state, retry } = useCharacter(id)

  const from = (location.state as DetailLocationState | null)?.from
  const backTo = from && from.startsWith('/') && !from.startsWith('//') ? from : '/explorar'
  const backLabel = backTo.startsWith('/favoritos') ? 'Volver a favoritos' : 'Volver a explorar'

  usePageTitle(
    state.status === 'success'
      ? state.character.name
      : state.status === 'not-found'
        ? 'Personaje no encontrado'
        : 'Detalle',
  )

  const backLink = (
    <Link
      to={backTo}
      className="mb-8 inline-flex min-h-11 items-center gap-1 font-semibold text-muted hover:text-ink"
    >
      <ChevronLeftIcon className="size-5" />
      {backLabel}
    </Link>
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {backLink}

      {state.status === 'loading' && <LoadingState variant="detail" label="Cargando ficha…" />}

      {state.status === 'error' && (
        <ErrorState title="No se pudo cargar la ficha" message={state.message} onRetry={retry}>
          <Link to={backTo} className={buttonClass('secondary')}>
            {backLabel}
          </Link>
        </ErrorState>
      )}

      {state.status === 'not-found' && (
        <EmptyState
          icon={<SearchIcon className="size-10" />}
          title="Personaje no encontrado"
          description={`No existe ningún personaje con el ID «${id ?? ''}» en el archivo.`}
        >
          <Link to="/explorar" className={buttonClass('primary')}>
            Explorar personajes
          </Link>
        </EmptyState>
      )}

      {state.status === 'success' && <CharacterSheet character={state.character} />}
    </section>
  )
}

function CharacterSheet({ character }: { character: Character }) {
  const episodes = character.episode.length

  // Solo se listan los atributos que existen en los datos de la API.
  const rows: Array<[string, ReactNode]> = [
    ['Estado', <StatusBadge key="status" status={character.status} />],
    ['Especie', character.species],
  ]
  if (character.type) rows.push(['Tipo', character.type])
  rows.push(
    ['Género', genderLabel(character.gender)],
    ['Origen', placeLabel(character.origin.name)],
    ['Última ubicación', placeLabel(character.location.name)],
    ['Apariciones', `${episodes} ${pluralize(episodes, 'episodio', 'episodios')}`],
  )

  return (
    <article className="grid gap-10 md:grid-cols-[5fr_7fr] md:gap-14">
      <div className="self-start overflow-hidden rounded-sm border border-line bg-surface-2">
        <div className="aspect-square">
          <PosterImage
            key={character.image}
            src={character.image}
            alt={`Retrato de ${character.name}`}
            priority
          />
        </div>
      </div>

      <div>
        <h1 className="title-card text-7xl sm:text-8xl">{character.name}</h1>

        <dl className="mt-8 border-t border-line">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-6 border-b border-line py-4"
            >
              <dt className="text-muted">{label}</dt>
              <dd className="text-right text-lg font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <FavoriteButton character={character} variant="full" className="mt-8" />
      </div>
    </article>
  )
}
