import { useState } from 'react'
import { cx } from '../utils/cx'
import { FilmIcon } from './icons'

interface PosterImageProps {
  src: string
  /** Usa `""` cuando el nombre ya aparece como texto al lado (imagen decorativa). */
  alt: string
  className?: string
  /** Carga inmediata para imágenes visibles al abrir la página. */
  priority?: boolean
}

/** Imagen con alternativa visual si la URL falla y fundido de entrada al cargar. */
export default function PosterImage({ src, alt, className, priority = false }: PosterImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const decorative = alt === ''

  if (failed) {
    return (
      <div
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : `${alt} (imagen no disponible)`}
        aria-hidden={decorative || undefined}
        className={cx('flex h-full w-full items-center justify-center bg-surface-2 text-muted', className)}
      >
        <FilmIcon className="size-12" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={300}
      height={300}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cx(
        'h-full w-full object-cover transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}
