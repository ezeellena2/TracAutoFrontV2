import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { configuracionKeys } from '../query-keys'
import { modulosService } from '@/services/plataforma-canonica/modulos-service'
import type { ModulosPageQuery } from '@/services/contracts/modulos'

/**
 * El catálogo **GLOBAL** de la plataforma: qué módulos existen, no cuáles tiene la organización.
 *
 * `staleTime` **5 min**, el más largo de la pantalla: es dato de plataforma que solo cambia cuando
 * ORBI publica un módulo nuevo. Las 4 mutaciones lo invalidan igual por compartir el prefijo — no
 * porque el catálogo cambie, sino porque no vale la pena una key separada para ahorrar un fetch.
 *
 * ⚠️ **No filtra por organización y no lleva estado**: el cruce catálogo × suscripción lo hace la
 * pantalla. Un módulo del catálogo sin fila en `suscripciones` es `no_contratado`, que **no es un
 * estado del modelo** sino la ausencia de la fila.
 */
export function useCatalogoModulos(query: ModulosPageQuery = {}) {
  return useQuery({
    queryKey: configuracionKeys.catalogo(query),
    queryFn: async () => {
      const respuesta = await modulosService.listarCatalogo(query)
      return respuesta.data
    },
    staleTime: 300_000,
    placeholderData: keepPreviousData,
  })
}
