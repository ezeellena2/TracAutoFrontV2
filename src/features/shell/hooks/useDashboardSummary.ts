import { useSessionStore } from '@/stores/session-store'

export function useDashboardSummary() {
  const esContextoPersonal = useSessionStore((state) => state.esContextoPersonal)
  const organizacionActivaNombre = useSessionStore((state) => state.organizacionActiva?.nombre)

  return {
    esContextoPersonal,
    organizacionActivaNombre,
  }
}
