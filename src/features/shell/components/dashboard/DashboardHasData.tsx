import { useTranslation } from 'react-i18next'
import { Plus, Map, AlertTriangle, Car } from 'lucide-react'
import { useSessionStore } from '@/stores/session-store'

function KpiCard({ labelKey }: { labelKey: string }) {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-primary p-4">
      <p className="text-xs font-medium text-text-tertiary">{t(labelKey)}</p>
      <p className="mt-2 text-2xl font-semibold text-text-primary">—</p>
    </div>
  )
}

function KpiGrid() {
  const kpis = [
    'shell.dashboard.kpi.totalVehiculos',
    'shell.dashboard.kpi.enLinea',
    'shell.dashboard.kpi.alertasAbiertas',
    'shell.dashboard.kpi.conDispositivo',
    'shell.dashboard.kpi.conductoresActivos',
    'shell.dashboard.kpi.licenciasPorVencer',
    'shell.dashboard.kpi.geozonas',
    'shell.dashboard.kpi.mantenimientos',
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map(key => <KpiCard key={key} labelKey={key} />)}
    </div>
  )
}

function MapCard() {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-primary p-4">
      <div className="mb-3 flex items-center gap-2">
        <Map className="h-4 w-4 text-brand-cyan" />
        <p className="text-sm font-medium text-text-primary">{t('shell.dashboard.mapPlaceholder')}</p>
      </div>
      <div className="flex h-48 items-center justify-center rounded-lg bg-surface-secondary">
        <p className="text-sm text-text-tertiary">{t('shell.dashboard.mapEmpty')}</p>
      </div>
    </div>
  )
}

function AlertsCard() {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-primary p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-brand-amber" />
        <p className="text-sm font-medium text-text-primary">{t('shell.dashboard.alertsTitle')}</p>
      </div>
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-text-tertiary">{t('shell.dashboard.emptyAlerts')}</p>
      </div>
    </div>
  )
}

function VehiclesCard() {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-primary">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-text-tertiary" />
          <p className="text-sm font-medium text-text-primary">{t('shell.dashboard.vehiclesTitle')}</p>
        </div>
      </div>
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm text-text-tertiary">{t('shell.dashboard.emptyVehicles')}</p>
      </div>
    </div>
  )
}

function DashboardTitleRow() {
  const { t } = useTranslation()
  const orgNombre = useSessionStore(s => s.organizacionActiva?.nombre ?? '')

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          {t('shell.dashboard.title')} — {orgNombre}
        </h1>
      </div>
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-brand-cyan px-3 py-2 text-sm font-medium text-bg-canvas transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        {t('shell.dashboard.addVehicle')}
      </button>
    </div>
  )
}

export function DashboardHasData() {
  return (
    <div className="space-y-4">
      <DashboardTitleRow />
      <KpiGrid />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65fr_35fr]">
        <MapCard />
        <AlertsCard />
      </div>
      <VehiclesCard />
    </div>
  )
}
