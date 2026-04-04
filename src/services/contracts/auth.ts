/**
 * Contratos de auth — forma exacta de lo que devuelve el backend.
 * No inventar campos. Si el backend cambia, se actualiza aca.
 */

// --- Response comun de todos los endpoints de auth ---

export interface AuthResponse {
  accessToken: string
  refreshToken: string
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
