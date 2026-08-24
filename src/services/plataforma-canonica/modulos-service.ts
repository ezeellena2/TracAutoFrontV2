import { httpClient } from '@/services/http/http-client'
import type { PagedResult } from '@/services/contracts/paginacion'
import type {
  ContratarModuloRequest,
  ModuloCatalogoDto,
  ModulosPageQuery,
  MotivoDeTransicionRequest,
  SuscripcionDto,
  TransicionDto,
} from '@/services/contracts/modulos'

const BASE = '/api/plataforma-canonica/modulos'

/**
 * Cliente HTTP de `ModulosController` — **las 7 filas del contrato, completas**.
 * `api.md` del track `gestion-modulos` no declara ninguna más.
 *
 * ══ LA ORGANIZACIÓN NO VIAJA NUNCA ═════════════════════════════════════════════════════════════
 * Ningún método acepta `organizacionId`, y no es omisión: el backend lo saca del JWT a propósito.
 * Mandarlo sería un vector de escritura **cross-tenant con un token legítimo**.
 *
 * Corolario: una suscripción de otra organización responde **404**, nunca 403 — el filtro va en el
 * `WHERE`, así que "de otra org" es indistinguible de "no existe".
 *
 * ══ LO QUE NO EXISTE, TRANSCRIPTO DEL CONTRATO ═════════════════════════════════════════════════
 *  - **No hay `DELETE`**: la baja es `POST .../baja`, y deja la fila viva con
 *    `estado_funcional = 'dada_de_baja'`. La fila es permanente por `(org, módulo)` (`I-S2`):
 *    borrarla y recrearla duplicaría roles y dejaría usuarios apuntando a un `RolId` huérfano.
 *  - **No hay `GET /suscripciones/{codigo}`**: el detalle sale del listado, que ya trae todo.
 *  - **No hay filtros ni `sortBy`**: `ModulosPageQuery` es `PageQuery` pelado. El orden lo fija el
 *    server.
 *  - **No hay precio ni facturación**: `ModuloCatalogoDto` no tiene un solo campo comercial, y el
 *    servicio Facturación no existe.
 *
 * ══ ERRORES QUE ESTA SUPERFICIE DEVUELVE ═══════════════════════════════════════════════════════
 *  - 404 `modulos.catalogo.no_encontrado` · 404 `modulos.suscripcion.no_encontrada`
 *  - 409 `modulos.suscripcion.transicion_invalida` (args `codigo`, `eje`, `estado_actual`, `estado_destino`)
 *  - 409 `modulos.suscripcion.dependencia_faltante` (args `codigo`, `faltantes[]`)
 *  - 409 `modulos.suscripcion.tiene_dependientes` (args `codigo`, `dependientes[]`)
 *  - 409 `modulos.catalogo.no_suscribible`
 *  - 409 `modulos.catalogo.es_base` (args `codigo`) — `/baja` sobre el módulo base (`I-M4`)
 */
export const modulosService = {
  /** Catálogo GLOBAL de la plataforma. No filtra por organización. */
  listarCatalogo: (query: ModulosPageQuery) =>
    httpClient.get<PagedResult<ModuloCatalogoDto>>(`${BASE}/catalogo`, { params: query }),

  /**
   * Las suscripciones de la organización del JWT, **con los dos ejes**.
   *
   * ⚠️ Es la **única** superficie del producto donde se distingue "suspendido" de "no contratado":
   * el claim `modulos` del token deliberadamente no lo hace (`D-GM-13`). Si esta pantalla colapsa
   * los ejes, esa diferencia deja de existir para el usuario en todo el sistema.
   */
  listarSuscripciones: (query: ModulosPageQuery) =>
    httpClient.get<PagedResult<SuscripcionDto>>(`${BASE}/suscripciones`, { params: query }),

  listarHistorial: (codigo: string, query: ModulosPageQuery) =>
    httpClient.get<PagedResult<TransicionDto>>(
      `${BASE}/suscripciones/${codigo}/historial`,
      { params: query }
    ),

  /**
   * Mueve el eje **funcional** a `activa`. Crea la fila si no existe, o recontrata in-place.
   *
   * ⚠️ **NO sirve para levantar una suspensión.** Un módulo suspendido tiene
   * `estadoFuncional: 'activa'` ya, así que esto es un **no-op que responde 200** y el módulo sigue
   * sin acceso. Para eso está `regularizar`. Un botón "Reactivar" cableado acá es la peor mentira
   * posible de esta pantalla: afirma un éxito que no pasó.
   */
  contratar: (codigo: string, body: ContratarModuloRequest) =>
    httpClient.post<SuscripcionDto>(`${BASE}/suscripciones/${codigo}/contratar`, body),

  /** Eje **comercial**. **No toca ningún permiso** (`D-GM-1`): es máscara, no destrucción. */
  suspender: (codigo: string, body?: MotivoDeTransicionRequest) =>
    httpClient.post<SuscripcionDto>(`${BASE}/suscripciones/${codigo}/suspender`, body ?? {}),

  /** Eje **comercial**. El acceso vuelve solo: nunca se borró nada. */
  regularizar: (codigo: string, body?: MotivoDeTransicionRequest) =>
    httpClient.post<SuscripcionDto>(`${BASE}/suscripciones/${codigo}/regularizar`, body ?? {}),

  /**
   * Eje **funcional**. **PURGA los permisos** del módulo de los roles plantilla **y custom**, y ese
   * borrado es **físico** — `RolPermiso` no tiene soft-delete. Al recontratar vuelven solo las
   * plantillas.
   */
  baja: (codigo: string, body?: MotivoDeTransicionRequest) =>
    httpClient.post<SuscripcionDto>(`${BASE}/suscripciones/${codigo}/baja`, body ?? {}),
}
