import { Link, useLocation } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { buttonClass } from '../utils/buttonStyles'

/** 404 de ruta: una URL que no existe en la aplicación (distinto de «sin resultados» o «ID inexistente»). */
export default function NotFoundPage() {
  usePageTitle('Página no encontrada')
  const { pathname } = useLocation()

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="title-card">
        <span className="block text-[clamp(8rem,28vw,16rem)] text-crimson">404</span>
        <span className="block text-5xl sm:text-6xl">Esta escena no está en el archivo</span>
      </h1>
      <p className="mt-6 max-w-md text-muted">
        No existe ninguna página en{' '}
        <code className="break-all rounded-sm bg-surface-2 px-1.5 py-0.5 text-ink">{pathname}</code>.
        Revisa la dirección o vuelve al inicio.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonClass('primary', 'lg')}>
          Volver al inicio
        </Link>
        <Link to="/explorar" className={buttonClass('secondary', 'lg')}>
          Explorar personajes
        </Link>
      </div>
    </section>
  )
}
