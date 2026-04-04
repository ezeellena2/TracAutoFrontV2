import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function LandingCta() {
  const { t } = useTranslation()

  return (
    <section className="relative py-20 text-center" id="contacto">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 60%)' }}
      />
      <div className="relative z-[1] mx-auto max-w-[1200px] px-6">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
          {t('landing.cta.title')}
        </h2>
        <p className="mb-8 text-lg text-[var(--text-secondary)]">
          {t('landing.cta.subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/auth/registro" className="rounded-xl bg-[var(--amber)] px-8 py-4 text-base font-semibold text-[var(--amber-text)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]">
            {t('landing.cta.ctaPersonal')}
          </Link>
          <Link to="/auth/registro-empresa" className="rounded-xl border border-[var(--border-color)] px-8 py-4 text-base font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]">
            {t('landing.cta.ctaEmpresa')}
          </Link>
        </div>
      </div>
    </section>
  )
}
