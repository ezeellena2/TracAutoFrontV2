import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/Modal'
import { Boton } from '@/shared/ui/Boton'
import { Campo } from '@/shared/ui/Campo'
import { AreaTexto } from '@/shared/ui/AreaTexto'
import { Aviso } from '@/shared/ui/Aviso'
import { parseApiError, resolveApiErrorMessage } from '@/shared/errors/parse-api-error'

export interface DialogoDeMotivoProps {
  abierto: boolean
  onCerrar: () => void
  /** Ya resueltos por i18n: este componente no conoce ninguna clave. */
  titulo: string
  descripcion: string
  etiquetaMotivo: string
  ayudaMotivo?: string
  textoConfirmar: string
  /** El motivo llega `undefined` si el usuario no escribió nada — el backend lo acepta (`P1`). */
  onConfirmar: (motivo: string | undefined) => void
  cargando: boolean
  error: unknown
}

/**
 * El molde de las dos transiciones del eje **comercial**: suspender y regularizar.
 *
 * Comparten forma exacta —un motivo opcional y un botón— y difieren solo en copy y en qué mutación
 * disparan, así que el copy entra **por props ya resueltas** y este archivo no importa una sola
 * clave de i18n. Con las claves adentro habría un `if (accion === 'suspender')` gobernando el texto,
 * que es la forma más fácil de que un cambio de copy en una acción se filtre a la otra.
 *
 * ⚠️ **No es un candidato a `shared/`**: la forma "modal con un campo y un botón" es un formulario,
 * no una primitiva. Lo que sí es candidato —el molde de formulario, copiado ~9 veces en Flota— ya
 * está declarado como tal en el `CLAUDE.md` de ese módulo, con `src/shared/forms/` vacía esperándolo.
 *
 * ⚠️ **El motivo es lo único que va a explicar después qué pasó.** El eje comercial no publica
 * eventos (`GM-B12`): Auditoría no ve la transición y Notificaciones no puede avisar. El único
 * rastro es `historial_suscripcion_modulo`, y ahí el motivo es el único campo con contenido humano.
 *
 * 🔒 **CONTRATO CON QUIEN LO MONTA: este componente se renderiza SOLO mientras está abierto.**
 * El texto tipeado vive en `useState` de este componente, que es **padre** de `<Modal>` — o sea que
 * Base UI desmonta el popup al cerrar pero **no** este estado. Dejarlo montado con `abierto={false}`
 * hace que el diálogo reabra con el motivo de la vez anterior ya escrito, listo para mandarse sobre
 * otro módulo. Es el mismo bug que `DialogoConfirmacion` documenta y resuelve moviendo su estado
 * adentro del popup; acá no se puede, porque los botones viven en `pie`, que es hermano de
 * `children`. Se resuelve montando condicionalmente, y `ModulosPage` lo hace así.
 */
export function DialogoDeMotivo({
  abierto,
  onCerrar,
  titulo,
  descripcion,
  etiquetaMotivo,
  ayudaMotivo,
  textoConfirmar,
  onConfirmar,
  cargando,
  error,
}: DialogoDeMotivoProps) {
  const { t } = useTranslation('common')
  const [motivo, setMotivo] = useState('')

  const apiError = error ? parseApiError(error) : null
  const motivoLimpio = motivo.trim()

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={titulo}
      descripcion={descripcion}
      cierrePorFuera={!cargando}
      pie={
        <>
          <Boton variante="secundaria" deshabilitado={cargando} onClick={onCerrar}>
            {t('configuracion.modulos.acciones.cancelar')}
          </Boton>
          <Boton
            cargando={cargando}
            onClick={() => onConfirmar(motivoLimpio === '' ? undefined : motivoLimpio)}
          >
            {textoConfirmar}
          </Boton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {apiError ? (
          <Aviso titulo={resolveApiErrorMessage(apiError, t)} trazaId={apiError.traceId} />
        ) : null}

        <Campo etiqueta={etiquetaMotivo} ayuda={ayudaMotivo}>
          {(control) => (
            <AreaTexto
              {...control}
              filas={3}
              maxLargo={500}
              contador
              value={motivo}
              onChange={(evento) => setMotivo(evento.target.value)}
            />
          )}
        </Campo>

        <p className="text-sm text-fg-secundario">{t('configuracion.modulos.avisoTokenViejo')}</p>
      </div>
    </Modal>
  )
}
