import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'
import type { RestablecerPasswordRequest } from '@/services/contracts/auth'

/**
 * Consume el token del email y restablece la password del usuario.
 */
export function useRestablecerPassword() {
  return useMutation({
    mutationFn: (data: RestablecerPasswordRequest) =>
      authService.restablecerPassword(data),
  })
}
