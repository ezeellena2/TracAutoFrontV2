import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupSessionBridge } from '@/services/session/setup-session-bridge'
import '@/shared/i18n'
import './index.css'
import App from './app/App'

// Conectar el bridge de sesion al store — antes de que React arranque
setupSessionBridge()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
