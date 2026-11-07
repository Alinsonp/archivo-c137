import type { StatusFilterValue } from '../types/character'
import { STATUS_FILTER_OPTIONS } from '../utils/format'
import { CheckIcon } from './icons'

interface StatusFilterProps {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
}

/**
 * Filtro por estado como grupo de radios (teclado: flechas para moverse).
 * Los valores coinciden con los que admite la API (`alive`, `dead`, `unknown`);
 * `all` simplemente omite el parámetro. La opción activa muestra además un check,
 * así que no depende solo del color.
 */
export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Filtrar por estado</legend>
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTER_OPTIONS.map((option) => {
          const selected = option.value === value
          return (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold transition-colors hover:border-gold peer-checked:border-crimson peer-checked:bg-crimson peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                {selected && <CheckIcon className="size-4" />}
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
