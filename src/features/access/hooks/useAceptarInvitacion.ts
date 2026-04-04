import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'
import type { AceptarInvitacionRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el flujo de aceptar invitacion:
 * 1. Llama a authService.aceptarInvitacion()
 * 2. En exito: actualiza el store y navega a /app
 *
 * Funciona para ambos casos: usuario existente (login) y nuevo (registro).
 */
export function useAceptarInvitacion() {
  const login = useSessionStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: AceptarInvitacionRequest) => authService.aceptarInvitacion(data),
    onSuccess: (response) => {
      login(response.data)
      navigate('/app', { replace: true })
    },
  })
}
