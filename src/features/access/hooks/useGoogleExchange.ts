import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth/auth-service'
import { useSessionStore } from '@/stores/session-store'
import type { GoogleExchangeRequest } from '@/services/contracts/auth'

/**
 * Hook que encapsula el flujo de Google exchange:
 * 1. Llama a authService.googleExchange()
 * 2. Segun el outcome:
 *    - authenticated: actualiza store y navega a /app
 *    - requires_profile_completion: navega a completar registro con ticket y prefill
 *    - requires_account_link: no navega, la pagina muestra un alert
 */
export function useGoogleExchange() {
  const login = useSessionStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: GoogleExchangeRequest) => authService.googleExchange(data),
    onSuccess: (response) => {
      const data = response.data

      if (data.outcome === 'authenticated' && data.sessionSnapshot) {
        login({
          accessToken: data.accessToken!,
          refreshToken: data.refreshToken!,
          sessionSnapshot: data.sessionSnapshot,
        })
        navigate('/app', { replace: true })
        return
      }

      if (data.outcome === 'requires_profile_completion') {
        navigate('/auth/google/completar-registro', {
          replace: true,
          state: {
            registrationTicket: data.registrationTicket,
            prefill: data.prefill,
          },
        })
      }

      // requires_account_link: la page lee mutation.data para mostrar el alert
    },
  })
}
