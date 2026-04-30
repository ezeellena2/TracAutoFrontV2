/**
 * Contratos de auth — forma exacta de lo que devuelve el backend.
 * No inventar campos. Si el backend cambia, se actualiza aca.
 */

// --- Response comun de todos los endpoints de auth ---

export interface AuthResponse {
  accessToken: string
  refreshToken?: string | null
  sessionSnapshot: SessionSnapshot
}

// --- Session Snapshot ---

export interface SessionSnapshot {
  usuarioId: string
  personaId: string
  nombre: string
  apellido: string
  email: string
  organizacionActiva: OrganizacionActiva
  organizacionesDisponibles: OrganizacionDisponible[]
}

export interface OrganizacionActiva {
  id: string
  nombre: string
  tipoOrganizacion: string
  esMicroOrg: boolean
  rol: string
  modulos: string[]
  permisos: string[]
}

export interface OrganizacionDisponible {
  id: string
  nombre: string
  tipoOrganizacion: string
  rol: string
  esMicroOrg: boolean
  modulos: string[]
  permisos: string[]
}

// --- Requests ---

export interface LoginRequest {
  email: string
  password: string
}

export interface RegistroRequest {
  email: string
  password: string
  tipoDocumento: string
  numeroDocumento: string
  nombre: string
  apellido: string
}

export interface RegistroEmpresaRequest {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  tipoDocumento: string
  numeroDocumento: string
  password: string
  empresa: {
    nombre: string
    cuit: string
    rubro?: string
  }
  modulos: string[]
}

export interface RegistroPendienteResponse {
  verificationTicket: string
  maskedEmail: string
  tipoRegistro: 'cliente_final' | 'empresa'
  expiraEnUtc: string
  puedeReenviarEnUtc?: string | null
  expirado: boolean
}

export interface VerificarCodigoRegistroRequest {
  verificationTicket: string
  codigo: string
}

export interface ReenviarCodigoRegistroRequest {
  verificationTicket: string
}

export interface CambiarContextoRequest {
  organizacionId: string
}

export interface AceptarInvitacionRequest {
  token: string
  email: string
  password: string
  tipoDocumento?: string
  numeroDocumento?: string
  nombre?: string
  apellido?: string
  esRegistroNuevo: boolean
}

export interface RefreshRequest {
  refreshToken?: string
}

export interface SolicitarRecuperacionPasswordRequest {
  email: string
}

export interface RestablecerPasswordRequest {
  token: string
  nuevaPassword: string
}

// --- Google federated auth ---

export interface GoogleExchangeRequest {
  credential: string
}

export interface GooglePrefill {
  email: string
  nombre: string | null
  apellido: string | null
}

export interface GoogleExchangeResponse {
  outcome: 'authenticated' | 'requires_profile_completion' | 'requires_account_link'
  accessToken?: string
  refreshToken?: string
  sessionSnapshot?: SessionSnapshot
  registrationTicket?: string
  prefill?: GooglePrefill
  code?: string
  messageKey?: string
  message_key?: string
  args?: Record<string, unknown>
}

export interface GooglePendingRegistrationResponse {
  registrationTicket: string
  prefill: GooglePrefill
}

export interface GoogleCompleteRegistrationRequest {
  registrationTicket: string
  tipoDocumento: string
  numeroDocumento: string
  password: string
}
