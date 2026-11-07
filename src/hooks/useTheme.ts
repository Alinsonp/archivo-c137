import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'archivo-c137:theme'

/** El script de index.html ya aplicó el tema inicial; aquí solo se lee del DOM. */
function readTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#150A0D' : '#F3EDEE')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Sin almacenamiento disponible: el tema solo dura mientras la pestaña esté abierta.
    }
    setTheme(next)
  }, [])

  return { theme, toggleTheme }
}
