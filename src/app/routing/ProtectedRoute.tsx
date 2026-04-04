import { Navigate, useLocation } from 'react-router-dom'
import { useSessionStore } from '@/stores/session-store'
import { authService } from '@/services/auth/auth-service'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useEffect, type PropsWithChildren } from 'react'

/**
 * Guard que protege rutas autenticadas.
 *
 * 1. Si ya esta autenticado → muestra el children
 * 2. Si no esta autenticado → intenta recuperar sesion via refresh cookie
 *    - Si recupera → muestra children (el store ya tiene sesion)
 *    - Si falla → redirige a /auth/login preservando la ruta original
 */
export function ProtectedRoute({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)
  const login = useSessionStore((s) => s.login)
  const location = useLocation()

  const recovery = useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: (response) => {
      login(response.data)
    },
  })

  useEffect(function attemptSessionRecovery() {
    if (!isAuthenticated && recovery.isIdle) {
      recovery.mutate()
    }
  }, [isAuthenticated, recovery])

  // Ya autenticado (directo o por recovery)
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Recovery en curso
  if (recovery.isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg-canvas)]">
        <p className="text-[var(--color-text-secondary)] motion-safe:animate-pulse">
          {t('common.loading')}
        </p>
      </div>
    )
  }

  // Recovery fallo → redirigir a login
  return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
}
