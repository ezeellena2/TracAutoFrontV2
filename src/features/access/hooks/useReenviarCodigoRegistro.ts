import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'
import type { ReenviarCodigoRegistroRequest } from '@/services/contracts/auth'

export function useReenviarCodigoRegistro() {
  return useMutation({
    mutationFn: (data: ReenviarCodigoRegistroRequest) =>
      authService.reenviarCodigoRegistro(data),
  })
}
