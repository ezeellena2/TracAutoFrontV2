import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'
import type { CambiarContextoRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el cambio de contexto (organizacion activa):
 * 1. Llama a authService.cambiarContexto()
 * 2. En exito: rehidrata session store y navega a /app
 *
 * El cambio de contexto emite un JWT nuevo con la org destino.
 */
export function useContextSwitch() {
  const updateContext = useSessionStore((s) => s.updateContext)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CambiarContextoRequest) => authService.cambiarContexto(data),
    onSuccess: (response) => {
      updateContext(response.data)
      navigate('/app', { replace: true })
    },
  })
}
