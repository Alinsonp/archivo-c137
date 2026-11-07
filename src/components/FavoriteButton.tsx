import { useFavorites } from '../hooks/useFavorites'
import type { CharacterSummary } from '../types/character'
import { buttonClass } from '../utils/buttonStyles'
import { cx } from '../utils/cx'
import { StarIcon } from './icons'

interface FavoriteButtonProps {
  character: CharacterSummary
  /** `icon` para tarjetas; `full` (con texto) para la ficha de detalle. */
  variant?: 'icon' | 'full'
  className?: string
}

/**
 * Botón de favorito sincronizado con el estado global: el mismo personaje se ve
 * guardado en el listado, el detalle y la página de favoritos.
 * Quitar un favorito abre el diálogo de confirmación (lo gestiona FavoritesProvider).
 */
export default function FavoriteButton({
  character,
  variant = 'icon',
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(character.id)

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={() => toggleFavorite(character)}
        className={cx(buttonClass(saved ? 'secondary' : 'primary', 'lg'), className)}
      >
        <StarIcon filled={saved} className={cx('size-5', saved && 'text-gold')} />
        {saved ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      </button>
    )
  }

  const label = saved
    ? `Quitar a ${character.name} de favoritos`
    : `Añadir a ${character.name} a favoritos`

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(character)}
      aria-label={label}
      title={label}
      className={cx(
        'flex size-11 items-center justify-center rounded-full bg-black/75 backdrop-blur transition-colors hover:bg-black/90',
        saved ? 'text-gold-fill' : 'text-white',
        className,
      )}
    >
      <StarIcon filled={saved} className="size-5" />
    </button>
  )
}
