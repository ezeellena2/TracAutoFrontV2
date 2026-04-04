import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-24">
      <HeroAmbient />
      <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        <HeroContent />
        <HeroVisual />
      </div>
    </section>
  )
}

function HeroAmbient() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: [
          'radial-gradient(ellipse at 25% 40%, rgba(6,182,212,0.06) 0%, transparent 55%)',
          'radial-gradient(ellipse at 75% 60%, rgba(245,158,11,0.03) 0%, transparent 50%)',
          'radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.04) 0%, transparent 40%)',
        ].join(','),
      }}
    />
  )
}

function HeroContent() {
  const { t } = useTranslation()
  return (
    <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(6,182,212,0.2)] bg-[var(--cyan-subtle)] px-3.5 py-1.5 text-sm font-medium text-[var(--cyan)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" style={{ animation: 'tracking-dot 2s ease-in-out infinite' }} />
        {t('landing.hero.badge')}
      </div>
      <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tighter text-[var(--text-primary)] md:text-5xl">
        {t('landing.hero.titleLine1')}
        <br />
        <span className="text-gradient-hero">{t('landing.hero.titleLine2')}</span>
      </h1>
      <p className="mb-8 max-w-[480px] text-lg leading-relaxed text-[var(--text-secondary)]">
        {t('landing.hero.subtitle')}
      </p>
      <div className="flex flex-wrap gap-4">
        <Link to="/auth/registro" className="rounded-xl bg-[var(--amber)] px-6 py-3 text-sm font-semibold text-[var(--amber-text)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]">
          {t('landing.hero.cta')}
        </Link>
        <a href="#funcionalidades" className="rounded-xl border border-[var(--border-color)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]">
          {t('landing.hero.ctaSecondary')}
        </a>
      </div>
    </div>
  )
}

function HeroVisual() {
  const { t } = useTranslation()
  return (
    <div className="relative hidden h-[460px] md:block" style={{ animation: 'fadeIn 1s ease-out 0.3s both' }}>
      <div className="flex h-full items-center justify-center">
        <div
          className="w-full max-w-[480px] rounded-2xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{t('landing.hero.mock.title')}</h3>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--amber)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--danger)]" />
            </div>
          </div>
          <DashboardStats />
          <DashboardMap />
        </div>
      </div>
    </div>
  )
}

function DashboardStats() {
  const { t } = useTranslation()
  const stats = [
    { value: '24', label: t('landing.hero.mock.active'), color: 'var(--cyan)' },
    { value: '3', label: t('landing.hero.mock.workshop'), color: 'var(--amber)' },
    { value: '98%', label: t('landing.hero.mock.uptime'), color: 'var(--success)' },
  ]
  return (
    <div className="mb-5 grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg bg-[var(--surface-2)] p-3 text-center">
          <div className="text-2xl font-semibold tabular-nums" style={{ color: s.color }}>{s.value}</div>
          <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function DashboardMap() {
  return (
    <div className="relative h-[140px] w-full overflow-hidden rounded-lg bg-[var(--surface-2)]">
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(180deg, transparent 40%, var(--surface-2) 100%)',
            'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(6,182,212,0.05) 20px, rgba(6,182,212,0.05) 21px)',
            'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(6,182,212,0.05) 20px, rgba(6,182,212,0.05) 21px)',
          ].join(','),
        }}
      />
      <div className="tracking-point" style={{ top: '35%', left: '55%' }} />
    </div>
  )
}
