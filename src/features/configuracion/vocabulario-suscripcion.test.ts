import { describe, expect, it } from 'vitest'
import en from '@/shared/i18n/locales/en/common.json'
import esAR from '@/shared/i18n/locales/es-AR/common.json'
import type { EstadoComercialModulo, EstadoFuncionalModulo, SuscripcionDto } from '@/services/contracts/modulos'
import {
  ESTADOS_COMERCIALES,
  ESTADOS_FUNCIONALES,
  accionesDe,
  accionesVisibles,
  claveDeAyudaDeEstadoComercial,
  claveDeEstadoComercial,
  claveDeEstadoFuncional,
  claveDeLineaDeAcceso,
  situacionDeModulo,
  tieneAccesoHoy,
  varianteDeEstadoComercial,
  varianteDeEstadoFuncional,
} from './vocabulario-suscripcion'

/**
 * ── QUÉ MUTACIÓN MATA CADA TEST ───────────────────────────────────────────────────────────────
 *
 * 1. **Exhaustividad** — `as const satisfies` verifica que cada elemento sea del tipo, **no que
 *    estén todos**: borrar `'suspendida'` del array compila en verde. El `toEqual` con el literal
 *    escrito a mano es lo único que lo caza.
 *
 * 2. **No mezclar ejes** — es la red exacta contra el colapso que hizo la ficha original, del que
 *    salió "desactivar elimina permisos". Mata mover `'suspendida'` al eje funcional.
 *
 * 3. **`tieneAccesoHoy`** — mata cambiar el `&&` por `||`, y mata invertir el `!==`. Las dos
 *    mutaciones dan acceso a quien no lo tiene, que es el modo de falla caro.
 *
 * 4. **El orden de ramas de `situacionDeModulo`** — mata reordenarlas. No es cosmético: si
 *    `suspendida` se evaluara antes que `dada_de_baja`, un módulo dado de baja e impago se
 *    mostraría como "suspendido" y ofrecería "Regularizar" sobre algo que el usuario ya canceló.
 *
 * 5. **`suspendido` no ofrece `contratar`** — mata agregarlo. El backend responde 200 sin hacer
 *    nada: sería un botón que afirma un éxito que no ocurrió.
 *
 * 6. **Toda clave resuelve en LOS DOS idiomas** — `verificar-i18n.mjs` solo compara paridad es↔en,
 *    así que una clave ausente **en los dos a la vez** pasa lint, typecheck y build, y `t()` pinta
 *    la clave cruda en pantalla. Este es el único mecanismo que lo detecta.
 */

type Diccionario = Record<string, unknown>

function resolver(diccionario: Diccionario, clave: string): unknown {
  return clave
    .split('.')
    .reduce<unknown>(
      (nodo, tramo) =>
        typeof nodo === 'object' && nodo !== null
          ? (nodo as Diccionario)[tramo]
          : undefined,
      diccionario
    )
}

function esperarTextoEnLosDosIdiomas(clave: string) {
  for (const [nombre, diccionario] of [
    ['es-AR', esAR as Diccionario],
    ['en', en as Diccionario],
  ] as const) {
    const valor = resolver(diccionario, clave)

    expect(typeof valor, `'${clave}' no resuelve en ${nombre}`).toBe('string')
    expect(valor as string, `'${clave}' esta vacia en ${nombre}`).not.toBe('')
  }
}

function suscripcion(
  estadoFuncional: EstadoFuncionalModulo,
  estadoComercial: EstadoComercialModulo
): SuscripcionDto {
  return {
    moduloCodigo: 'flota',
    nombre: 'Flota',
    estadoFuncional,
    estadoComercial,
    vigenteHasta: null,
    version: 1,
    origen: 'alta',
  }
}

describe('los dos ejes son vocabularios SEPARADOS', () => {
  it('el eje funcional tiene exactamente 2 valores', () => {
    expect([...ESTADOS_FUNCIONALES]).toEqual(['activa', 'dada_de_baja'])
  })

  it('el eje comercial tiene exactamente 3 valores', () => {
    expect([...ESTADOS_COMERCIALES]).toEqual(['trial', 'al_dia', 'suspendida'])
  })

  it('NUNCA se cruzan: ningun valor de un eje esta en el otro', () => {
    // El colapso de ejes es el defecto que esta pantalla existe para corregir.
    for (const comercial of ESTADOS_COMERCIALES) {
      expect(ESTADOS_FUNCIONALES as readonly string[]).not.toContain(comercial)
    }
    for (const funcional of ESTADOS_FUNCIONALES) {
      expect(ESTADOS_COMERCIALES as readonly string[]).not.toContain(funcional)
    }
  })
})

describe('variantes de badge', () => {
  it('mapea cada estado funcional', () => {
    expect(varianteDeEstadoFuncional('activa')).toBe('exito')
    // Neutro y no peligro: la baja es un hecho decidido, no una alarma.
    expect(varianteDeEstadoFuncional('dada_de_baja')).toBe('neutro')
  })

  it('mapea cada estado comercial, y suspendida NO es gris', () => {
    expect(varianteDeEstadoComercial('trial')).toBe('advertencia')
    expect(varianteDeEstadoComercial('al_dia')).toBe('exito')
    // Gris se lee como "no lo tenes". Suspendido es lo contrario: lo tenes y no anda.
    expect(varianteDeEstadoComercial('suspendida')).toBe('peligro')
    expect(varianteDeEstadoComercial('suspendida')).not.toBe('neutro')
  })
})

