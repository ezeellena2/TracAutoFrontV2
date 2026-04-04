import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'

/**
 * Hook que encapsula el flujo de logout:
 * 1. Llama a authService.logout() para invalidar la sesion en el backend
 * 2. Limpia el store de sesion (access token, snapshot)
 * 3. Limpia el cache de React Query
 * 4. Navega a /auth/login
 *
 * Si el backend falla (red, timeout), igual limpia el estado local
 * para no dejar al usuario en estado parcialmente autenticado.
 */
export function useLogout() {
  const logout = useSessionStore((s) => s.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Siempre limpiar, incluso si el backend falla
      logout()
      queryClient.clear()
      navigate('/auth/login', { replace: true })
    },
  })
}
