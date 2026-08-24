/* ============================================================================
 * PAGINACIÓN — el envelope compartido de `Platform.Pagination`
 * ============================================================================
 *
 * Extraído de `contracts/flota.ts` el 2026-08-23, al aparecer el **segundo** consumidor
 * (gestión de módulos). Es la regla del repo: una pieza entra a compartido cuando **dos** la
 * necesitan, no antes — y cuando aparece el segundo, se extrae *antes* de escribir la segunda copia.
 *
 * `flota.ts` re-exporta estos tipos, así que ningún import existente se rompe.
 * ========================================================================== */

export type SortDirection = 'Asc' | 'Desc'

export interface PageQuery {
  page?: number // default 1; < 1 se normaliza a 1
  pageSize?: number // default 20; < 1 -> 20, > 100 -> 100
}

export interface SortedPageQuery<TSortBy extends string> extends PageQuery {
  sortBy?: TSortBy // enum PROPIO por endpoint
  sortDirection?: SortDirection // default 'Desc'
}

export interface PaginationMetadata {
  page: number
  pageSize: number
  itemCount: number
  totalItems: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  // DRIFT: `dtos.ts` los declara `number`. `PaginationMetadata` de Platform.Pagination los emite
  // `long?` y son null cuando la pagina no trae items.
  fromItem: number | null
  toItem: number | null
}

export interface PagedResult<T> {
  items: T[]
  pagination: PaginationMetadata
}
