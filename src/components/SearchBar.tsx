import { useId } from 'react'
import { CloseIcon, SearchIcon } from './icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

/** Búsqueda en tiempo real: no hay botón de envío, la página reacciona al escribir. */
export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const inputId = useId()

  return (
    <form
      role="search"
      aria-label="Buscar personajes"
      onSubmit={(event) => event.preventDefault()}
      className="relative w-full"
    >
      <label htmlFor={inputId} className="sr-only">
        Buscar personaje por nombre
      </label>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
      <input
        id={inputId}
        name="q"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        placeholder="Busca por nombre, por ejemplo Rick"
        className="min-h-12 w-full appearance-none rounded-md border border-line bg-surface pl-12 pr-12 text-base text-ink placeholder:text-muted focus:border-gold [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Borrar búsqueda"
          className="absolute right-0.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink"
        >
          <CloseIcon className="size-5" />
        </button>
      )}
    </form>
  )
}
