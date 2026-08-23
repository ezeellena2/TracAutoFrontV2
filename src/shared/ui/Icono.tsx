import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { ICONOS, type NombreDeIcono } from './iconos'

/**
 * Familia F — `Icono`. Origen: ENVOLVER (02-primitivas.md, mapa de cobertura).
 *
 * Hereda el color por `currentColor` y NUNCA lo fija. Por eso un ícono adentro
 * de un botón `peligro` se pinta solo, sin necesidad de una variante de ícono
 * por cada variante de botón.
 *
 * PENDIENTE (DA-FE-04 de 02-primitivas): librería de íconos, empaquetado vs.
 * inline y grilla de tamaños. Decide: PO / equipo de frontend.
 * Lo que esta implementación asume, y por qué:
 *  - `lucide-react`, que ya estaba en el `package.json` y es el default que los
 *    componentes copiados de shadcn/ui ya importan. Elegir otra librería obliga
 *    a editar cada componente copiado, en cada re-copia.
 *  - La grilla de tamaños de abajo es PROVISORIA: son los múltiplos de la escala
 *    de 4px que Tailwind ya genera (`size-3` … `size-6`).
 *
 * ── DESVÍO SALDADO EN F-04a: la prop `nombre` ya existe ──────────────────────
 * Este bloque decía que `nombre` necesitaba *"un registro curado que todavía
 * nadie definió"*. **Ya está definido**: `./iconos/catalogo.ts` porta las cuatro
 * tablas de `12-estandar-de-iconos.md` §4–§7. No empaqueta las ~1500 de lucide
 * —son imports estáticos, el tree-shaking sigue funcionando— y `NombreDeIcono`
 * sale de `keyof typeof ICONOS`, así que un concepto inexistente **no compila**.
 *
 * Las dos formas conviven, y no es indecisión:
 *   `nombre="vehiculo"`  ← la forma NUEVA. El glifo lo elige el catálogo.
 *   `icono={Truck}`      ← la vigente en los 35 usos de hoy. Sigue andando.
 * Migrar los 35 en el mismo movimiento habría mezclado dos cambios en un solo
 * diff: el que agrega la capacidad y el que la adopta. Cuál de las dos formas
 * sobrevive lo cierra `DA-FE-04`; mientras tanto **lo nuevo se escribe con
 * `nombre`**, que es lo que la regla de lint empuja.
 *
 * El compilador exige exactamente UNA de las dos: pasar las dos, o ninguna, es
 * error de tipo.
 */

export type TamanoIcono = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const tamanos: Record<TamanoIcono, string> = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
}

interface IconoPropsBase extends React.SVGProps<SVGSVGElement> {
  tamano?: TamanoIcono
  /**
   * Texto para lector de pantalla. Si se omite, el ícono se marca
   * `aria-hidden`: es decorativo y el significado lo aporta el texto de al lado.
   */
  etiqueta?: string
}

export type IconoProps = IconoPropsBase &
  (
    | {
        /** El CONCEPTO de dominio. Ej: `nombre="vehiculo"`. El glifo lo elige el catálogo. */
        nombre: NombreDeIcono
        icono?: never
      }
    | {
        /** El componente de ícono, forma histórica. Ej: `import { Truck } from 'lucide-react'`. */
        icono: LucideIcon
        nombre?: never
      }
  )

export function Icono({ nombre, icono, tamano = 'md', etiqueta, className, ...resto }: IconoProps) {
  const Componente = nombre === undefined ? (icono as LucideIcon) : ICONOS[nombre]

  return (
    <Componente
      className={cn(tamanos[tamano], 'shrink-0', className)}
      aria-hidden={etiqueta ? undefined : true}
      aria-label={etiqueta}
      role={etiqueta ? 'img' : undefined}
      {...resto}
    />
  )
}
