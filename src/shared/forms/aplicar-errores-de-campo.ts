import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  parseApiError,
  resolveApiFieldErrors,
  type TranslationFn,
} from '@/shared/errors/parse-api-error'

/**
 * Lleva los errores de validación del backend a los campos del formulario.
 *
 * ── POR QUÉ ESTO ES UNA FUNCIÓN Y NO UN `<FormularioORBI>` ────────────────────────────────────
 * El relevamiento de F-02 buscaba un "molde de formulario" y encontró que **no hay molde: hay una
 * función**. Los 16 archivos que hoy hacen esto a mano comparten exactamente un bloque —parsear el
 * error, resolver los mensajes por campo, llamar `setError` por cada uno— y **no comparten el ciclo
 * de vida**: las páginas de `access/` navegan al terminar, los modales de Flota hacen `reset()` y
 * `onCerrar()`. Un componente envolvente tendría que modelar esa diferencia, y el único pedazo
 * realmente común es este.
 *
 * Extraer lo común sin inventar lo que no lo es: el `onError` sigue siendo del llamador, que es
 * donde vive la decisión de qué hacer después.
 *
 * ── POR QUÉ RECIBE EL ERROR CRUDO ─────────────────────────────────────────────────────────────
 * `parseApiError` se llama acá adentro. Un llamador que además necesita el mensaje general lo
 * parsea por su cuenta y **parsea dos veces**: es una lectura de objeto plano, no una request, y el
 * costo de que la firma sea `unknown` —que el llamador no tenga que saber que existe un paso
 * intermedio— vale más que ese trabajo repetido.
 *
 * ── EL PARÁMETRO `tipo` NO ES DECORACIÓN ──────────────────────────────────────────────────────
 * Los modales de Flota marcan sus errores de servidor con `type: 'servidor'` y lo consultan después
 * (`error.type === TIPO_ERROR_SERVIDOR`) para distinguir *"el backend rechazó este campo"* de
 * *"Zod no validó"* — el primero se limpia al reintentar, el segundo no. Las páginas de `access/`
 * no hacen esa distinción. Por eso el tipo es opcional: forzarlo cambiaría el comportamiento de
 * quien no lo usa, y omitirlo rompería a quien sí.
 *
 * @returns la cantidad de campos a los que se les puso error. `0` significa que el backend no mandó
 *   errores por campo y que el mensaje va entero al banner general.
 */
export function aplicarErroresDeCampo<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown,
  t: TranslationFn,
  opciones?: { tipo?: string },
): number {
  const errores = resolveApiFieldErrors(parseApiError(error), t)
  let aplicados = 0

  for (const [campo, mensaje] of Object.entries(errores)) {
    form.setError(campo as Path<T>, {
      ...(opciones?.tipo === undefined ? {} : { type: opciones.tipo }),
      message: mensaje,
    })
    aplicados += 1
  }

  return aplicados
}
