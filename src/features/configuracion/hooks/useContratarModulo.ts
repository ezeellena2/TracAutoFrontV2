import { useMutation, useQueryClient } from '@tanstack/react-query'
import { configuracionKeys } from '../query-keys'
import { modulosService } from '@/services/plataforma-canonica/modulos-service'
import type { SuscripcionDto } from '@/services/contracts/modulos'

export interface ContratarModuloVariables {
  codigo: string
  /**
   * ⚠️ **`false` SIEMPRE en el primer intento.** Con `true` el backend activa además las
   * dependencias faltantes, y activar en silencio módulos que el cliente no pidió es justo lo que el
   * contrato prohíbe. El flujo correcto: mandar `false`; si vuelve 409 `dependencia_faltante`,
   * mostrar la lista de `args.faltantes` y **recién ahí** reintentar con `true`.
   */
  encadenar: boolean
}

/**
 * Mueve el eje **funcional** a `activa`. Crea la fila si no existe, o recontrata *in-place*.
 *
 * ⚠️ **NO levanta una suspensión.** Un módulo suspendido ya tiene `estadoFuncional: 'activa'`, así
 * que esto responde **200 sin hacer nada** y el acceso sigue cortado. Por eso `accionesDe` no ofrece
 * `contratar` sobre un suspendido: sería un botón que afirma un éxito que no ocurrió.
 *
 * ⚠️ **Contratar un módulo NO le da permisos a nadie.** Habilita al admin a **poder ponerlos** en un
 * rol: la suscripción es el plano de capacidades, el permiso el de acceso. El backend re-siembra los
 * roles **plantilla**; los roles propios de la organización hay que completarlos a mano.
 *
 * ⚠️ **El efecto NO es instantáneo para el resto de la app.** El claim `modulos` viaja en un token de
 * 15 minutos y se actualiza en el próximo `/refresh`: hasta entonces el menú lateral y el gate de
 * ruta siguen viendo la foto vieja. La pantalla tiene que **decirlo** — afirmar lo contrario es
 * mentir, y el usuario que hace clic y choca contra un 403 no tiene forma de entender por qué.
 * Auto-disparar `/refresh` acá **no es la salida**: el refresh token es single-use rotativo
 * (`CONC-01`) y correría carrera con el que dispara el interceptor de 401.
 *
 * El `codigo` viaja en las variables, no en el hook: el diálogo es **uno solo** y cambia de módulo
 * según la card que abrió el usuario. Ligarlo al hook dejaría un valor viejo en el closure.
 */
export function useContratarModulo() {
  const queryClient = useQueryClient()

  return useMutation<SuscripcionDto, unknown, ContratarModuloVariables>({
    mutationFn: async ({ codigo, encadenar }) => {
      const respuesta = await modulosService.contratar(codigo, { encadenar })
      return respuesta.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.modulos() })
    },
  })
}
