import { Link } from 'react-router-dom'
import { useFeaturedCharacters } from '../hooks/useFeaturedCharacters'
import { cx } from '../utils/cx'
import PosterImage from './PosterImage'

/** Ids de los personajes destacados; sus datos e imágenes se piden a la API. */
const FEATURED_IDS = [1, 2, 3] as const

/** Desfase vertical para que el tríptico no quede en una fila plana. */
const OFFSETS = ['translate-y-6', '-translate-y-2', 'translate-y-6'] as const

/**
 * Tríptico de carteles del inicio. Es el único momento de movimiento al cargar la
 * página: los carteles caen en secuencia. Si la API falla no se muestra nada y el
 * hero sigue completo (no es una vista crítica, así que no se interrumpe con un error).
 */
export default function FeaturedPosters() {
  const state = useFeaturedCharacters(FEATURED_IDS)

  if (state.status === 'error') return null

  return (
    <ul
      aria-label="Personajes destacados"
      className="mx-auto grid w-full max-w-md grid-cols-3 gap-3 pb-8 sm:max-w-lg sm:gap-4 lg:ml-auto lg:mr-0"
    >
      {state.status === 'loading'
        ? FEATURED_IDS.map((id, index) => (
            <li key={id} aria-hidden="true" className={OFFSETS[index]}>
              <div className="aspect-[3/5] animate-pulse rounded-sm bg-surface-2" />
            </li>
          ))
        : state.characters.map((character, index) => (
            <li
              key={character.id}
              className={cx('animate-drop', OFFSETS[index])}
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <Link
                to={`/explorar/${character.id}`}
                className="block overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-gold"
              >
                <div className="aspect-[3/5] bg-surface-2">
                  {/* alt vacío: el nombre ya aparece como texto del enlace. */}
                  <PosterImage key={character.image} src={character.image} alt="" priority />
                </div>
                <p className="title-card p-2 text-xl sm:text-2xl">{character.name}</p>
              </Link>
            </li>
          ))}
    </ul>
  )
}
