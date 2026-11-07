import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CharacterGrid from '../components/CharacterGrid'
import EmptyState from '../components/EmptyState'
import { StarIcon } from '../components/icons'
import PageHeading from '../components/PageHeading'
import { useFavorites } from '../hooks/useFavorites'
import { usePageTitle } from '../hooks/usePageTitle'
import { buttonClass } from '../utils/buttonStyles'
import { pluralize } from '../utils/format'

/** Lista reactiva de favoritos, leída del estado global (no de un estado local de la página). */
export default function FavoritesPage() {
  usePageTitle('Favoritos')
  const { favorites, count } = useFavorites()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousCount = useRef(count)

  // Al quitar un favorito, la tarjeta (con el botón que tenía el foco) desaparece. Se devuelve
  // el foco al encabezado, diferido para que ocurra después de que el diálogo modal se cierre.
  useEffect(() => {
    let timer: number | undefined
    if (count < previousCount.current) {
      timer = window.setTimeout(() => headingRef.current?.focus(), 0)
    }
    previousCount.current = count
    return () => window.clearTimeout(timer)
  }, [count])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeading
        title="Mis favoritos"
        headingRef={headingRef}
        description={
          count === 0
            ? 'Aún no has guardado ningún personaje.'
            : `${count} ${pluralize(count, 'personaje guardado', 'personajes guardados')}.`
        }
      />

      {count === 0 ? (
        <EmptyState
          icon={<StarIcon className="size-10" />}
          title="Aún no tienes favoritos"
          description="Pulsa la estrella en cualquier personaje y aparecerá aquí."
        >
          <Link to="/explorar" className={buttonClass('primary')}>
            Explorar y añadir favoritos
          </Link>
        </EmptyState>
      ) : (
        <CharacterGrid characters={favorites} from="/favoritos" />
      )}
    </section>
  )
}
