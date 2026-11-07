import { RouterProvider } from 'react-router-dom'
import FavoritesProvider from '../components/FavoritesProvider'
import ToastProvider from '../components/ToastProvider'
import { router } from './router'

/**
 * Los proveedores envuelven al router para que los favoritos y los toasts persistan
 * entre rutas. Orden: los favoritos necesitan los toasts para avisar al usuario.
 */
export default function App() {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </ToastProvider>
  )
}
