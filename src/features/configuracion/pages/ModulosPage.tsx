import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/ui/Skeleton'
import { iconoDe } from '@/shared/ui/iconos'
import { EstadoVacio } from '@/shared/ui/EstadoVacio'
import { EstadoError } from '@/shared/ui/EstadoError'
import { usePermisos } from '@/shared/auth/permissions/usePermisos'
import { parseApiError, resolveApiErrorMessage } from '@/shared/errors/parse-api-error'
import type { ModuloCatalogoDto } from '@/services/contracts/modulos'
import { CardDeModulo } from '../components/CardDeModulo'
import { DialogoContratarModulo } from '../components/DialogoContratarModulo'
import { DialogoDeMotivo } from '../components/DialogoDeMotivo'
import { DialogoBajaDeModulo } from '../components/DialogoBajaDeModulo'
import { ModalHistorialDeModulo } from '../components/ModalHistorialDeModulo'
import { useCatalogoModulos } from '../hooks/useCatalogoModulos'
import { useSuscripcionesDeModulos } from '../hooks/useSuscripcionesDeModulos'
import { useSuspenderModulo } from '../hooks/useSuspenderModulo'
import { useRegularizarModulo } from '../hooks/useRegularizarModulo'
import type { AccionDeModulo } from '../vocabulario-suscripcion'

/** Qué diálogo está abierto y sobre qué módulo. `null` = ninguno. */
type Apertura = { accion: AccionDeModulo | 'historial'; modulo: ModuloCatalogoDto } | null

/**
 * `/app/configuracion/modulos` — qué módulos tiene contratados la organización y en qué estado.
 *
 * ── POR QUÉ VIVE EN `features/` Y NO EN `modules/` ────────────────────────────────────────────
 * Una pantalla de `modules/` se monta debajo de `RequiereModulo`, que hace `<Navigate>` cuando el
 * módulo no está en el claim. Un módulo suspendido **desaparece del claim** (`D-GM-13`), así que la
 * única pantalla capaz de levantar una suspensión se auto-expulsaría justo cuando hace falta.
 * Configuración es superficie de sistema: siempre está, con cero módulos instalados también.
 *
 * ── LAS DOS FUENTES, Y POR QUÉ SON DOS ────────────────────────────────────────────────────────
 * El **catálogo** es global (qué módulos existen) y las **suscripciones** son de la organización
 * (cuáles tiene). El cruce se hace acá, y un módulo del catálogo sin fila de suscripción es
 * `no_contratado` — que **no es un estado del modelo**, es la ausencia de la fila.
 *
 * ⚠️ **`esTransversal` no se pinta.** Un módulo transversal (`sistema`) viene siempre incluido y no
 * se contrata (`I-M2`): mostrarlo con un botón "Contratar" ofrece algo que el backend rechaza con
 * 409 `no_suscribible`. Se filtra acá, no en el server, porque el catálogo es global y otra
 * superficie puede querer verlo entero.
 *
 * ⚠️ **Los diálogos se montan SOLO mientras están abiertos.** No es estilo: el texto tipeado y el
 * error de la mutación viven en estado de esos componentes, y dejarlos montados hace que reabran con
 * el motivo —o el error— del módulo anterior. Ver el contrato en el docblock de `DialogoDeMotivo`.
 */
