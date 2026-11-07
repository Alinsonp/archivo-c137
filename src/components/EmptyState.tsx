import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  /** Acción sugerida: un botón o enlace que indica qué hacer a continuación. */
  children?: ReactNode
}

/** Estado "empty": sin resultados o sin elementos guardados. No es un error técnico. */
export default function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-md border border-dashed border-line px-6 py-14 text-center"
    >
      {icon && <div className="text-gold">{icon}</div>}
      <h2 className="title-card text-4xl">{title}</h2>
      {description && <p className="text-muted">{description}</p>}
      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
