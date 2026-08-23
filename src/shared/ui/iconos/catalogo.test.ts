import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ICONOS, iconoDe, type NombreDeIcono } from './catalogo'

/**
 * Red del catálogo de íconos.
 *
 * ── QUÉ SE PROTEGE ACÁ, Y QUÉ NO ──────────────────────────────────────────────────────────────
 * El compilador ya hace la mitad del trabajo: `NombreDeIcono` sale de `keyof typeof ICONOS`, así
 * que un concepto inexistente **escrito a mano no compila**. Lo que el compilador NO ve es la
 * clave que llega de un dato en runtime, y ahí el default silencioso sería lo peor: un glifo que
 * no significa nada, mostrado con total confianza.
 *
 * Tampoco se cruza el catálogo contra las tablas del documento normativo: ese archivo vive en el
 * **otro repo** (`../TracAutoV2/`), y el CI de este repo clona uno solo. Un test que lo leyera
 * pasaría en la máquina del desarrollador y explotaría —o peor, se saltearía— en CI. La deriva
 * catálogo↔doc queda como verificación humana, declarada.
 */

const CATALOGO = new URL('./catalogo.ts', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const conceptos = Object.keys(ICONOS) as NombreDeIcono[]

describe('el catálogo de íconos', () => {
  it('tiene las cuatro tablas portadas, no un puñado suelto', () => {
    expect(conceptos.length).toBeGreaterThanOrEqual(100)
  })

  it('todo concepto resuelve a un componente de verdad', () => {
    const rotos = conceptos.filter((c) => {
      const tipo = typeof ICONOS[c]
      return tipo !== 'function' && tipo !== 'object'
    })
    expect(rotos).toEqual([])
  })

  it('los 14 módulos de §7 están, con el prefijo que los agrupa', () => {
    expect(conceptos.filter((c) => c.startsWith('modulo-')).length).toBeGreaterThanOrEqual(13)
  })
})

describe('iconoDe cierra la puerta en runtime', () => {
  it('devuelve el componente de un concepto que existe', () => {
    expect(iconoDe('vehiculo')).toBe(ICONOS.vehiculo)
  })

  it('un concepto INEXISTENTE tira error, no devuelve un default en silencio', () => {
    // El cast es el punto del test: simula la clave que llega de un dato, que es el único caso
    // que el compilador no puede atajar.
    expect(() => iconoDe('vehiculo-volador' as NombreDeIcono)).toThrow(/vehiculo-volador/)
  })

  it('el error dice DÓNDE está el catálogo: un error sin salida obliga a adivinar', () => {
    expect(() => iconoDe('no-existe' as NombreDeIcono)).toThrow(/12-estandar-de-iconos/)
  })
})

describe('R-IC-3 · nombre canónico, nunca el alias', () => {
  // Los 8 alias existen en el paquete y son importables: por eso hace falta mirarlos.
  const ALIAS_PROHIBIDOS = [
    'AlertTriangle',
    'CheckCircle',
    'CircleCheckBig',
    'LinkIcon',
    'MoreVertical',
    'MoreHorizontal',
    'Loader2',
    'Filter',
  ]

  it('el catálogo no importa ningún alias', () => {
    const fuente = readFileSync(CATALOGO, 'utf8')
    const bloqueDeImport = fuente.slice(0, fuente.indexOf("} from 'lucide-react'"))
    const importados = ALIAS_PROHIBIDOS.filter((alias) =>
      new RegExp(`^\\s*${alias},`, 'm').test(bloqueDeImport),
    )
    expect(importados).toEqual([])
  })
})

describe('R-IC-9 · el ícono de un módulo ≠ el de su entidad principal', () => {
  it('Flota no usa el mismo glifo para el módulo y para el vehículo', () => {
    expect(ICONOS['modulo-flota']).not.toBe(ICONOS.vehiculo)
  })

  it('Logística no se confunde con Flota: los dos emojis del mockup mapeaban a `truck`', () => {
    expect(ICONOS['modulo-logistica']).not.toBe(ICONOS['modulo-flota'])
  })

  it('Operaciones y Configuración se separan: en el mockup los dos son ⚙️', () => {
    expect(ICONOS['modulo-operaciones']).not.toBe(ICONOS['modulo-configuracion'])
  })

  it('la orden de trabajo no comparte glifo con el módulo de gestoría', () => {
    expect(ICONOS['orden-trabajo']).not.toBe(ICONOS['modulo-gestoria'])
  })

  it('licencia y seguridad se separan: hoy marcan dos acciones en el MISMO menú', () => {
    expect(ICONOS.licencia).not.toBe(ICONOS.seguridad)
  })
})
