import { createContext } from 'react'
import type { CharacterSummary } from '../types/character'

export interface FavoritesContextValue {
  favorites: CharacterSummary[]
  count: number
  isFavorite: (id: number) => boolean
  /**
   * Si el personaje no está guardado lo añade; si ya lo está, abre el diálogo de
   * confirmación antes de quitarlo (la eliminación nunca es inmediata).
   */
  toggleFavorite: (character: CharacterSummary) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)
