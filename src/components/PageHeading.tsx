import type { RefObject } from 'react'

interface PageHeadingProps {
  title: string
  description?: string
  /** Permite devolver el foco al encabezado después de acciones que eliminan contenido. */
  headingRef?: RefObject<HTMLHeadingElement | null>
}

/** Encabezado <h1> consistente para las vistas interiores. */
export default function PageHeading({ title, description, headingRef }: PageHeadingProps) {
  return (
    <header className="mb-8 max-w-2xl">
      <h1 ref={headingRef} tabIndex={-1} className="title-card break-words text-6xl outline-none sm:text-7xl">
        {title}
      </h1>
      {description && <p className="mt-3 text-lg text-muted">{description}</p>}
    </header>
  )
}
