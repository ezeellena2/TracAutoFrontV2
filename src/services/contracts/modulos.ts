import type { PageQuery } from './paginacion'

/* ============================================================================
 * GESTIÓN DE MÓDULOS — contrato de `/api/plataforma-canonica/modulos`
 * ============================================================================
 *
 * Transcripción de `PlataformaCanonica.Application/DTOs/ModulosDTOs.cs`. No hay generación de
 * tipos: si el backend cambia, esto se actualiza a mano.
 *
 * ══ EL MODELO EN UNA LÍNEA: DOS EJES INDEPENDIENTES ═══════════════════════════════════════════
 * Un módulo no tiene "un estado": tiene **dos**, y son independientes (`D-GM-10`).
 *
 *   estado_funcional  — ¿la organización TIENE el módulo?     activa | dada_de_baja
 *   estado_comercial  — ¿está pago?                           trial | al_dia | suspendida
 *
 * El acceso real es la **conjunción**: `activa AND != suspendida` (`I-S3`). Es lo que evalúa el
 * gate del backend, y lo que `tieneAccesoHoy()` reproduce en el front.
 *
 * ⚠️ **Colapsarlos en un solo estado es el defecto que esta pantalla existe para evitar.** La ficha
 * original lo hacía, y de ahí salía que "desactivar elimina permisos" — cierto para la baja,
 * falso y destructivo para la suspensión (`D-GM-1`).
 * ========================================================================== */

/**
 * `PageQuery` **pelado**, sin `sortBy`, y es deliberado del backend
 * (`ModulosDTOs.cs`: *"un sortBy que el server ignora es peor que uno ausente"*).
 *
 * ⚠️ Consecuencia para la pantalla: **ninguna columna es ordenable**. El orden lo fija el contrato
 * (catálogo por código; historial por fecha DESC con desempate por id).
 */
export type ModulosPageQuery = PageQuery

/** Una fila del catálogo GLOBAL. No lleva tenant: el catálogo es de la plataforma. */
export interface ModuloCatalogoDto {
  codigo: string
  nombre: string
  esBase: boolean
  /** Siempre presente, **no se contrata** (`I-M2`). La card no se pinta. */
  esTransversal: boolean
  esSuscribible: boolean
  /** `'empresa' | 'persona' | 'ambos'` — string, no union: es dato de catálogo editable en DB. */
  quienContrata: string
  tieneSuperficiePublica: boolean
  /**
   * Aristas **DIRECTAS**, no el cierre transitivo (`D-GM-9`: el cierre lo camina el backend).
   * O sea que `marketplace` declara `['concesionaria']` y no `['concesionaria', 'flota']`.
   */
  dependeDe: string[]
}

export type EstadoFuncionalModulo = 'activa' | 'dada_de_baja'
export type EstadoComercialModulo = 'trial' | 'al_dia' | 'suspendida'

export interface SuscripcionDto {
  moduloCodigo: string
  nombre: string
  estadoFuncional: EstadoFuncionalModulo
  estadoComercial: EstadoComercialModulo
  /** Fin del trial, ISO. `null` = sin vencimiento (`I-S4` solo exige fecha para `trial`). */
  vigenteHasta: string | null
  /** `long` en el backend. Arranca en 1, +1 por transición. */
  version: number
  origen: string | null
}

export interface TransicionDto {
  id: string
  moduloCodigo: string
  /** CUÁL de los dos ejes se movió en esta transición. */
  eje: 'funcional' | 'comercial'
  /** `null` cuando es el nacimiento de la suscripción. */
  estadoAnterior: string | null
  estadoNuevo: string
  motivo: string | null
  version: number
  fechaCreacion: string
  creadoPorUsuarioId: string | null
}

/**
 * ⚠️ `encadenar: false` **siempre en el primer intento**. Con `true` se activan también las
 * dependencias faltantes, y el backend lo permite — pero activar en silencio módulos que el cliente
 * no pidió es exactamente lo que el contrato prohíbe. El flujo correcto es: mandar `false`, y si
 * vuelve 409 `dependencia_faltante`, pedir el opt-in explícito.
 */
export interface ContratarModuloRequest {
  encadenar: boolean
}

/** El motivo es **opcional** (P1). El backend acepta body ausente, `{}` o `{ motivo }`. */
export interface MotivoDeTransicionRequest {
  motivo?: string | null
}
