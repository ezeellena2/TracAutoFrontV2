import { useMutation, useQueryClient } from '@tanstack/react-query'
import { configuracionKeys } from '../query-keys'
import { modulosService } from '@/services/plataforma-canonica/modulos-service'
import type { SuscripcionDto } from '@/services/contracts/modulos'
import type { TransicionConMotivoVariables } from './useSuspenderModulo'

/**
 * Mueve el eje **comercial** a `al_dia`. Es lo único que levanta una suspensión.
 *
 * El acceso vuelve entero y sin trabajo manual, porque suspender nunca borró nada. Es la contracara
 * exacta de la baja, que sí purga y sí obliga a reasignar los roles propios.
 *
 * ⚠️ **No hay vuelta a `trial`.** Las máquinas de estado son fail-closed y ningún camino regresa al
 * período de prueba: un trial suspendido que se regulariza queda `al_dia`, no `trial`. Si la pantalla
 * mostraba el vencimiento de la prueba, después de esto deja de haber uno.
 *
 * ⚠️ Igual que suspender, **no publica evento** y su rastro vive solo en el historial.
 */
export function useRegularizarModulo() {
  const queryClient = useQueryClient()

  return useMutation<SuscripcionDto, unknown, TransicionConMotivoVariables>({
    mutationFn: async ({ codigo, motivo }) => {
      const respuesta = await modulosService.regularizar(codigo, { motivo })
      return respuesta.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.modulos() })
    },
  })
}
