import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'
import type { RegistroRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el flujo de registro B2C:
 * 1. Llama a authService.registro()
 * 2. En exito: actualiza el store y navega a /app
 *
 * La pagina solo llama: registroMutation.mutate(data)
 */
export function useRegistro() {
  const login = useSessionStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegistroRequest) => authService.registro(data),
    onSuccess: (response) => {
      login(response.data)
      navigate('/app', { replace: true })
    },
  })
}
