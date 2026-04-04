import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
interface SummaryData {
  empresaNombre: string
  empresaCuit: string
  adminNombre: string
  modulos: string[]
}

/**
 * Paso 5 del registro empresa: exito con resumen.
 */
export function RegistroEmpresaSuccess({ data }: { data: SummaryData }) {
  const { t } = useTranslation()

  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-cyan)]/10">
        <CheckCircle className="h-8 w-8 text-[var(--color-brand-cyan)]" />
      </div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
        {t('auth.registroEmpresa.success.title')}
      </h1>
      <p className="mt-3 text-base text-[var(--color-text-secondary)]">
        {t('auth.registroEmpresa.success.subtitle')}
      </p>

      <SummaryCard data={data} />

      <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
        {t('auth.registroEmpresa.success.inviteHint')}
      </p>
      <div className="mt-6">
        <Link
          to="/app"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[var(--color-brand-amber)] px-4 py-3 text-sm font-semibold text-[var(--color-bg-canvas)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-canvas)]"
        >
          {t('auth.registroEmpresa.success.cta')}
        </Link>
      </div>
    </div>
  )
}

function SummaryCard({ data }: { data: SummaryData }) {
  const { t } = useTranslation()

  return (
    <div className="mx-auto my-6 rounded-xl border border-[var(--color-surface-3)] bg-[var(--color-surface-1)] p-6 text-left">
      <SummaryRow label={t('auth.registroEmpresa.summary.empresa')} value={data.empresaNombre} />
      <SummaryRow label={t('auth.registroEmpresa.summary.cuit')} value={data.empresaCuit} mono />
      <SummaryRow label={t('auth.registroEmpresa.summary.admin')} value={data.adminNombre} />
      <SummaryRow label={t('auth.registroEmpresa.summary.role')} value={t('auth.registroEmpresa.summary.ownerRole')} badge />
      <div className="flex items-center justify-between py-3">
        <span className="text-sm text-[var(--color-text-secondary)]">
          {t('auth.registroEmpresa.summary.modules')}
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          {data.modulos.map((mod) => (
            <span
              key={mod}
              className="inline-flex rounded-full bg-[var(--color-brand-cyan)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-brand-cyan)]"
            >
              {t(`auth.registroEmpresa.modules.${mod}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  mono,
  badge,
}: {
  label: string
  value: string
  mono?: boolean
  badge?: boolean
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-surface-3)] py-3 last:border-0">
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      {badge ? (
        <span className="rounded-full bg-[var(--color-brand-cyan)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-brand-cyan)]">
          {value}
        </span>
      ) : (
        <span className={`text-base font-medium text-[var(--color-text-primary)] ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
      )}
    </div>
  )
}
