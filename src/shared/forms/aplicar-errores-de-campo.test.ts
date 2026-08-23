import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { aplicarErroresDeCampo } from './aplicar-errores-de-campo'

/**
 * Red de `aplicarErroresDeCampo`, la función que F-02 encontró repetida en 16 archivos.
 *
 * ⚠️ **Se testea con un formulario FALSO, y no es una comodidad.** El proyecto `unit` de Vitest
 * corre con `environment: 'node'` y `@testing-library/react` no está instalado (decisión declarada:
 * un tercer paradigma de test no entra por la ventana). Pero además **no hace falta**: esta función
 * toca del formulario exactamente un método, `setError`. Un doble con un espía prueba el contrato
 * completo; montar React probaría react-hook-form, que no es lo que este archivo escribió.
 */

/**
 * El error tal como llega del backend, **sin importar axios**: `axios.isAxiosError` solo chequea
 * `isAxiosError === true` sobre el objeto, y la regla **F10** del repo prohíbe importar el paquete
 * de red fuera de `services/`. Mismo criterio y misma forma que
 * `modules/flota/components/conductores/errores-alta-conductor.test.ts`, que ya resolvió esto.
 */
function respuestaDeError(status: number, data: Record<string, unknown>) {
  return { isAxiosError: true, response: { status, data } }
}

function errorDeValidacion(validationErrors: Record<string, unknown[]>) {
  return respuestaDeError(400, {
    status: 400,
    title: 'Solicitud invalida',
    code: 'validation.failed',
    message_key: 'errors.validation.failed',
    validation_errors: validationErrors,
  })
}

/** Traduce devolviendo la clave entre corchetes: hace visible QUÉ clave se resolvió. */
const t = (clave: string) => `[${clave}]`

function formularioFalso() {
  const setError = vi.fn()
  return { form: { setError } as unknown as UseFormReturn<FieldValues>, setError }
}

describe('aplicarErroresDeCampo', () => {
  it('un error con DOS campos pone error en LOS DOS, con la clave traducida', () => {
    const { form, setError } = formularioFalso()

    const aplicados = aplicarErroresDeCampo(
      form,
      errorDeValidacion({
        Email: [{ code: 'validation.email.required', message_key: 'validation.email.required' }],
        Password: [{ code: 'validation.password.weak', message_key: 'validation.password.weak' }],
      }),
      t,
    )

    expect(aplicados).toBe(2)
    expect(setError).toHaveBeenCalledTimes(2)
    expect(setError).toHaveBeenCalledWith('email', { message: '[validation.email.required]' })
    expect(setError).toHaveBeenCalledWith('password', { message: '[validation.password.weak]' })
  })

  it('con `tipo`, marca cada error con ese type — es lo que los modales de Flota consultan después', () => {
    const { form, setError } = formularioFalso()

    aplicarErroresDeCampo(
      form,
      errorDeValidacion({
        Patente: [{ code: 'validation.patente.duplicada', message_key: 'validation.patente.duplicada' }],
      }),
      t,
      { tipo: 'servidor' },
    )

    expect(setError).toHaveBeenCalledWith('patente', {
      type: 'servidor',
      message: '[validation.patente.duplicada]',
    })
  })

  it('sin `tipo`, NO inventa uno: las páginas de access/ no distinguen origen', () => {
    const { form, setError } = formularioFalso()

    aplicarErroresDeCampo(
      form,
      errorDeValidacion({ Email: [{ code: 'x', message_key: 'validation.email.required' }] }),
      t,
    )

    expect(setError).toHaveBeenCalledWith('email', { message: '[validation.email.required]' })
    expect(setError.mock.calls[0]?.[1]).not.toHaveProperty('type')
  })

  it('un error de negocio SIN errores por campo no toca ningún campo', () => {
    const { form, setError } = formularioFalso()

    const conflicto = respuestaDeError(409, {
      status: 409,
      title: 'Conflicto',
      code: 'auth.email_duplicado',
    })

    expect(aplicarErroresDeCampo(form, conflicto, t)).toBe(0)
    expect(setError).not.toHaveBeenCalled()
  })

  it('un error de red tampoco: si no hubo respuesta, no hay campo culpable', () => {
    const { form, setError } = formularioFalso()

    expect(aplicarErroresDeCampo(form, new Error('offline'), t)).toBe(0)
    expect(setError).not.toHaveBeenCalled()
  })
})
