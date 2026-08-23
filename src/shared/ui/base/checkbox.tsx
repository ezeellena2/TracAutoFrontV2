/* ─────────────────────────────────────────────────────────────────────────────
 * EDITADO RESPECTO DEL UPSTREAM DE shadcn/ui — declarado acá para que la
 * próxima re-copia (`shadcn add checkbox --overwrite`) sea un diff legible y no
 * una arqueología (02-primitivas.md §1.6 y §13).
 *
 * NO se cambió nada del upstream. Este encabezado existe para dejar escrito un
 * PENDIENTE que si no queda acá, se vuelve a descubrir desde cero:
 *
 * ⚠️ `rounded-‹4px›` es geometría de marca hardcodeada, y **no se pudo
 *   tokenizar** en F-04a: la escala semántica de radios arranca en
 *   `--s-radio-sm` = 0.5rem = **8px** (`semanticas.css:131`). Sobre un checkbox
 *   de 16px (`size-4`), pasar de 4px a 8px es duplicar el redondeo: se ve, y
 *   sería un cambio de diseño disfrazado de refactor.
 *
 *   La regla del repo es explícita sobre qué hacer acá: *"si necesitás un token
 *   que no existe, no lo inventes en el componente: pedilo"*
 *   (`frontend-core.md` §1, procedimiento en `01-sistema-de-diseno.md` §10).
 *
 *   PENDIENTE (DA-FE-xx): falta un escalón de radio por debajo de `sm` (~4px)
 *   para controles chicos. Lo necesitan `checkbox` (4px) y la flecha de
 *   `tooltip` (2px). Decide arquitectura de frontend; pedir el id en
 *   `DECISIONES.md`.
 * ───────────────────────────────────────────────────────────────────────────── */

"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/shared/utils/cn"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