describe('tieneAccesoHoy — la conjuncion de I-S3', () => {
  it.each([
    ['activa', 'al_dia', true],
    ['activa', 'trial', true],
    ['activa', 'suspendida', false],
    ['dada_de_baja', 'al_dia', false],
    ['dada_de_baja', 'trial', false],
    ['dada_de_baja', 'suspendida', false],
  ] as const)('%s + %s => %s', (funcional, comercial, esperado) => {
    expect(tieneAccesoHoy(suscripcion(funcional, comercial))).toBe(esperado)
  })
})

describe('situacionDeModulo', () => {
  it('sin fila es no_contratado', () => {
    expect(situacionDeModulo(undefined)).toBe('no_contratado')
  })

  it('el eje FUNCIONAL gana sobre el comercial', () => {
    // Si lo diste de baja, que ademas este impago no le agrega nada al usuario. Mata reordenar
    // las ramas: con `suspendida` primero, esto daria 'suspendido' y ofreceria "Regularizar"
    // sobre un modulo que el usuario ya cancelo.
    expect(situacionDeModulo(suscripcion('dada_de_baja', 'suspendida'))).toBe('dado_de_baja')
    expect(situacionDeModulo(suscripcion('dada_de_baja', 'trial'))).toBe('dado_de_baja')
  })

  it('suspendida gana sobre trial: un trial suspendido esta suspendido', () => {
    expect(situacionDeModulo(suscripcion('activa', 'suspendida'))).toBe('suspendido')
  })

  it('mapea el resto', () => {
    expect(situacionDeModulo(suscripcion('activa', 'trial'))).toBe('en_prueba')
    expect(situacionDeModulo(suscripcion('activa', 'al_dia'))).toBe('activo')
  })
})

describe('acciones por situacion', () => {
  it('un modulo SUSPENDIDO no ofrece contratar', () => {
    // El backend responde 200 sin hacer nada (contratar mueve el eje funcional, que ya esta en
    // 'activa'). Un boton ahi afirma un exito que no ocurrio.
    expect(accionesDe('suspendido')).not.toContain('contratar')
    expect(accionesDe('suspendido')).toEqual(['regularizar'])
  })

  it('un modulo con acceso ofrece suspender y baja, nunca regularizar', () => {
    for (const situacion of ['activo', 'en_prueba'] as const) {
      expect(accionesDe(situacion)).toEqual(['suspender', 'baja'])
    }
  })

  it('sin contratar y dado de baja ofrecen contratar', () => {
    expect(accionesDe('no_contratado')).toEqual(['contratar'])
    expect(accionesDe('dado_de_baja')).toEqual(['contratar'])
  })
})

describe('un modulo BASE nunca ofrece dar de baja', () => {
  // I-M4 / D-GM-14: el backend rechaza la baja de un modulo base con 409
  // `modulos.catalogo.es_base`. Esconder el boton es coherencia de UI — ofrecerlo mostraria una
  // accion que SIEMPRE falla. La baja es la unica transicion que purga `RolPermiso`, y ese borrado
  // es fisico.
  // Mata: borrar el filtro de `accionesVisibles`, o invertir la condicion de `esBase`.
  it.each(['activo', 'en_prueba'] as const)(
    'situacion %s: con esBase pierde la baja, sin esBase la conserva',
    (situacion) => {
      expect(accionesVisibles(situacion, true)).toEqual(['suspender'])
      expect(accionesVisibles(situacion, true)).not.toContain('baja')
      expect(accionesVisibles(situacion, false)).toEqual(['suspender', 'baja'])
    }
  )

  it('no toca ninguna otra accion: base y no-base coinciden donde no hay baja', () => {
    // Si `accionesVisibles` filtrara de mas, esto lo caza. Un modulo base suspendido tiene que
    // seguir pudiendo regularizarse — es justo el caso que la pantalla existe para resolver.
    for (const situacion of ['no_contratado', 'suspendido', 'dado_de_baja'] as const) {
      expect(accionesVisibles(situacion, true)).toEqual(accionesDe(situacion))
    }
    expect(accionesVisibles('suspendido', true)).toEqual(['regularizar'])
  })
})

describe('toda clave de i18n resuelve en los DOS idiomas', () => {
  it('estados funcionales', () => {
    for (const estado of ESTADOS_FUNCIONALES) esperarTextoEnLosDosIdiomas(claveDeEstadoFuncional(estado))
  })

  it('estados comerciales y su ayuda', () => {
    for (const estado of ESTADOS_COMERCIALES) {
      esperarTextoEnLosDosIdiomas(claveDeEstadoComercial(estado))
      esperarTextoEnLosDosIdiomas(claveDeAyudaDeEstadoComercial(estado))
    }
  })

  it('lineas de acceso de las 5 situaciones', () => {
    for (const situacion of [
      'no_contratado',
      'activo',
      'en_prueba',
      'suspendido',
      'dado_de_baja',
    ] as const) {
      esperarTextoEnLosDosIdiomas(claveDeLineaDeAcceso(situacion))
    }
  })

  it('los 8 codes de error del backend', () => {
    // `message_key` = "errors." + code. Si falta, el usuario ve la clave cruda.
    for (const code of [
      'modulos.catalogo.no_encontrado',
      'modulos.catalogo.no_suscribible',
      // I-M4 / D-GM-14, agregado el 2026-08-23. Lo emite `/baja` sobre un modulo base.
      'modulos.catalogo.es_base',
      'modulos.suscripcion.no_encontrada',
      'modulos.suscripcion.transicion_invalida',
      'modulos.suscripcion.dependencia_faltante',
      'modulos.suscripcion.tiene_dependientes',
      'modulos.dependencias.ciclo_detectado',
    ]) {
      esperarTextoEnLosDosIdiomas(`errors.${code}`)
    }
  })
})