export function ModulosPage() {
  const { t } = useTranslation('common')
  const { tienePermiso } = usePermisos()

  const catalogo = useCatalogoModulos({ pageSize: 100 })
  const suscripciones = useSuscripcionesDeModulos({ pageSize: 100 })
  const suspender = useSuspenderModulo()
  const regularizar = useRegularizarModulo()

  const [apertura, setApertura] = useState<Apertura>(null)

  const puedeGestionar = tienePermiso('sistema.modulos.gestionar')

  const porCodigo = new Map(
    (suscripciones.data?.items ?? []).map((fila) => [fila.moduloCodigo, fila])
  )
  const contratables = (catalogo.data?.items ?? []).filter((modulo) => !modulo.esTransversal)

  const consultaConError = catalogo.error ? catalogo : suscripciones.error ? suscripciones : null
  const apiError = consultaConError?.error ? parseApiError(consultaConError.error) : null

  function cerrar() {
    setApertura(null)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-fg-primario">
          {t('configuracion.modulos.titulo')}
        </h1>
        <p className="text-sm text-fg-secundario">{t('configuracion.modulos.bajada')}</p>
        {/* El precio no se inventa: `ModuloCatalogoDto` no tiene un solo campo comercial y el
            servicio Facturación no existe. Se dice una vez acá, no en cada card. */}
        <p className="text-xs text-fg-terciario">
          {t('configuracion.modulos.pendienteFacturacion')}
        </p>
      </header>

      {apiError ? (
        <EstadoError
          variante="recuperable"
          titulo={t('configuracion.modulos.error.titulo')}
          mensaje={resolveApiErrorMessage(apiError, t)}
          trazaId={apiError.traceId ?? undefined}
          textoReintentar={t('configuracion.modulos.error.reintentar')}
          onReintentar={() => {
            void catalogo.refetch()
            void suscripciones.refetch()
          }}
        />
      ) : catalogo.isPending || suscripciones.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton variante="bloque" repetir={6} />
        </div>
      ) : contratables.length === 0 ? (
        <EstadoVacio
          variante="sin-datos"
          icono={iconoDe('modulo')}
          titulo={t('configuracion.modulos.vacio.titulo')}
          descripcion={t('configuracion.modulos.vacio.descripcion')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {contratables.map((modulo) => (
            <CardDeModulo
              key={modulo.codigo}
              modulo={modulo}
              suscripcion={porCodigo.get(modulo.codigo)}
              puedeGestionar={puedeGestionar}
              onAccion={(accion) => setApertura({ accion, modulo })}
              onVerHistorial={() => setApertura({ accion: 'historial', modulo })}
            />
          ))}
        </div>
      )}

      {apertura?.accion === 'contratar' ? (
        <DialogoContratarModulo abierto modulo={apertura.modulo} onCerrar={cerrar} />
      ) : null}

      {apertura?.accion === 'suspender' ? (
        <DialogoDeMotivo
          abierto
          onCerrar={() => {
            suspender.reset()
            cerrar()
          }}
          titulo={t('configuracion.modulos.suspender.titulo', { modulo: apertura.modulo.nombre })}
          descripcion={t('configuracion.modulos.suspender.descripcion')}
          etiquetaMotivo={t('configuracion.modulos.suspender.motivo')}
          ayudaMotivo={t('configuracion.modulos.suspender.motivoAyuda')}
          textoConfirmar={t('configuracion.modulos.suspender.confirmar')}
          cargando={suspender.isPending}
          error={suspender.error}
          onConfirmar={(motivo) =>
            suspender.mutate(
              { codigo: apertura.modulo.codigo, motivo },
              { onSuccess: cerrar }
            )
          }
        />
      ) : null}

      {apertura?.accion === 'regularizar' ? (
        <DialogoDeMotivo
          abierto
          onCerrar={() => {
            regularizar.reset()
            cerrar()
          }}
          titulo={t('configuracion.modulos.regularizar.titulo', {
            modulo: apertura.modulo.nombre,
          })}
          descripcion={t('configuracion.modulos.regularizar.descripcion')}
          etiquetaMotivo={t('configuracion.modulos.regularizar.motivo')}
          textoConfirmar={t('configuracion.modulos.regularizar.confirmar')}
          cargando={regularizar.isPending}
          error={regularizar.error}
          onConfirmar={(motivo) =>
            regularizar.mutate(
              { codigo: apertura.modulo.codigo, motivo },
              { onSuccess: cerrar }
            )
          }
        />
      ) : null}

      {apertura?.accion === 'baja' ? (
        <DialogoBajaDeModulo abierto modulo={apertura.modulo} onCerrar={cerrar} />
      ) : null}

      {apertura?.accion === 'historial' ? (
        <ModalHistorialDeModulo abierto modulo={apertura.modulo} onCerrar={cerrar} />
      ) : null}
    </div>
  )
}
