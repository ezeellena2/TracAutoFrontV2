import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'
import type { LoginRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el flujo de login:
 * 1. Llama a authService.login()
 * 2. En exito: actualiza el store y navega a /app (o a la ruta original si venia de un redirect)
 *
 * La pagina solo llama: loginMutation.mutate(data)
 */
export function useLogin() {
  const login = useSessionStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()

  // Si venia de un redirect (ProtectedRoute guarda la ruta en state.from)
  const from = (location.state as { from?: string })?.from ?? '/app'

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      login(response.data)
      navigate(from, { replace: true })
    },
  })
}
