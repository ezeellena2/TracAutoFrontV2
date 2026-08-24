import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/Modal'
import { Boton } from '@/shared/ui/Boton'
import { Tabla } from '@/shared/ui/Tabla'
import { Badge } from '@/shared/ui/Badge'
import { EstadoVacio } from '@/shared/ui/EstadoVacio'
import { EstadoError } from '@/shared/ui/EstadoError'
import type { Columna } from '@/shared/ui/Columna'
import { parseApiError, resolveApiErrorMessage } from '@/shared/errors/parse-api-error'
import type { ModuloCatalogoDto, TransicionDto } from '@/services/contracts/modulos'
import { useHistorialDeModulo } from '../hooks/useHistorialDeModulo'

/**
 * El historial de transiciones de un módulo. **Es el único rastro que existe de una suspensión** en
 * todo ORBI (`GM-B12`): el eje comercial no publica eventos, así que ni Auditoría ni Notificaciones
 * la ven. Si acá no está, no está en ninguna parte.
 *
 * ⚠️ **Una fila por EJE, no por operación.** El alta de la suscripción escribe **dos** filas —una
 * `funcional`, una `comercial`— con el mismo `version: 1` (`P4`). La columna "eje" es lo que las
 * separa: sin ella el alta se lee como un movimiento duplicado.
 *
 * ⚠️ **`estadoAnterior: null` es el nacimiento**, no un dato faltante. Por eso se muestra con su
 * propia etiqueta ("Alta") en vez de un guion.
 *
 * ⚠️ **Ninguna columna es ordenable.** `ModulosPageQuery` es `PageQuery` pelado a propósito
 * (*"un sortBy que el server ignora es peor que uno ausente"*), y el orden lo fija el contrato:
 * fecha DESC con desempate por id. Marcar una columna ordenable prometería algo que no existe.
 */
export function ModalHistorialDeModulo({
  modulo,
  abierto,
  onCerrar,
}: {
  modulo: ModuloCatalogoDto
  abierto: boolean
  onCerrar: () => void
}) {
  const { t, i18n } = useTranslation('common')
  const consulta = useHistorialDeModulo(modulo.codigo, {}, abierto)

  const fecha = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  const columnas: Columna<TransicionDto>[] = [
    {
      clave: 'fechaCreacion',
      titulo: t('configuracion.modulos.historial.fecha'),
      tipo: 'fecha',
      render: (fila) => fecha.format(new Date(fila.fechaCreacion)),
    },
    {
      clave: 'eje',
      titulo: t('configuracion.modulos.historial.eje'),
      tipo: 'nodo',
      render: (fila) => (
        <Badge variante={fila.eje === 'funcional' ? 'acento' : 'info'}>
          {fila.eje === 'funcional'
            ? t('configuracion.modulos.historial.ejeFuncional')
            : t('configuracion.modulos.historial.ejeComercial')}
        </Badge>
      ),
    },
    {
      clave: 'transicion',
      titulo: t('configuracion.modulos.historial.transicion'),
      tipo: 'mono',
      render: (fila) =>
        fila.estadoAnterior === null
          ? t('configuracion.modulos.historial.nacimiento')
          : `${fila.estadoAnterior} → ${fila.estadoNuevo}`,
    },
    {
      clave: 'motivo',
      titulo: t('configuracion.modulos.historial.motivo'),
      render: (fila) => fila.motivo ?? t('configuracion.modulos.historial.sinMotivo'),
    },
    {
      clave: 'version',
      titulo: t('configuracion.modulos.historial.version'),
      tipo: 'numero',
      alineacion: 'derecha',
    },
  ]

  const apiError = consulta.error ? parseApiError(consulta.error) : null

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      tamano="lg"
      titulo={t('configuracion.modulos.historial.titulo', { modulo: modulo.nombre })}
      pie={
        <Boton variante="secundaria" onClick={onCerrar}>
          {t('configuracion.modulos.acciones.cerrar')}
        </Boton>
      }
    >
      <Tabla
        columnas={columnas}
        filas={consulta.data?.items ?? []}
        claveFila={(fila) => fila.id}
        densidad="densa"
        cargando={consulta.isPending}
        vacio={
          <EstadoVacio
            variante="sin-datos"
            titulo={t('configuracion.modulos.historial.vacio')}
          />
        }
        error={
          apiError ? (
            <EstadoError
              variante="recuperable"
              titulo={resolveApiErrorMessage(apiError, t)}
              trazaId={apiError.traceId ?? undefined}
              onReintentar={() => void consulta.refetch()}
              textoReintentar={t('configuracion.modulos.error.reintentar')}
            />
          ) : undefined
        }
      />
    </Modal>
  )
}
