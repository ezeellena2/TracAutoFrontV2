import { create } from 'zustand'
import type {
  AuthResponse,
  SessionSnapshot,
  OrganizacionActiva,
} from '@/services/contracts/auth'

interface SessionState {
  // Datos
  accessToken: string | null
  snapshot: SessionSnapshot | null

  // Derivados
  isAuthenticated: boolean
  organizacionActiva: OrganizacionActiva | null
  esContextoPersonal: boolean

  // Acciones
  login: (response: AuthResponse) => void
  updateContext: (response: AuthResponse) => void
  logout: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  // Estado inicial — no autenticado
  accessToken: null,
  snapshot: null,
  isAuthenticated: false,
  organizacionActiva: null,
  esContextoPersonal: false,

  // Login o registro exitoso: guardar todo
  login: (response: AuthResponse) =>
    set({
      accessToken: response.accessToken,
      snapshot: response.sessionSnapshot,
      isAuthenticated: true,
      organizacionActiva: response.sessionSnapshot.organizacionActiva,
      esContextoPersonal: response.sessionSnapshot.organizacionActiva.esMicroOrg,
    }),

  // Cambio de contexto o refresh: actualizar sesion
  updateContext: (response: AuthResponse) =>
    set({
      accessToken: response.accessToken,
      snapshot: response.sessionSnapshot,
      organizacionActiva: response.sessionSnapshot.organizacionActiva,
      esContextoPersonal: response.sessionSnapshot.organizacionActiva.esMicroOrg,
    }),

  // Logout: limpiar todo
  logout: () =>
    set({
      accessToken: null,
      snapshot: null,
      isAuthenticated: false,
      organizacionActiva: null,
      esContextoPersonal: false,
    }),
}))
