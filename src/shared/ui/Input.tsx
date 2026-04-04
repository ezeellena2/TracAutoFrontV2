import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  leadingAdornment?: ReactNode
}

/**
 * Input con label visible (accesibilidad) y mensaje de error.
 * Contraste 4.5:1, focus ring visible.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, leadingAdornment, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
        <div className="relative">
          {leadingAdornment ? (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-text-tertiary)]">
              {leadingAdornment}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] px-4 py-3
              text-sm text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-tertiary)]
              outline-none transition-shadow
              focus:border-[var(--color-brand-cyan)] focus:ring-2 focus:ring-[var(--color-brand-cyan)]
              ${leadingAdornment ? 'pl-11' : ''}
              ${error ? 'border-[var(--color-danger)] ring-2 ring-[var(--color-danger)]' : ''}
            `}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-[var(--color-danger)]">{error}</p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
