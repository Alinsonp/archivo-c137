import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import RouteErrorPage from '../components/RouteErrorPage'
import ContactPage from '../pages/ContactPage'
import DetailPage from '../pages/DetailPage'
import ExplorePage from '../pages/ExplorePage'
import FavoritesPage from '../pages/FavoritesPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

/**
 * Todas las rutas comparten el Layout (cabecera y pie). Las vistas cuelgan de una ruta
 * sin path con `errorElement`, así un fallo de render no se lleva la navegación.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'explorar', element: <ExplorePage /> },
          { path: 'explorar/:id', element: <DetailPage /> },
          { path: 'favoritos', element: <FavoritesPage /> },
          { path: 'contacto', element: <ContactPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
