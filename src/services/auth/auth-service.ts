import { httpClient } from '@/services/http/http-client'
import type {
  AuthResponse,
  LoginRequest,
  RegistroRequest,
  RegistroEmpresaRequest,
  RegistroPendienteResponse,
  VerificarCodigoRegistroRequest,
  ReenviarCodigoRegistroRequest,
  CambiarContextoRequest,
  AceptarInvitacionRequest,
  SolicitarRecuperacionPasswordRequest,
  RestablecerPasswordRequest,
  GoogleExchangeRequest,
  GoogleExchangeResponse,
  GooglePendingRegistrationResponse,
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
    httpClient.post<RegistroPendienteResponse>('/api/auth/registro', data),

  registroEmpresa: (data: RegistroEmpresaRequest) =>
    httpClient.post<RegistroPendienteResponse>('/api/auth/registro-empresa', data),

  registroPendiente: (ticket: string) =>
    httpClient.get<RegistroPendienteResponse>('/api/auth/registro-pendiente', {
      params: { ticket },
    }),

  verificarCodigoRegistro: (data: VerificarCodigoRegistroRequest) =>
    httpClient.post<AuthResponse>('/api/auth/verificar-email-registro', data),

  reenviarCodigoRegistro: (data: ReenviarCodigoRegistroRequest) =>
    httpClient.post<RegistroPendienteResponse>('/api/auth/reenviar-codigo-registro', data),

  refresh: () =>
    httpClient.post<AuthResponse>('/api/auth/refresh', {}),

  logout: () =>
    httpClient.post('/api/auth/logout', {}),

  solicitarRecuperacionPassword: (data: SolicitarRecuperacionPasswordRequest) =>
    httpClient.post('/api/auth/solicitar-recuperacion', data),

  restablecerPassword: (data: RestablecerPasswordRequest) =>
    httpClient.post('/api/auth/restablecer-password', data),

  cambiarContexto: (data: CambiarContextoRequest) =>
    httpClient.post<AuthResponse>('/api/auth/cambiar-contexto', data),

  aceptarInvitacion: (data: AceptarInvitacionRequest) =>
    httpClient.post<AuthResponse>('/api/auth/aceptar-invitacion', data),

  googleExchange: (data: GoogleExchangeRequest) =>
    httpClient.post<GoogleExchangeResponse>('/api/auth/google/exchange', data),

  googlePendingRegistration: (ticket: string) =>
    httpClient.get<GooglePendingRegistrationResponse>('/api/auth/google/pending-registration', {
      params: { ticket },
    }),

  googleCompleteRegistration: (data: GoogleCompleteRegistrationRequest) =>
    httpClient.post<AuthResponse>('/api/auth/google/complete-registration', data),
}
