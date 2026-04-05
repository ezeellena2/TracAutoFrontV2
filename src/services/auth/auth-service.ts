import { httpClient } from '@/services/http/http-client'
import type {
  AuthResponse,
  LoginRequest,
  RegistroRequest,
  RegistroEmpresaRequest,
  CambiarContextoRequest,
  AceptarInvitacionRequest,
  GoogleExchangeRequest,
  GoogleExchangeResponse,
  GoogleCompleteRegistrationRequest,
} from '@/services/contracts/auth'

/**
 * Funciones que llaman a los endpoints de Access.
 * No manejan estado — solo HTTP. El store se actualiza en el caller.
 */

export const authService = {
  login: (data: LoginRequest) =>
    httpClient.post<AuthResponse>('/api/auth/login', data),

  registro: (data: RegistroRequest) =>
    httpClient.post<AuthResponse>('/api/auth/registro', data),

  registroEmpresa: (data: RegistroEmpresaRequest) =>
    httpClient.post<AuthResponse>('/api/auth/registro-empresa', data),

  refresh: () =>
    httpClient.post<AuthResponse>('/api/auth/refresh', {}),

  logout: () =>
    httpClient.post('/api/auth/logout', {}),

  cambiarContexto: (data: CambiarContextoRequest) =>
    httpClient.post<AuthResponse>('/api/auth/cambiar-contexto', data),

  aceptarInvitacion: (data: AceptarInvitacionRequest) =>
    httpClient.post<AuthResponse>('/api/auth/aceptar-invitacion', data),

  googleExchange: (data: GoogleExchangeRequest) =>
    httpClient.post<GoogleExchangeResponse>('/api/auth/google/exchange', data),

  googleCompleteRegistration: (data: GoogleCompleteRegistrationRequest) =>
    httpClient.post<AuthResponse>('/api/auth/google/complete-registration', data),
}
