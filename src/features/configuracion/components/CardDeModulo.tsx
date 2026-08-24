import { useTranslation } from 'react-i18next'
import { Boton } from '@/shared/ui/Boton'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import type { ModuloCatalogoDto, SuscripcionDto } from '@/services/contracts/modulos'
import { BadgesDeSuscripcion } from './BadgesDeSuscripcion'
import {
  accionesVisibles,
  claveDeLineaDeAcceso,
  situacionDeModulo,
  type AccionDeModulo,
} from '../vocabulario-suscripcion'

/** Cada acción a su botón: la variante y la clave de copy salen de acá, no de un `if` en el JSX. */
const BOTONES: Record<
  AccionDeModulo,
  { clave: string; variante: 'primaria' | 'secundaria' | 'peligro-contorno' }
> = {
  contratar: { clave: 'configuracion.modulos.acciones.contratar', variante: 'primaria' },
  regularizar: { clave: 'configuracion.modulos.acciones.regularizar', variante: 'primaria' },
  suspender: { clave: 'configuracion.modulos.acciones.suspender', variante: 'secundaria' },
  baja: { clave: 'configuracion.modulos.acciones.darDeBaja', variante: 'peligro-contorno' },
}

export interface CardDeModuloProps {
  modulo: ModuloCatalogoDto
  /** `undefined` = la organización no tiene fila. **No es un estado**: es la ausencia. */
  suscripcion: SuscripcionDto | undefined
  /** `false` sin `sistema.modulos.gestionar`: la card se ve entera, pero sin acciones. */
  puedeGestionar: boolean
  onAccion: (accion: AccionDeModulo) => void
  onVerHistorial: () => void
}

/**
 * Una card por módulo del catálogo, cruzada con la suscripción de la organización.
 *
 * ⚠️ **`dado_de_baja` ofrece "Volver a contratar", no "Contratar"** — el usuario ya pasó por acá y
 * el copy tiene que reconocerlo. Es el mismo endpoint; cambia solo la etiqueta.
 *
 * ⚠️ **Un módulo `esBase` no ofrece "Dar de baja"** — `I-M4` / `D-GM-14`. El backend lo rechaza con
 * 409 `modulos.catalogo.es_base`, así que esconder el botón es coherencia de UI y no el control.
 *
 * Esta card decía antes *"se muestran igual todas las acciones: quien decide es el backend"*, y era
 * **falso**: hasta el 2026-08-23 el service no miraba `EsBase` en una sola línea. El detalle de por
 * qué eso era grave —y por qué el gate es `esBase` y nunca el literal `'flota'`— está en el docblock
 * de `accionesVisibles`, que es donde vive la decisión.
 *
 * ⚠️ **Sin precio.** `ModuloCatalogoDto` no tiene un solo campo comercial y Facturación no existe:
 * la card no inventa un número. El aviso de que el precio no está definido lo pone la pantalla, una
 * sola vez, en vez de repetirlo en cada card.
 *
 * 🔴 **PENDIENTE (`DA-FE-46`): falta el concepto `historial` en el catálogo de íconos.** Los 102 conceptos de `@/shared/ui/iconos` no lo tienen, y `R-IC-2` prohíbe
 * importar un glifo por nombre desde `lucide-react` — con razón: un ícono elegido en una pantalla es
 * cómo empieza a haber tres dibujos para la misma cosa. El botón "Ver historial" va **sin ícono**
 * hasta que el concepto se agregue por el procedimiento de `12-estandar-de-iconos.md` §9.
 */
export function CardDeModulo({
  modulo,
  suscripcion,
  puedeGestionar,
  onAccion,
  onVerHistorial,
}: CardDeModuloProps) {
  const { t, i18n } = useTranslation('common')
  const idioma = i18n.language

  const situacion = situacionDeModulo(suscripcion)

  const acciones = accionesVisibles(situacion, modulo.esBase)

  const etiquetaDe = (accion: AccionDeModulo) =>
    accion === 'contratar' && situacion === 'dado_de_baja'
      ? t('configuracion.modulos.acciones.recontratar')
      : t(BOTONES[accion].clave)

  /**
   * La línea de acceso. Solo `en_prueba` interpola `{{fecha}}`.
   *
   * ⚠️ **La fecha se resuelve ANTES de elegir la clave, no adentro del `t()`.** `I-S4` exige
   * vencimiento para `trial`, pero si por lo que sea llegara `null`, i18next deja el `{{fecha}}`
   * **literal en pantalla**: no falla, no avisa, imprime la llave. Cuando no hay fecha usable se cae
   * a "Sin vencimiento", que es cierto y no tiene placeholder.
   */
  const lineaDeAcceso = (() => {
    if (situacion !== 'en_prueba') return t(claveDeLineaDeAcceso(situacion))

    const vence = suscripcion?.vigenteHasta
    const fecha = vence === null || vence === undefined ? null : new Date(vence)
    if (fecha === null || Number.isNaN(fecha.getTime())) {
      return t('configuracion.modulos.meta.sinVencimiento')
    }

    return t(claveDeLineaDeAcceso(situacion), {
      fecha: new Intl.DateTimeFormat(idioma, { dateStyle: 'medium' }).format(fecha),
    })
  })()

  return (
    <Card titulo={modulo.nombre} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {suscripcion ? (
          <BadgesDeSuscripcion suscripcion={suscripcion} />
        ) : (
          <Badge variante="neutro">{t('configuracion.modulos.situacion.no_contratado')}</Badge>
        )}
        {modulo.esBase ? (
          <Badge variante="acento">{t('configuracion.modulos.meta.esBase')}</Badge>
        ) : null}
      </div>

      <p className="text-sm text-fg-secundario">{lineaDeAcceso}</p>

      {modulo.dependeDe.length > 0 ? (
        <p className="text-xs text-fg-terciario">
          {t('configuracion.modulos.meta.dependeDe')}: {modulo.dependeDe.join(', ')}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {puedeGestionar
          ? acciones.map((accion) => (
              <Boton
                key={accion}
                tamano="sm"
                variante={BOTONES[accion].variante}
                onClick={() => onAccion(accion)}
              >
                {etiquetaDe(accion)}
              </Boton>
            ))
          : null}
        {suscripcion ? (
          <Boton tamano="sm" variante="fantasma" onClick={onVerHistorial}>
            {t('configuracion.modulos.acciones.verHistorial')}
          </Boton>
        ) : null}
      </div>
    </Card>
  )
}
