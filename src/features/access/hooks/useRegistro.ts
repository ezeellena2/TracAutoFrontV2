import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'
import type { RegistroRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el inicio del flujo de registro B2C:
 * 1. Llama a authService.registro()
 * 2. Devuelve el ticket del registro pendiente para continuar con la
 *    verificacion por email en una pantalla aparte.
 */
export function useRegistro() {
  return useMutation({
    mutationFn: (data: RegistroRequest) => authService.registro(data),
  })
}
