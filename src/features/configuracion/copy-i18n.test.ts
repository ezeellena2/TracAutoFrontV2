import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import en from '@/shared/i18n/locales/en/common.json'
import esAR from '@/shared/i18n/locales/es-AR/common.json'

/**
 * ── EL HUECO QUE ESTE TEST TAPA ────────────────────────────────────────────────────────────────
 * `scripts/verificar-i18n.mjs` compara **paridad** entre `es-AR` y `en`. Una clave que falta en los
 * **dos a la vez** le pasa por al lado, y también al typecheck, al lint y al build: `t()` devuelve la
 * clave cruda y el usuario ve `configuracion.modulos.baja.confirmar` impreso en un botón.
 *
 * `vocabulario-suscripcion.test.ts` cubre las claves que **construye** el vocabulario. Éste barre las
 * que están **escritas literalmente en el JSX**, que son la mayoría y las que nadie chequea.
 *
 * ── QUÉ MUTACIÓN MATA ─────────────────────────────────────────────────────────────────────────
 * Borrar cualquier clave de `configuracion.modulos` de los dos JSON, o escribir mal una en un
 * componente. Las dos cosas pasan hoy sin que nada se ponga rojo.
 *
 * ── LÍMITE HONESTO ────────────────────────────────────────────────────────────────────────────
 * Solo ve claves **literales**. Una clave armada en runtime (`` `...${x}` ``) es invisible acá — por
 * eso el patrón `vocabulario-*.ts` **con su test** existe: es el que cubre justamente esas.
 */

const RAIZ = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

/** `t('configuracion.modulos.…')` con comilla simple o doble, sin interpolación en la clave. */
const CLAVE_LITERAL = /\bt\(\s*['"](configuracion\.modulos\.[a-zA-Z0-9_.]+)['"]/g

function archivosDeCodigo(directorio: string): string[] {
  return readdirSync(directorio).flatMap((nombre) => {
    const ruta = join(directorio, nombre)
    if (statSync(ruta).isDirectory()) return archivosDeCodigo(ruta)
    if (!/\.tsx?$/.test(nombre) || nombre.endsWith('.test.ts')) return []
    return [ruta]
  })
}

function clavesUsadas(): Map<string, string[]> {
  const porClave = new Map<string, string[]>()

  for (const ruta of archivosDeCodigo(RAIZ)) {
    const contenido = readFileSync(ruta, 'utf8')
    for (const [, clave] of contenido.matchAll(CLAVE_LITERAL)) {
      porClave.set(clave, [...(porClave.get(clave) ?? []), ruta])
    }
  }

  return porClave
}

type Diccionario = Record<string, unknown>

function resolver(diccionario: Diccionario, clave: string): unknown {
  return clave
    .split('.')
    .reduce<unknown>(
      (nodo, tramo) =>
        typeof nodo === 'object' && nodo !== null ? (nodo as Diccionario)[tramo] : undefined,
      diccionario
    )
}

describe('toda clave literal de la pantalla de módulos resuelve en los DOS idiomas', () => {
  const claves = clavesUsadas()

  it('el barrido encuentra claves — si da 0, el regex dejó de matchear y este test no prueba nada', () => {
    // Control positivo. Sin él, romper el regex deja la suite en verde afirmando que todo resuelve.
    expect(claves.size).toBeGreaterThan(20)
  })

  it.each([...claves.keys()].sort())('%s', (clave) => {
    for (const [idioma, diccionario] of [
      ['es-AR', esAR as Diccionario],
      ['en', en as Diccionario],
    ] as const) {
      const valor = resolver(diccionario, clave)
      const donde = claves.get(clave)?.join(', ') ?? ''

      expect(typeof valor, `'${clave}' no resuelve en ${idioma}. La usa: ${donde}`).toBe('string')
      expect(valor as string, `'${clave}' está vacía en ${idioma}`).not.toBe('')
    }
  })
})
