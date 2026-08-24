import { useMutation, useQueryClient } from '@tanstack/react-query'
import { configuracionKeys } from '../query-keys'
import { modulosService } from '@/services/plataforma-canonica/modulos-service'
import type { SuscripcionDto } from '@/services/contracts/modulos'

/** El motivo es **opcional** (`P1`): el backend acepta body ausente, `{}` o `{ motivo }`. */
export interface TransicionConMotivoVariables {
  codigo: string
  motivo?: string | null
}

/**
 * Mueve el eje **comercial** a `suspendida`. Es una **máscara, no una destrucción** (`D-GM-1`).
 *
 * No toca `RolPermiso`: el acceso se corta en el gate, que lee el claim `modulos`. Al regularizar
 * vuelve solo, sin reasignar nada. El copy del diálogo tiene que decirlo — si el usuario cree que
 * suspender borra su configuración de roles, no lo va a usar nunca y va a dar de baja en su lugar,
 * que sí destruye.
 *
 * ⚠️ **Esta transición no publica ningún evento** (`GM-B12`): `historial_suscripcion_modulo` es su
 * único rastro en todo ORBI, y está gateado por el tenant del JWT. Notificaciones no puede avisarle
 * al cliente y Auditoría no la ve. Por eso el `motivo`, aunque sea opcional, es lo único que va a
 * explicar después por qué se cortó el acceso.
 *
 * ⚠️ **`GM-B8`, abierto**: el permiso que gatea esto (`sistema.modulos.gestionar`) se reparte a owner
 * y admin **de la propia organización**, y no hay superficie interna. O sea que hoy el único humano
 * que puede suspender por impago es el cliente moroso. La pantalla no lo arregla; lo hereda.
 */
export function useSuspenderModulo() {
  const queryClient = useQueryClient()

  return useMutation<SuscripcionDto, unknown, TransicionConMotivoVariables>({
    mutationFn: async ({ codigo, motivo }) => {
      const respuesta = await modulosService.suspender(codigo, { motivo })
      return respuesta.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.modulos() })
    },
  })
}
