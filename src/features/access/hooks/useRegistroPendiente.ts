import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'

export function useRegistroPendiente(verificationTicket: string | null) {
  return useQuery({
    queryKey: ['auth', 'registro-pendiente', verificationTicket],
    queryFn: () => authService.registroPendiente(verificationTicket!),
    enabled: Boolean(verificationTicket),
    retry: false,
  })
}
