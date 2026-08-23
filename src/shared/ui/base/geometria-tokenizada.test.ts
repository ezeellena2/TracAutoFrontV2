import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guardián de la geometría tokenizada de `shared/ui/base/`.
 *
 * ── QUÉ PROBLEMA EVITA ────────────────────────────────────────────────────────────────────────
 * Una clase como `rounded-` con un `min()` alrededor del token de radio **lee el token y le pone un
 * techo**. Es el peor modo de falla del eje de apariencia porque *parece* tokenizado: pasa el lint
 * de color, pasa el verificador de tokens, se lee bien en el diff — y una estética que suba
 * `--s-radio-md` deja esos controles clavados en el techo, sin error y sin aviso
 * (`11-catalogo-de-esteticas.md` §4).
 *
 * ── POR QUÉ ES UN TEST Y NO SOLO UNA REVISIÓN ─────────────────────────────────────────────────
 * Estos archivos son **copias del CLI de shadcn**. `npx shadcn@latest add button --overwrite`
 * reescribe el archivo entero y **vuelve a traer el patrón**: el encabezado de desvío que cada
 * archivo lleva sirve para que ese diff se lea, pero no impide que alguien lo acepte de apuro. Un
 * test se pone rojo solo.
 *
 * ── LO QUE ESTE TEST NO DICE ──────────────────────────────────────────────────────────────────
 * No verifica que la geometría sea *linda* ni que sea *correcta*: verifica que **el token no esté
 * capeado**. Las medidas de anatomía —el `calc()` que compensa un borde de 1px, el ancho máximo de
 * un modal, la posición de un subrayado— quedan afuera a propósito: una estética que las cambiara
 * estaría reestructurando el componente, no re-pintándolo.
 */

const CARPETA = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

function archivosDeBase(): string[] {
  return readdirSync(CARPETA).filter((f) => f.endsWith('.tsx'))
}

/** El código, sin los comentarios de bloque: el encabezado de desvío habla del patrón viejo. */
function codigoSinComentarios(contenido: string): string {
  const lineas: string[] = []
  let dentroDeBloque = false

  for (const linea of contenido.split('\n')) {
    const limpia = linea.trim()
    if (dentroDeBloque) {
      if (limpia.includes('*/')) dentroDeBloque = false
      continue
    }
    if (limpia.startsWith('/*')) {
      if (!limpia.includes('*/')) dentroDeBloque = true
      continue
    }
    if (limpia.startsWith('//')) continue
    lineas.push(linea)
  }

  return lineas.join('\n')
}

describe('la geometría de shared/ui/base/ no capea sus tokens', () => {
  it('hay archivos que revisar (si esto falla, el que está roto es el test)', () => {
    expect(archivosDeBase().length).toBeGreaterThan(15)
  })

  it('ninguna clase envuelve un token de radio en un min() con techo', () => {
    // El patrón exacto que F-04a sacó de `button.tsx` (×4) y `select.tsx` (×1).
    const capeado = /rounded-\[\s*min\(\s*var\(--radius-/

    const culpables = archivosDeBase().filter((archivo) =>
      capeado.test(codigoSinComentarios(readFileSync(join(CARPETA, archivo), 'utf8'))),
    )

    expect(culpables).toEqual([])
  })

  it('ningún token de la escala aparece capeado por un min(), sea cual sea la propiedad', () => {
    // Más ancho que el anterior: `min(var(--s-*))` o `min(var(--radius-*))` en cualquier clase.
    // Un techo sobre CUALQUIER token semántico rompe la misma promesa.
    const capeadoAncho = /min\(\s*var\(--(?:s-|radius-|text-|spacing)/

    const culpables = archivosDeBase().filter((archivo) =>
      capeadoAncho.test(codigoSinComentarios(readFileSync(join(CARPETA, archivo), 'utf8'))),
    )

    expect(culpables).toEqual([])
  })
})
