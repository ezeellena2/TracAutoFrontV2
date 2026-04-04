import { useTranslation } from 'react-i18next'
import { useDashboardSummary } from '../hooks/useDashboardSummary'

/**
 * Placeholder del dashboard autenticado.
 * Se reemplaza cuando se implemente el shell completo con modulos.
 */
export function DashboardPage() {
  const { t } = useTranslation()
  const { esContextoPersonal, organizacionActivaNombre } = useDashboardSummary()

  return (
    <div className="rounded-xl bg-[var(--color-surface-1)] p-8">
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
        {t('app.dashboard.title')}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {esContextoPersonal
          ? t('app.dashboard.contextPersonal')
          : t('app.dashboard.contextEmpresa', {
            org: organizacionActivaNombre,
          })}
      </p>
    </div>
  )
}
