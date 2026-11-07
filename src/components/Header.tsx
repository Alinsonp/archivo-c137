import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { cx } from '../utils/cx'
import { CloseIcon, FilmIcon, MenuIcon } from './icons'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explorar', label: 'Explorar', end: false },
  { to: '/favoritos', label: 'Favoritos', end: false },
  { to: '/contacto', label: 'Contacto', end: false },
] as const

/**
 * Navegación compartida. `NavLink` marca la ruta activa (aria-current="page") y,
 * como «Explorar» no usa `end`, sigue activo en /explorar/:id.
 */
export default function Header() {
  const { count } = useFavorites()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Archivo C-137, ir al inicio"
          className="flex items-center gap-2.5 rounded-md"
        >
          <FilmIcon className="size-7 text-crimson" />
          <span className="title-card text-3xl">Archivo C-137</span>
        </Link>

        <nav
          id="primary-nav"
          aria-label="Principal"
          className={cx(
            'md:static md:block md:border-0 md:bg-transparent md:p-0',
            menuOpen
              ? 'absolute inset-x-0 top-full block border-b border-line bg-canvas p-4'
              : 'hidden',
          )}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cx(
                      'relative flex min-h-11 items-center rounded-md px-3 font-semibold transition-colors',
                      isActive
                        ? 'bg-surface-2 text-ink md:bg-transparent md:after:absolute md:after:inset-x-3 md:after:bottom-1 md:after:h-0.5 md:after:bg-crimson'
                        : 'text-muted hover:text-ink',
                    )
                  }
                >
                  {item.label}
                  {item.to === '/favoritos' && count > 0 && (
                    <>
                      <span
                        aria-hidden="true"
                        className="ml-2 rounded-full bg-gold-fill px-2 py-0.5 text-xs font-bold text-black"
                      >
                        {count}
                      </span>
                      <span className="sr-only"> ({count} guardados)</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="flex size-11 items-center justify-center rounded-md hover:bg-surface-2 md:hidden"
          >
            {menuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </div>
    </header>
  )
}
