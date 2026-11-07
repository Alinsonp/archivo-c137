import { useTheme } from '../hooks/useTheme'
import { MoonIcon, SunIcon } from './icons'

/** Alterna entre tema claro y oscuro; la preferencia se guarda y respeta `prefers-color-scheme`. */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextLabel = theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
      className="flex size-11 items-center justify-center rounded-md text-ink hover:bg-surface-2"
    >
      {theme === 'dark' ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  )
}
