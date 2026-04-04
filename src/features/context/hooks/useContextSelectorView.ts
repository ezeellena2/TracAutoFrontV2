import { useSessionStore } from '@/stores/session-store'

export function useContextSelectorView() {
  const snapshot = useSessionStore((state) => state.snapshot)
  const organizacionActiva = useSessionStore((state) => state.organizacionActiva)

  const personalOrg = snapshot?.organizacionesDisponibles.find((org) => org.esMicroOrg) ?? null
  const empresaOrgs = snapshot?.organizacionesDisponibles.filter((org) => !org.esMicroOrg) ?? []

  return {
    snapshot,
    organizacionActiva,
    personalOrg,
    empresaOrgs,
  }
}
