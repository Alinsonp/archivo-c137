import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { FavoritesContext, type FavoritesContextValue } from '../context/favorites-context'
import { useToast } from '../hooks/useToast'
import type { CharacterSummary } from '../types/character'
import { toSummary } from '../utils/format'
import { FAVORITES_STORAGE_KEY, loadFavorites, saveFavorites } from '../utils/storage'
import ConfirmDialog from './ConfirmDialog'

/**
 * Estado global de favoritos.
 *
 * Vive por encima del router, así que persiste entre rutas sin pasar props.
 * La persistencia en localStorage es una mejora sobre el requisito del enunciado
 * (que solo exige persistir entre rutas): permite que sobrevivan a una recarga.
 *
 * También aloja el único diálogo de «quitar de favoritos», para no montar uno por tarjeta.
 */
export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [favorites, setFavorites] = useState<CharacterSummary[]>(loadFavorites)
  const [pendingRemoval, setPendingRemoval] = useState<CharacterSummary | null>(null)

  // Solo se escribe en localStorage tras una acción del usuario, no al montar.
  const changedByUser = useRef(false)

  useEffect(() => {
    if (!changedByUser.current) return
    if (!saveFavorites(favorites)) {
      toast.error(
        'No se pudieron guardar tus favoritos en este navegador. Se mantienen mientras no recargues la página.',
      )
    }
  }, [favorites, toast])

  // Mantiene sincronizadas varias pestañas abiertas.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY) setFavorites(loadFavorites())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.some((favorite) => favorite.id === id),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (character: CharacterSummary) => {
      if (favorites.some((favorite) => favorite.id === character.id)) {
        setPendingRemoval(character)
        return
      }
      changedByUser.current = true
      // Se comprueba el id otra vez dentro del updater para evitar duplicados.
      setFavorites((current) =>
        current.some((favorite) => favorite.id === character.id)
          ? current
          : [...current, toSummary(character)],
      )
      toast.success(`${character.name} se añadió a tus favoritos.`)
    },
    [favorites, toast],
  )

  const confirmRemoval = () => {
    if (!pendingRemoval) return
    changedByUser.current = true
    setFavorites((current) => current.filter((favorite) => favorite.id !== pendingRemoval.id))
    toast.info(`${pendingRemoval.name} se quitó de tus favoritos.`)
    setPendingRemoval(null)
  }

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, count: favorites.length, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <ConfirmDialog
        open={pendingRemoval !== null}
        title="¿Quitar de favoritos?"
        description={
          <>
            Vas a quitar a <strong className="text-ink">{pendingRemoval?.name}</strong> de tu lista
            de favoritos. Podrás volver a añadirlo desde el listado.
          </>
        }
        confirmLabel="Quitar de favoritos"
        cancelLabel="Cancelar"
        tone="danger"
        // Dark pattern didáctico: ver el comentario en ConfirmDialog.
        biased
        onConfirm={confirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />
    </FavoritesContext.Provider>
  )
}
