import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui/Badge'
import type { SuscripcionDto } from '@/services/contracts/modulos'
import {
  claveDeAyudaDeEstadoComercial,
  claveDeEstadoComercial,
  claveDeEstadoFuncional,
  varianteDeEstadoComercial,
  varianteDeEstadoFuncional,
} from '../vocabulario-suscripcion'

/**
 * **DOS badges, uno por eje. Nunca uno solo.**
 *
 * Es la decisión visual que sostiene toda la pantalla: los dos ejes son independientes (`I-S7`), y
 * un badge único obliga a inventar una precedencia que no existe en el modelo. La ficha original
 * tenía un eje único, y de ahí salía la afirmación de que "desactivar elimina permisos" — cierto
 * para la baja, **falso y destructivo** para la suspensión.
 *
 * El `title` del badge comercial es donde se explica que suspendido ≠ no contratado. No es adorno:
 * es la única superficie del producto donde esa diferencia existe (`D-GM-13`).
 */
export function BadgesDeSuscripcion({ suscripcion }: { suscripcion: SuscripcionDto }) {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variante={varianteDeEstadoFuncional(suscripcion.estadoFuncional)} punto>
        {t(claveDeEstadoFuncional(suscripcion.estadoFuncional))}
      </Badge>
      <Badge
        variante={varianteDeEstadoComercial(suscripcion.estadoComercial)}
        punto
        title={t(claveDeAyudaDeEstadoComercial(suscripcion.estadoComercial))}
      >
        {t(claveDeEstadoComercial(suscripcion.estadoComercial))}
      </Badge>
    </div>
  )
}
