# Archivo C-137

Sitio de exploración de contenido con varias vistas (SPA) construido para el **Proyecto 01**. Permite descubrir personajes de *Rick and Morty* con datos reales de una API pública, buscarlos y filtrarlos en tiempo real, abrir su ficha, guardar favoritos y enviar un formulario de contacto validado.

La identidad visual se inspira en el cine: títulos condensados de cartel, tarjetas con composición de póster y bloque de créditos, tema oscuro "terciopelo de sala" y tema claro "programa de mano", con carmesí y oro como acentos.

- **Repositorio (GitHub):** _pendiente: añadir la URL pública tras subir el código_
- **Aplicación (Vercel):** _pendiente: añadir la URL de producción tras el despliegue_

## API utilizada

[The Rick and Morty API](https://rickandmortyapi.com/documentation): pública, gratuita y sin clave. No hay datos de catálogo escritos en el código: todo llega de la API.

| Uso | Endpoint |
| --- | --- |
| Listado, búsqueda y filtro | `GET /api/character?page=1&name=rick&status=alive` |
| Detalle individual por ID | `GET /api/character/:id` |
| Carteles destacados del inicio | `GET /api/character/1,2,3` |

## Stack

- Vite + React 19 + TypeScript (modo estricto)
- React Router 7 (`createBrowserRouter`, `NavLink`, `Link`, `useParams`, `useSearchParams`)
- Tailwind CSS 4 para todo el estilo, con prefijos responsive (`sm:`, `md:`, `lg:`, `xl:`)
- Fuentes autoalojadas con Fontsource (League Gothic y Hanken Grotesk): sin peticiones a servicios externos
- Sin librerías de UI ni de toasts: los avisos se implementaron con `useState` + `setTimeout`

## Instalación y ejecución

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # comprobación de tipos + build de producción en dist/
npm run preview    # sirve el build de producción en local
npm run typecheck  # solo comprobación de tipos
```

## Rutas

| Ruta | Vista |
| --- | --- |
| `/` | Inicio: hero con propósito, llamada a la acción y carteles destacados de la API |
| `/explorar` | Grid de tarjetas, búsqueda, filtro por estado, paginación y estados de carga/error/vacío |
| `/explorar/:id` | Detalle: fetch individual por ID, atributos reales y botón de favorito |
| `/favoritos` | Lista reactiva de favoritos con confirmación al quitar y estado vacío |
| `/contacto` | Formulario controlado con validación y confirmación |
| `*` | Página 404 |

Todas las rutas funcionan al abrirlas directamente o al recargar (ver `vercel.json`).

## Funcionalidades

- **Búsqueda en tiempo real** por nombre, del lado del servidor, con *debounce* de 350 ms y sin botón de envío.
- **Filtro por estado** (Todos, Vivo, Muerto, Desconocido) que se combina con la búsqueda.
- **Estado en la URL** (`?q=&status=&page=`): los resultados se pueden compartir, el botón Atrás funciona y «Volver» desde el detalle regresa al mismo listado. Cambiar la búsqueda o el filtro reinicia a la página 1.
- **Paginación** «Anterior / Siguiente» basada en `info.pages` de la API; el texto de resultados usa el `count` real.
- **Sin condiciones de carrera:** cada cambio de parámetros cancela la petición anterior con `AbortController` y descarta respuestas obsoletas.
- **Favoritos globales** con Context (`FavoritesProvider` + `useFavorites`), sin duplicados, sincronizados entre grid, detalle y favoritos, con insignia de conteo en la navegación. Se guardan en `localStorage` para sobrevivir a una recarga (mejora sobre el requisito, que solo exige persistir entre rutas).
- **Tema claro/oscuro** con preferencia guardada y respeto de `prefers-color-scheme`.

## Estados de la interfaz

| Estado | Cuándo aparece |
| --- | --- |
| Loading | Mientras hay una petición en curso (spinner con texto anunciable y esqueleto) |
| Error | Fallo real de red o servidor, con botón «Reintentar» |
| Empty | Búsqueda sin coincidencias (con «Limpiar filtros»), página fuera de rango y favoritos vacíos |
| Toast de éxito, info y error | Favorito añadido, favorito quitado o filtros restablecidos, y fallos; se cierran solos y se pausan al pasar el puntero o el foco |
| Diálogo de confirmación | Al quitar un favorito y antes de confirmar el formulario de contacto |
| Formulario inválido | Errores por campo y botón «Enviar mensaje» deshabilitado |

La API responde HTTP 404 cuando una búsqueda no tiene coincidencias. El servicio lo traduce a «vacío» solo para el listado; en el detalle, un 404 significa «ese personaje no existe». Son casos distintos y distintos de la página 404 de ruta.

## Modal nativo y dark pattern didáctico

Las confirmaciones usan `<dialog>` nativo con `useRef` y `showModal()` (componente `ConfirmDialog`). Gestiona Escape, clic en el fondo, foco inicial y devolución del foco.

El trabajo exige incluir **un dark pattern intencional**. Está en el diálogo de «¿Quitar de favoritos?»: un **sesgo de jerarquía visual** donde «Quitar de favoritos» es grande, saturado y con sombra, mientras «Cancelar» es un enlace pequeño subrayado. Está documentado en un comentario al inicio de `src/components/ConfirmDialog.tsx` y se activa con la prop `biased`.

Se mantuvo deliberadamente acotado: ambas opciones son visibles y honestas, Cancelar conserva contraste y un área táctil de 44 px, el foco inicial está en Cancelar para evitar confirmar por accidente, y no hay textos culpabilizadores ni otros trucos. El diálogo del formulario de contacto es neutral (ambos botones con el mismo peso). **Se incluye solo por el requisito pedagógico y no debe copiarse a un producto real.**

## Formulario de contacto

Campos controlados: nombre (mínimo 2 caracteres), correo con formato válido y mensaje (mínimo 10). Las longitudes exactas son una decisión de implementación. El enunciado no exige un backend, así que **el envío es una demostración local** y la interfaz lo dice con claridad: no se envía nada a ningún servidor ni correo. `src/services/contactApi.ts` es el único punto a reemplazar si se conecta un servicio real; el formulario ya conserva los datos si el envío falla.

## Accesibilidad

- HTML semántico (`header`, `nav`, `main`, `section`, `footer`, `dl`), enlace «Saltar al contenido» y título de documento por ruta.
- El foco se mueve al contenido principal al cambiar de ruta.
- `alt` descriptivo en imágenes informativas (`alt=""` cuando el nombre ya aparece al lado) y alternativa visual si una imagen falla.
- Formularios con `label htmlFor`, `aria-invalid` y `aria-describedby`; los errores llevan icono y texto, no solo color.
- Botones con nombre accesible (por ejemplo «Añadir a Rick Sanchez a favoritos») y estados anunciables con `role="status"` / `role="alert"`.
- Navegación completa por teclado con foco visible, controles táctiles de al menos 44 px y `prefers-reduced-motion` respetado.

## Estructura

```text
src/
  app/          App.tsx, router.tsx
  components/   27 componentes .tsx (Header, Footer, Hero, CharacterCard, ConfirmDialog, ...)
  pages/        HomePage, ExplorePage, DetailPage, FavoritesPage, ContactPage, NotFoundPage
  context/      favorites-context.ts, toast-context.ts
  hooks/        useCharacters, useCharacter, useFavorites, useToast, useTheme, ...
  services/     characterApi.ts (fetch de lista y detalle), contactApi.ts (demostración)
  types/        character.ts
  utils/        validation, format, storage, estilos compartidos
```

## Cómo probar los estados manualmente

- **Error con reintento:** en DevTools, pestaña Network, activa *Offline* y recarga `/explorar`; desactívalo y pulsa «Reintentar».
- **Loading:** en Network, aplica *Slow 3G* y recarga.
- **Sin coincidencias:** busca `zzzz`.
- **ID inexistente:** abre `/explorar/999999`.
- **Fetch individual:** abre un detalle y comprueba en Network la petición a `/api/character/:id`.

## Despliegue en Vercel

1. Sube el código a un repositorio **público** de GitHub.
2. En Vercel, importa el repositorio. Se detecta Vite automáticamente (`npm run build`, salida `dist`).
3. `vercel.json` ya incluye la reescritura a `index.html` para que las rutas del SPA funcionen al recargar.
4. Entrega en el aula virtual los dos enlaces: el del repositorio y el de la aplicación desplegada (sin archivos `.zip`).

## Créditos

Datos e imágenes de [The Rick and Morty API](https://rickandmortyapi.com). Los personajes pertenecen a sus respectivos titulares; este es un proyecto académico sin fines comerciales.
