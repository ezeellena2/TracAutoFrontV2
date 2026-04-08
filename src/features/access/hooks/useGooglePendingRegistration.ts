import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth-service'

export function useGooglePendingRegistration(registrationTicket: string | null) {
  return useQuery({
    queryKey: ['auth', 'google-pending-registration', registrationTicket],
    queryFn: () => authService.googlePendingRegistration(registrationTicket!),
    enabled: Boolean(registrationTicket),
    retry: false,
  })
}
