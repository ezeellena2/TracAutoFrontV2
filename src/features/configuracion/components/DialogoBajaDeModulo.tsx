import { useTranslation } from 'react-i18next'
import { DialogoConfirmacion } from '@/shared/ui/DialogoConfirmacion'
import { parseApiError, resolveApiErrorMessage } from '@/shared/errors/parse-api-error'
import type { ModuloCatalogoDto } from '@/services/contracts/modulos'
import { useDarDeBajaModulo } from '../hooks/useDarDeBajaModulo'

/**
 * La **única** transición destructiva de la pantalla, y por eso la única con confirmación por tipeo.
 *
 * Las tres cosas que el copy tiene que decir, y dice:
 *  1. se borran los permisos del módulo de **todos** los roles, incluidos los propios del cliente;
 *  2. el borrado es **físico** — `RolPermiso` no es `ISoftDeletable`, no hay papelera;
 *  3. al recontratar vuelven **solo los roles plantilla**; los propios se reasignan a mano.
 *
 * ⚠️ **Se parece a suspender en la UI y no se parece en nada en el efecto.** Ese es exactamente el
 * riesgo que la confirmación por tipeo cubre: separar "cliqueé la de al lado" de "quise esto".
 *
 * ⚠️ **`etiquetaTipeo` NO interpola el código.** `DialogoConfirmacion` ya lo dibuja a continuación,
 * en mono y `select-all`; repetirlo lo mostraría dos veces y arruinaría el único punto de la
 * variante — que el usuario LEA el valor carácter por carácter antes de escribirlo.
 *
 * ⚠️ **El 409 `tiene_dependientes` tiene copy propio.** Reintentar no sirve —vuelve a chocar—, así
 * que en vez del mensaje genérico se nombran los módulos que hay que dar de baja primero, que salen
 * de `args.dependientes`. Es la misma forma que `ModalBajaVehiculo` usa para su 409 de asignaciones.
 *
 * 🔴 **PENDIENTE (`DA-FE-47`): la baja no puede llevar `motivo`.**
 * El contrato lo acepta como opcional (`P1`) y `DialogoConfirmacion` —la primitiva compartida de
 * confirmación destructiva— **no tiene slot para campos extra**. Fabricar un segundo diálogo de
 * confirmación adentro de `features/` para meter un textarea es exactamente lo que la ley 3 prohíbe,
 * así que se manda sin motivo y se declara. Quien lo necesite: se pide el slot en la primitiva.
 * Nota: la suspensión —donde el motivo SÍ es el único rastro (`GM-B12`)— no está afectada; esa va
 * por `DialogoDeMotivo`, que se apoya en `Modal` y sí puede tener campos.
 */
export function DialogoBajaDeModulo({
  modulo,
  abierto,
  onCerrar,
}: {
  modulo: ModuloCatalogoDto
  abierto: boolean
  onCerrar: () => void
}) {
  const { t } = useTranslation('common')
  const mutacion = useDarDeBajaModulo()

  const apiError = mutacion.error ? parseApiError(mutacion.error) : null

  const descripcion = (() => {
    if (apiError === null) {
      return [
        t('configuracion.modulos.baja.advertencia1'),
        t('configuracion.modulos.baja.advertencia2'),
        t('configuracion.modulos.baja.advertencia3'),
      ].join(' ')
    }
    if (apiError.code === 'modulos.suscripcion.tiene_dependientes') {
      const dependientes = apiError.args.dependientes
      return t('configuracion.modulos.baja.bloqueadaPorDependientes', {
        dependientes: Array.isArray(dependientes) ? dependientes.join(', ') : modulo.codigo,
      })
    }
    return resolveApiErrorMessage(apiError, t)
  })()

  return (
    <DialogoConfirmacion
      abierto={abierto}
      onCerrar={() => {
        mutacion.reset()
        onCerrar()
      }}
      onConfirmar={() => mutacion.mutate({ codigo: modulo.codigo }, { onSuccess: onCerrar })}
      variante="peligro-con-tipeo"
      titulo={t('configuracion.modulos.baja.titulo', { modulo: modulo.nombre })}
      descripcion={descripcion}
      etiquetaTipeo={t('configuracion.modulos.baja.tipeaParaConfirmar')}
      valorEsperado={modulo.codigo}
      textoConfirmar={t('configuracion.modulos.baja.confirmar')}
      textoCancelar={t('configuracion.modulos.acciones.cancelar')}
      cargando={mutacion.isPending}
    />
  )
}
