import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { configuracionKeys } from '../query-keys'
import { modulosService } from '@/services/plataforma-canonica/modulos-service'
import type { ModulosPageQuery } from '@/services/contracts/modulos'

/**
 * El historial de transiciones de UN módulo. Append-only del lado del backend.
 *
 * `habilitado` existe porque el historial se lee dentro de un modal: sin él, React Query dispara la
 * query de los N módulos del catálogo apenas monta la pantalla.
 *
 * ⚠️ **Una fila por EJE, no por operación.** El nacimiento de la suscripción escribe **dos** filas
 * —una `funcional`, una `comercial`— con el mismo `version: 1` (`P4`). Una tabla que asuma "una fila
 * = un cambio" muestra el alta duplicada; la columna `eje` es la que las separa.
 *
 * ⚠️ **`estadoAnterior: null` es el nacimiento**, no un dato faltante.
 *
 * ⚠️ **El eje comercial NO publica eventos** (`GM-B12`): esta tabla es el **único** rastro de una
 * suspensión en todo ORBI, y está gateada por el tenant del JWT. Si el motivo viene `null`, no hay
 * otra fuente que lo explique.
 */
export function useHistorialDeModulo(
  codigo: string,
  query: ModulosPageQuery = {},
  habilitado = true
) {
  return useQuery({
    queryKey: configuracionKeys.historial(codigo, query),
    queryFn: async () => {
      const respuesta = await modulosService.listarHistorial(codigo, query)
      return respuesta.data
    },
    enabled: habilitado && codigo !== '',
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}
