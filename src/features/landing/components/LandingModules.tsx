import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const MODULES = [
  { key: 'flota', icon: '\uD83D\uDE9B' },
  { key: 'concesionaria', icon: '\uD83C\uDFE2' },
  { key: 'taller', icon: '\uD83D\uDD27' },
  { key: 'seguros', icon: '\uD83D\uDEE1\uFE0F' },
  { key: 'alquileres', icon: '\uD83D\uDD11' },
  { key: 'movilidad', icon: '\uD83D\uDCF1' },
  { key: 'delivery', icon: '\uD83D\uDCE6' },
]

export function LandingModules() {
  const { t } = useTranslation()

  return (
    <section className="py-20" id="funcionalidades">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          title={t('landing.modules.title')}
          subtitle={t('landing.modules.subtitle')}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODULES.map((mod) => (
            <ModuleFeatureCard
              key={mod.key}
              icon={mod.icon}
              title={t(`landing.modules.items.${mod.key}.title`)}
              description={t(`landing.modules.items.${mod.key}.desc`)}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/auth/registro-empresa" className="inline-block rounded-xl bg-[var(--amber)] px-6 py-3 text-sm font-semibold text-[var(--amber-text)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]">
            {t('landing.modules.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">{title}</h2>
      <p className="mx-auto max-w-[560px] text-lg text-[var(--text-secondary)]">{subtitle}</p>
    </div>
  )
}

function ModuleFeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6 transition-all hover:-translate-y-[3px] hover:border-[var(--cyan-hover)] hover:shadow-[0_0_10px_var(--cyan-muted)]">
      <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[var(--cyan-subtle)] text-2xl">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
    </div>
  )
}
