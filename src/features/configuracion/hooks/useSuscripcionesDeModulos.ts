import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { configuracionKeys } from '../query-keys'
import { modulosService } from '@/services/plataforma-canonica/modulos-service'
import type { ModulosPageQuery } from '@/services/contracts/modulos'

/**
 * Lo que la organización del JWT tiene contratado, **con los dos ejes**.
 *
 * `staleTime` **30 s**, más corto que el catálogo: el eje comercial es espejo de Facturación y puede
 * moverlo alguien que no es quien está mirando la pantalla.
 *
 * ⚠️ **Es la ÚNICA superficie del producto que distingue "suspendido" de "no contratado".** Por
 * `D-GM-13` el claim `modulos` del JWT no lleva los suspendidos de ninguna forma, así que para el
 * resto del sistema los dos casos son idénticos. Si esta pantalla colapsa los ejes, esa diferencia
 * deja de existir para el usuario en todo ORBI.
 */
export function useSuscripcionesDeModulos(query: ModulosPageQuery = {}) {
  return useQuery({
    queryKey: configuracionKeys.suscripciones(query),
    queryFn: async () => {
      const respuesta = await modulosService.listarSuscripciones(query)
      return respuesta.data
    },
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}
