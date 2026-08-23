import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils/cn"

/* ─────────────────────────────────────────────────────────────────────────────
 * EDITADO RESPECTO DEL UPSTREAM DE shadcn/ui — declarado acá para que la
 * próxima re-copia (`shadcn add button --overwrite`) sea un diff legible y no
 * una arqueología (02-primitivas.md §1.6 y §13).
 *
 * Qué se cambió, y por qué — un solo cambio, en F-04a:
 *   Los 4 tamaños chicos (`xs`, `sm`, `icon-xs`, `icon-sm`) traían
 *   `rounded-‹min(var(--radius-md),10px)›` y `(…,12px)`: leían el token de
 *   radio y le ponían un TECHO. Es el peor modo de falla del sistema de
 *   apariencia, porque parece tokenizado y no lo está — una estética que suba
 *   `--s-radio-md` a 20px dejaría estos botones clavados en 10 y 12, sin error
 *   ni aviso (11-catalogo-de-esteticas.md §4).
 *
 *   Hoy el cambio es EXACTO al píxel, y se puede probar con aritmética:
 *   `--s-radio-md` vale `0.625rem` = 10px (`semanticas.css:132`), así que
 *   `min(10px,10px)` y `min(10px,12px)` valen los dos 10px, que es lo mismo
 *   que `rounded-md`. Los dos techos distintos ya rendían idéntico: la
 *   distinción entre 10 y 12 no existía en pantalla.
 *
 *   Ojo: NO es lo mismo que el `rounded-lg` de la clase base — ese es 14px.
 *   Los tamaños chicos siguen siendo más cuadrados que los grandes, que es
 *   justo lo que el techo intentaba conseguir; ahora lo consigue con el token
 *   que corresponde en vez de con un tope.
 * ───────────────────────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-md in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
