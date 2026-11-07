import { buttonClass } from '../utils/buttonStyles'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

/**
 * Paginación accesible «Anterior / Siguiente» basada en `info.pages` de la API.
 * En pantallas estrechas el indicador pasa a su propia fila encima de los botones
 * para que nada se desborde.
 */
export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Paginación de resultados"
      className="mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={buttonClass('secondary')}
      >
        <ChevronLeftIcon className="size-5" />
        Anterior
      </button>

      <p className="order-first basis-full text-center text-muted sm:order-none sm:basis-auto">
        Página <span className="font-semibold text-ink">{page}</span> de{' '}
        <span className="font-semibold text-ink">{totalPages}</span>
      </p>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={buttonClass('secondary')}
      >
        Siguiente
        <ChevronRightIcon className="size-5" />
      </button>
    </nav>
  )
}
