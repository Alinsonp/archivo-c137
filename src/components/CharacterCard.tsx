import { Link } from 'react-router-dom'
import type { CharacterSummary } from '../types/character'
import { placeLabel } from '../utils/format'
import FavoriteButton from './FavoriteButton'
import PosterImage from './PosterImage'
import StatusBadge from './StatusBadge'

interface CharacterCardProps {
  character: CharacterSummary
  /** Ruta de origen, para que «Volver» en el detalle regrese al mismo listado y filtros. */
  from?: string
}

/**
 * Tarjeta con composición de póster: imagen vertical arriba y, debajo, un título
 * grande con un pequeño bloque de créditos (especie y origen).
 *
 * Toda la tarjeta es clicable con el patrón "stretched link": el enlace del título
 * se extiende con ::after, y el botón de favorito queda por encima (z-10) sin anidarse
 * dentro del enlace, que sería HTML inválido.
 */
export default function CharacterCard({ character, from }: CharacterCardProps) {
  const headingId = `character-${character.id}-name`

  return (
    <article
      aria-labelledby={headingId}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-gold has-[a:focus-visible]:border-gold has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-gold"
    >
      <div className="aspect-[4/5] overflow-hidden bg-surface-2">
        <PosterImage key={character.image} src={character.image} alt={`Retrato de ${character.name}`} />
      </div>

      <StatusBadge
        status={character.status}
        tone="overlay"
        className="pointer-events-none absolute left-3 top-3"
      />
      <FavoriteButton character={character} className="absolute right-3 top-3 z-10" />

      <div className="flex flex-1 flex-col gap-4 border-t border-line p-4">
        <h2 id={headingId} className="title-card text-4xl">
          <Link
            to={`/explorar/${character.id}`}
            state={{ from }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {character.name}
          </Link>
        </h2>

        <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted">Especie</dt>
          <dd className="font-medium">{character.species}</dd>
          <dt className="text-muted">Origen</dt>
          <dd className="font-medium">{placeLabel(character.origin.name)}</dd>
        </dl>
      </div>
    </article>
  )
}
