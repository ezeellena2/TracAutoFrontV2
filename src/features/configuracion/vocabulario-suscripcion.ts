import type {
  EstadoComercialModulo,
  EstadoFuncionalModulo,
  SuscripcionDto,
} from '@/services/contracts/modulos'

/**
 * Vocabulario de los DOS ejes de una suscripción de módulo.
 *
 * ══ DOS VOCABULARIOS SEPARADOS. NO COLAPSARLOS ═════════════════════════════════════════════════
 * Es tentador armar un solo `estado` de 5 valores y un solo badge. **Ese es exactamente el defecto
 * que esta pantalla existe para corregir**: la ficha original tenía un eje único, y de ahí salía
 * que "desactivar elimina permisos" — cierto para la baja, **falso y destructivo** para la
 * suspensión (`D-GM-1`).
 *
 * Los dos ejes son independientes (`I-S7`): una fila puede quedar `dada_de_baja` + `suspendida`, y
 * ninguna transición de un eje fuerza la del otro.
 *
 * ⚠️ Y esta pantalla es la **única** superficie del producto donde la diferencia existe: por
 * `D-GM-13`, un módulo suspendido **desaparece del claim** del JWT, así que el resto del sistema no
 * puede distinguirlo de uno nunca contratado.
 */

export type VarianteBadge = 'neutro' | 'exito' | 'advertencia' | 'peligro' | 'info' | 'acento'

export const ESTADOS_FUNCIONALES = [
  'activa',
  'dada_de_baja',
] as const satisfies readonly EstadoFuncionalModulo[]

export const ESTADOS_COMERCIALES = [
  'trial',
  'al_dia',
  'suspendida',
] as const satisfies readonly EstadoComercialModulo[]

const VARIANTE_FUNCIONAL: Record<EstadoFuncionalModulo, VarianteBadge> = {
  activa: 'exito',
  // NEUTRO, no peligro: dar de baja es un HECHO que el usuario decidió, no una alarma. Pintarlo
  // rojo trataría una acción deliberada como un problema. Precedente: `BadgeConexion`.
  dada_de_baja: 'neutro',
}

const VARIANTE_COMERCIAL: Record<EstadoComercialModulo, VarianteBadge> = {
  trial: 'advertencia',
  al_dia: 'exito',
  // PELIGRO, no gris: gris se lee como "no lo tenés", y suspendido es justo lo contrario — lo
  // tenés, lo estás pagando tarde, y no anda. Es la confusión que la pantalla existe para evitar.
  suspendida: 'peligro',
}

export function varianteDeEstadoFuncional(estado: EstadoFuncionalModulo): VarianteBadge {
  return VARIANTE_FUNCIONAL[estado]
}

export function varianteDeEstadoComercial(estado: EstadoComercialModulo): VarianteBadge {
  return VARIANTE_COMERCIAL[estado]
}

export function claveDeEstadoFuncional(estado: EstadoFuncionalModulo): string {
  return `configuracion.modulos.estadoFuncional.${estado}`
}

export function claveDeEstadoComercial(estado: EstadoComercialModulo): string {
  return `configuracion.modulos.estadoComercial.${estado}`
}

/** El `title` del badge comercial: es donde se explica que suspendido ≠ no contratado. */
export function claveDeAyudaDeEstadoComercial(estado: EstadoComercialModulo): string {
  return `configuracion.modulos.ayudaEstadoComercial.${estado}`
}

/**
 * La CONJUNCIÓN — el único derivado de los dos ejes, y es el que evalúa el gate del backend
 * (`I-S3`). Si esto y el server dijeran cosas distintas, la pantalla mentiría sobre el acceso.
 */
export function tieneAccesoHoy(
  suscripcion: Pick<SuscripcionDto, 'estadoFuncional' | 'estadoComercial'>
): boolean {
  return (
    suscripcion.estadoFuncional === 'activa' && suscripcion.estadoComercial !== 'suspendida'
  )
}

/**
 * El estado de **presentación** de una card. No existe en el backend: es una proyección de los dos
 * ejes más el caso "sin fila".
 *
 * ⚠️ `no_contratado` **no es un estado del modelo**: es la ausencia de suscripción. Por eso se
 * deriva de `undefined` y no de una columna.
 */
export type SituacionDeModulo =
  | 'no_contratado'
  | 'activo'
  | 'en_prueba'
  | 'suspendido'
  | 'dado_de_baja'

/**
 * El ORDEN DE LAS RAMAS ES LA DECISIÓN DE PRODUCTO, no una casualidad de implementación:
 *
 * 1. Sin fila ⇒ `no_contratado`.
 * 2. **El eje funcional gana**: si diste de baja el módulo, que además esté impago no le agrega
 *    nada al usuario — no lo tenés, y punto.
 * 3. `suspendida` antes que `trial`: un trial suspendido está suspendido. Lo que le importa al
 *    usuario es que no anda.
 * 4. `trial` ⇒ `en_prueba` (anda, y tiene fecha).
 * 5. Resto ⇒ `activo`.
 */
