import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
/**
 * Paso 5 del registro: confirmacion de exito.
 * Muestra check animado + mensaje + boton a /app.
 */
export function RegistroStepSuccess() {
  const { t } = useTranslation()

  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-cyan)]/10">
        <CheckCircle className="h-8 w-8 text-[var(--color-brand-cyan)]" />
      </div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
        {t('auth.registro.success.title')}
      </h1>
      <p className="mt-3 text-base text-[var(--color-text-secondary)]">
        {t('auth.registro.success.subtitle')}
      </p>
      <div className="mt-6">
        <Link
          to="/app"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[var(--color-brand-amber)] px-4 py-3 text-sm font-semibold text-[var(--color-bg-canvas)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-canvas)]"
        >
          {t('auth.registro.success.cta')}
        </Link>
      </div>
    </div>
  )
}
