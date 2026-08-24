import { useMutation, useQueryClient } from '@tanstack/react-query'
import { configuracionKeys } from '../query-keys'
import { modulosService } from '@/services/plataforma-canonica/modulos-service'
import type { SuscripcionDto } from '@/services/contracts/modulos'
import type { TransicionConMotivoVariables } from './useSuspenderModulo'

/**
 * Mueve el eje **funcional** a `dada_de_baja`. **Es la única transición destructiva de la pantalla.**
 *
 * Purga los permisos del módulo de **todos** los roles —plantilla y propios de la organización— y ese
 * borrado es **físico**: `RolPermiso` no implementa `ISoftDeletable`, así que no hay papelera ni
 * reversión. Al recontratar el backend re-siembra solo los roles **plantilla**; los permisos que el
 * cliente había puesto en sus roles propios hay que volver a asignarlos a mano.
 *
 * Las tres cosas de arriba van escritas en el diálogo, y el diálogo va con confirmación por tipeo. No
 * es exceso de ceremonia: es la diferencia entre esto y `suspender`, que se parece en la UI y no
 * destruye nada.
 *
 * ⚠️ **La fila NO se borra** (`I-S2`): queda viva con `estadoFuncional: 'dada_de_baja'`, permanente
 * por `(organización, módulo)`. Recontratar es un flip *in-place*. Si se borrara y recreara, el
 * re-seed duplicaría roles y dejaría usuarios apuntando a un `RolId` huérfano.
 *
 * ⚠️ **Puede fallar con 409 `tiene_dependientes`** (`args.dependientes[]`): no se da de baja un módulo
 * del que cuelgan otros activos. Primero se dan de baja ellos.
 */
export function useDarDeBajaModulo() {
  const queryClient = useQueryClient()

  return useMutation<SuscripcionDto, unknown, TransicionConMotivoVariables>({
    mutationFn: async ({ codigo, motivo }) => {
      const respuesta = await modulosService.baja(codigo, { motivo })
      return respuesta.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.modulos() })
    },
  })
}