export function situacionDeModulo(suscripcion: SuscripcionDto | undefined): SituacionDeModulo {
  if (!suscripcion) return 'no_contratado'
  if (suscripcion.estadoFuncional === 'dada_de_baja') return 'dado_de_baja'
  if (suscripcion.estadoComercial === 'suspendida') return 'suspendido'
  if (suscripcion.estadoComercial === 'trial') return 'en_prueba'
  return 'activo'
}

/** La línea de texto que explica el acceso, debajo de los badges. */
export function claveDeLineaDeAcceso(situacion: SituacionDeModulo): string {
  const claves: Record<SituacionDeModulo, string> = {
    no_contratado: 'configuracion.modulos.acceso.noContratado',
    activo: 'configuracion.modulos.acceso.conAcceso',
    en_prueba: 'configuracion.modulos.acceso.enPrueba',
    suspendido: 'configuracion.modulos.acceso.sinAccesoPorSuspension',
    dado_de_baja: 'configuracion.modulos.acceso.dadoDeBaja',
  }

  return claves[situacion]
}

/**
 * Qué acciones ofrece cada situación.
 *
 * ⚠️ **`suspendido` NO ofrece `contratar`.** El backend responde **200 sin hacer nada**: un módulo
 * suspendido ya tiene `estadoFuncional: 'activa'`, así que contratar es un no-op idempotente. Un
 * botón "Reactivar" cableado ahí afirmaría un éxito que no ocurrió, y el usuario seguiría sin
 * acceso sin entender por qué. Para eso está `regularizar`.
 */
export type AccionDeModulo = 'contratar' | 'suspender' | 'regularizar' | 'baja'

export function accionesDe(situacion: SituacionDeModulo): readonly AccionDeModulo[] {
  const acciones: Record<SituacionDeModulo, readonly AccionDeModulo[]> = {
    no_contratado: ['contratar'],
    activo: ['suspender', 'baja'],
    en_prueba: ['suspender', 'baja'],
    suspendido: ['regularizar'],
    dado_de_baja: ['contratar'],
  }

  return acciones[situacion]
}

/**
 * Lo que la card ofrece de verdad: las acciones de la situación, **menos la baja si el módulo es
 * base**.
 *
 * ── POR QUÉ ES UNA FUNCIÓN APARTE Y NO UN PARÁMETRO MÁS DE `accionesDe` ───────────────────────
 * `accionesDe` deriva de los dos EJES de la suscripción; `esBase` es un atributo del **catálogo**,
 * que es otra fuente. Mezclarlos le daría al vocabulario de ejes una segunda entrada y su test
 * dejaría de poder enumerar los casos por situación. Acá la composición es explícita y se testea sola.
 *
 * ── ESTO NO ES LA ÚNICA DEFENSA, Y ESA ES LA DIFERENCIA ──────────────────────────────────────
 * El backend rechaza la baja de un módulo base con **409 `modulos.catalogo.es_base`** (`I-M4`), así
 * que ocultar el botón es **coherencia de UI, no el control**. Ofrecerlo igual sería mostrar una
 * acción que siempre falla; no ofrecerlo y que el backend no la frenara sería peor — cualquiera con
 * `curl` borraría la configuración de roles del cliente.
 *
 * ⚠️ **Cuidado con "simplificarlo" a `codigo !== 'flota'`.** El gate es el atributo `esBase` del
 * catálogo, no el código: hoy Flota es el único base y el PO dijo que piensa que va a seguir
 * siéndolo, pero eso es contexto. Un código de catálogo hardcodeado en una condición es el
 * antipatrón que el `slice-05` acaba de terminar de sacar del backend.
 *
 * **Por qué importa tanto para UNA acción**: la baja es la única transición que purga `RolPermiso`, y
 * ese borrado es **físico**. Sobre el módulo base de una organización recién registrada, borraba su
 * configuración de roles entera — y al recontratar solo vuelven las plantillas, no los roles propios.
 *
 * Historia: `D-GM-14`, decidido por el PO el 2026-08-23, cierra `GM-B16`. Hasta ese día el invariante
 * vivía solo en `01-spec/` y en `D-GM-2`; `00-contrato/` no lo declaraba y `errores.md` no tenía
 * `code`, así que el guard no se podía escribir sin inventarle el error.
 */
export function accionesVisibles(
  situacion: SituacionDeModulo,
  esBase: boolean
): readonly AccionDeModulo[] {
  const acciones = accionesDe(situacion)
  return esBase ? acciones.filter((accion) => accion !== 'baja') : acciones
}
