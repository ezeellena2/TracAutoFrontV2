/* ─────────────────────────────────────────────────────────────────────────────
 * EDITADO RESPECTO DEL UPSTREAM DE shadcn/ui — declarado acá para que la
 * próxima re-copia (`shadcn add switch --overwrite`) sea un diff legible y no
 * una arqueología (02-primitivas.md §1.6 y §13).
 *
 * Qué se cambió, y por qué — en F-04a:
 *   Tres medidas hardcodeadas pasaron a la escala de espaciado, que SÍ es
 *   tokenizada (`--spacing: var(--s-unidad-espaciado)`, `base.css:183`):
 *     `w-‹32px›` → `w-8` · `w-‹24px›` → `w-6` · `h-‹14px›` → `h-3.5`
 *   Las tres son exactas al píxel (8×4=32, 6×4=24, 3.5×4=14): la escala de
 *   Tailwind es de 4px y estos tres valores ya estaban encima de ella.
 *
 * ⚠️ Lo que NO se cambió, y hay que saber por qué:
 *   `data-[size=default]:h-[18.4px]` **se queda**, y el número no está
 *   compensando nada raro: **18.4px = 1.15rem**, que es el `h-‹1.15rem›` del
 *   upstream de shadcn re-expresado en px. Es el alto de pista que deja ~1.2px
 *   de aire alrededor del pulgar de 16px (`size-4`).
 *
 *   No se movió a `h-4.5` (18px) porque ese cambio no gana tokenización —los
 *   dos son números escritos a mano— y sí cambia el aire del pulgar sin que
 *   nadie lo haya pedido. Lo que falta de verdad es una **escala semántica de
 *   alto de control**, que hoy no existe: la escala de ORBI tokeniza radios,
 *   colores, tipografía y espaciado, no alturas de control.
 *   PENDIENTE (DA-FE-xx): falta una escala de alto de control; la necesitan
 *   `switch` y cualquier control chico que venga. Decide arquitectura de
 *   frontend. Pedir el id en `DECISIONES.md`.
 * ───────────────────────────────────────────────────────────────────────────── */

"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/shared/utils/cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
