import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'
import type { SolicitarRecuperacionPasswordRequest } from '@/services/contracts/auth'

/**
 * Solicita un link de recuperacion de password para el email indicado.
 * El backend siempre responde Accepted para no filtrar existencia de cuentas.
 */
export function useSolicitarRecuperacionPassword() {
  return useMutation({
    mutationFn: (data: SolicitarRecuperacionPasswordRequest) =>
      authService.solicitarRecuperacionPassword(data),
  })
}
