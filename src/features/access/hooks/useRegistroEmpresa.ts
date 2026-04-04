import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'
import type { RegistroEmpresaRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el flujo de registro empresa:
 * 1. Llama a authService.registroEmpresa()
 * 2. En exito: actualiza el store y navega a /app
 */
export function useRegistroEmpresa() {
  const login = useSessionStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegistroEmpresaRequest) => authService.registroEmpresa(data),
    onSuccess: (response) => {
      login(response.data)
      navigate('/app', { replace: true })
    },
  })
}
