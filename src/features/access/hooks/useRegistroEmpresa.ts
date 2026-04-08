import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'
import type { RegistroEmpresaRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el inicio del flujo de registro empresa:
 * 1. Llama a authService.registroEmpresa()
 * 2. Devuelve el ticket del registro pendiente para continuar con la
 *    verificacion por email en una pantalla aparte.
 */
export function useRegistroEmpresa() {
  return useMutation({
    mutationFn: (data: RegistroEmpresaRequest) => authService.registroEmpresa(data),
  })
}
