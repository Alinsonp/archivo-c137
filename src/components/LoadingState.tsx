interface LoadingStateProps {
  variant?: 'grid' | 'detail'
  label?: string
}

/**
 * Estado "loading": spinner con texto anunciable y esqueleto que reserva el espacio.
 * Aparece con un pequeño retardo (animate-fade-delayed) para que las respuestas
 * rápidas no provoquen un parpadeo del esqueleto.
 */
export default function LoadingState({ variant = 'grid', label = 'Cargando…' }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="animate-fade-delayed">
      <div className="mb-6 flex items-center gap-3 text-muted">
        <span
          aria-hidden="true"
          className="size-5 animate-spin rounded-full border-2 border-line border-t-gold"
        />
        <span>{label}</span>
      </div>

      {variant === 'grid' ? (
        <ul
          aria-hidden="true"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <li key={index} className="overflow-hidden rounded-sm border border-line bg-surface">
              <div className="aspect-[4/5] animate-pulse bg-surface-2" />
              <div className="space-y-3 border-t border-line p-4">
                <div className="h-9 w-2/3 animate-pulse rounded-sm bg-surface-2" />
                <div className="h-4 w-1/2 animate-pulse rounded-sm bg-surface-2" />
                <div className="h-4 w-2/5 animate-pulse rounded-sm bg-surface-2" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div aria-hidden="true" className="grid gap-10 md:grid-cols-[5fr_7fr]">
          <div className="aspect-square animate-pulse rounded-sm bg-surface-2" />
          <div className="space-y-5">
            <div className="h-20 w-3/4 animate-pulse rounded-sm bg-surface-2" />
            <div className="h-8 w-28 animate-pulse rounded-full bg-surface-2" />
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-sm bg-surface-2" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
