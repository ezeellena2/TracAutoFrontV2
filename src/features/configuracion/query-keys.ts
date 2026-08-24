import type { ModulosPageQuery } from '@/services/contracts/modulos'

/**
 * Query keys de Configuración — convención `['configuracion', '<recurso>', <parámetros>]`.
 *
 * El prefijo compartido es deliberado: invalidar `['configuracion','modulos']` alcanza al catálogo,
 * al listado de suscripciones **y** a cualquier historial abierto. Es exactamente lo que hace falta
 * después de contratar, suspender, regularizar o dar de baja — las cuatro cambian el estado que las
 * tres lecturas muestran.
 *
 * ⚠️ **Los filtros y la paginación viajan DENTRO del objeto `q`, nunca como segmento propio.** Un
 * segmento aparte parte el prefijo, y a partir de ahí la mitad de las invalidaciones deja de
 * alcanzar al listado — sin error, sin warning: la pantalla simplemente se queda con datos viejos.
 *
 * ⚠️ **Todo lo que entra en una key tiene que ser estable POR VALOR entre renders.** Un objeto
 * recreado en cada render produce una key nueva por render, y React Query dispara una query nueva
 * por render. Ya costó un bucle infinito de requests una vez en este repo (`TabHistorial` de Flota).
 * La forma correcta es hacer el DATO estable, nunca memoizarlo a mano: `useMemo` está prohibido acá.
 */
export const configuracionKeys = {
  /** El prefijo que invalidan las 4 mutaciones. */
  modulos: () => ['configuracion', 'modulos'] as const,

  catalogo: (q: ModulosPageQuery) => ['configuracion', 'modulos', 'catalogo', q] as const,

  suscripciones: (q: ModulosPageQuery) =>
    ['configuracion', 'modulos', 'suscripciones', q] as const,

  historial: (codigo: string, q: ModulosPageQuery) =>
    ['configuracion', 'modulos', 'historial', codigo, q] as const,
}
