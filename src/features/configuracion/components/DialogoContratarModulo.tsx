import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/Modal'
import { Boton } from '@/shared/ui/Boton'
import { Aviso } from '@/shared/ui/Aviso'
import { Checkbox } from '@/shared/ui/base/checkbox'
import { parseApiError, resolveApiErrorMessage } from '@/shared/errors/parse-api-error'
import type { ModuloCatalogoDto } from '@/services/contracts/modulos'
import { useContratarModulo } from '../hooks/useContratarModulo'

/**
 * Contratar en **dos pasos**, y el segundo no es un detalle de implementación: es la regla.
 *
 * 1. Primer intento **siempre** con `encadenar: false`.
 * 2. Si vuelve 409 `modulos.suscripcion.dependencia_faltante`, se muestran los módulos que faltan
 *    —salen de `args.faltantes`, no se adivinan del catálogo— y se pide un **opt-in explícito**.
 * 3. Recién con ese check tildado se reintenta con `true`.
 *
 * ⚠️ **Nunca mandar `true` de entrada.** El backend lo acepta, y por eso hay que no hacerlo: activar
 * en silencio módulos que el cliente no pidió es exactamente lo que el contrato prohíbe. Un cliente
 * que quiso Marketplace y termina con Concesionaria activa no cometió un error de UI: le activaron
 * algo sin preguntarle.
 *
 * El error va **inline dentro del modal**, no en un toast: es un error de escritura pegado a la
 * acción, y encima es el que habilita el paso 2. Un toast de 4 s se lo lleva puesto.
 *
 * ⚠️ **`Aviso` hoy tiene una sola variante (peligro) y no acepta `children`** — es
 * `PENDIENTE (DA-FE-35)`, ya registrada. Por eso el opt-in se dibuja como un control **hermano** del
 * aviso en vez de adentro: meterle un `tono="advertencia"` o un slot de contenido sería cambiar una
 * primitiva compartida por 31 archivos desde una pantalla, que es justo lo que la ley 3 prohíbe.
 */
export function DialogoContratarModulo({
  modulo,
  abierto,
  onCerrar,
}: {
  modulo: ModuloCatalogoDto
  abierto: boolean
  onCerrar: () => void
}) {
  const { t } = useTranslation('common')
  const mutacion = useContratarModulo()
  const [encadenarAceptado, setEncadenarAceptado] = useState(false)

  const apiError = mutacion.error ? parseApiError(mutacion.error) : null
  const faltanDependencias = apiError?.code === 'modulos.suscripcion.dependencia_faltante'

  // `args.faltantes` viene del backend. Si dejara de mandarlo, se cae al grafo DIRECTO del catálogo
  // —que no es el cierre transitivo y puede quedarse corto, pero es mejor que una lista vacía
  // debajo de un texto que dice "faltan estos".
  const faltantes = (() => {
    const args = apiError?.args.faltantes
    if (Array.isArray(args)) return args.map(String)
    return modulo.dependeDe
  })()

  function cerrar() {
    mutacion.reset()
    setEncadenarAceptado(false)
    onCerrar()
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={cerrar}
      titulo={t('configuracion.modulos.contratar.titulo', { modulo: modulo.nombre })}
      descripcion={t('configuracion.modulos.contratar.descripcion')}
      cierrePorFuera={!mutacion.isPending}
      pie={
        <>
          <Boton variante="secundaria" deshabilitado={mutacion.isPending} onClick={cerrar}>
            {t('configuracion.modulos.acciones.cancelar')}
          </Boton>
          <Boton
            cargando={mutacion.isPending}
            deshabilitado={faltanDependencias && !encadenarAceptado}
            onClick={() =>
              mutacion.mutate(
                { codigo: modulo.codigo, encadenar: faltanDependencias && encadenarAceptado },
                { onSuccess: cerrar }
              )
            }
          >
            {t('configuracion.modulos.contratar.confirmar')}
          </Boton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-fg-secundario">
          {t('configuracion.modulos.contratar.noDaPermisos')}
        </p>
        <p className="text-sm text-fg-secundario">{t('configuracion.modulos.avisoTokenViejo')}</p>

        {apiError ? (
          <Aviso
            titulo={
              faltanDependencias
                ? t('configuracion.modulos.contratar.conDependencias', { modulo: modulo.nombre })
                : resolveApiErrorMessage(apiError, t)
            }
            mensaje={
              faltanDependencias
                ? `${t('configuracion.modulos.contratar.listaDependencias')} ${faltantes.join(', ')}`
                : null
            }
            trazaId={apiError.traceId}
          />
        ) : null}

        {faltanDependencias ? (
          <label className="flex items-start gap-2 text-sm text-fg-primario">
            <Checkbox
              checked={encadenarAceptado}
              onCheckedChange={(valor) => setEncadenarAceptado(valor === true)}
            />
            <span>
              {t('configuracion.modulos.contratar.optIn')}
              <span className="block text-xs text-fg-terciario">
                {t('configuracion.modulos.contratar.optInAyuda')}
              </span>
            </span>
          </label>
        ) : null}
      </div>
    </Modal>
  )
}
