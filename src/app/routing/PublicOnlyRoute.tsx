import { Navigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/session-store'
import type { PropsWithChildren } from 'react'

/**
 * Guard que impide acceder a rutas publicas (login, registro) si ya esta autenticado.
 * Redirige a /app.
 */
export function PublicOnlyRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}
