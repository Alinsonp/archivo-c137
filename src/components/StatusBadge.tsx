import type { CharacterStatus } from '../types/character'
import { cx } from '../utils/cx'
import { statusLabel } from '../utils/format'

interface StatusBadgeProps {
  status: CharacterStatus
  /** `overlay` para ponerlo sobre una imagen; `plain` sobre superficies normales. */
  tone?: 'overlay' | 'plain'
  className?: string
}

const DOT: Record<CharacterStatus, string> = {
  Alive: 'bg-[#52c99b]',
  Dead: 'bg-[#ff8c93]',
  unknown: 'bg-[#b7a9ac]',
}

/** El estado se comunica con texto; el punto de color es un refuerzo, no la única señal. */
export default function StatusBadge({ status, tone = 'plain', className }: StatusBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold',
        tone === 'overlay'
          ? 'bg-black/75 text-white'
          : 'border border-line bg-surface-2 text-ink',
        className,
      )}
    >
      <span aria-hidden="true" className={cx('size-2 rounded-full', DOT[status] ?? DOT.unknown)} />
      {statusLabel(status)}
    </span>
  )
}
