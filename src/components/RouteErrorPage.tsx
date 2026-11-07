import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { buttonClass } from '../utils/buttonStyles'
import ErrorState from './ErrorState'

/** Red de seguridad: si una vista lanza un error al renderizar, la cabecera y el pie siguen visibles. */
export default function RouteErrorPage() {
  usePageTitle('Algo salió mal')

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ErrorState
        title="Algo salió mal en esta página"
        message="Ocurrió un error inesperado al mostrar esta vista. Recarga la página o vuelve al inicio."
        onRetry={() => window.location.reload()}
      >
        <Link to="/" className={buttonClass('secondary')}>
          Volver al inicio
        </Link>
      </ErrorState>
    </section>
  )
}
