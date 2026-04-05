import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'
import type { GoogleCompleteRegistrationRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el flujo de completar registro federado:
 * 1. Llama a authService.googleCompleteRegistration()
 * 2. En exito: actualiza store y navega a /app
 */
export function useGoogleCompleteRegistration() {
  const login = useSessionStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: GoogleCompleteRegistrationRequest) =>
      authService.googleCompleteRegistration(data),
    onSuccess: (response) => {
      login(response.data)
      navigate('/app', { replace: true })
    },
  })
}
