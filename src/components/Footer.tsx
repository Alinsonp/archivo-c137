import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/explorar', label: 'Explorar' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/contacto', label: 'Contacto' },
] as const

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div>
          <p className="title-card text-3xl">Archivo C-137</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Proyecto académico de exploración de contenido. Los personajes y sus imágenes
            pertenecen a sus respectivos titulares.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex min-h-11 items-center text-sm text-muted hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-muted">
          Datos en vivo de{' '}
          <a
            href="https://rickandmortyapi.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            The Rick and Morty API
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
