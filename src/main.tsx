import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fuentes autoalojadas (sin peticiones a servicios externos): títulos de cartel y texto.
import '@fontsource/league-gothic'
import '@fontsource-variable/hanken-grotesk'
import App from './app/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
