import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'
import type { VerificarCodigoRegistroRequest } from '@/services/contracts/auth'

export function useVerificarCodigoRegistro() {
  return useMutation({
    mutationFn: (data: VerificarCodigoRegistroRequest) =>
      authService.verificarCodigoRegistro(data),
  })
}
