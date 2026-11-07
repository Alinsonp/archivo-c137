import { useEffect } from 'react'

const SITE_NAME = 'Archivo C-137'

/** Actualiza `document.title` para que cada ruta tenga un título propio. */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  }, [title])
}
