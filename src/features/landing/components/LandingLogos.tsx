import { useTranslation } from 'react-i18next'

export function LandingLogos() {
  const { t } = useTranslation()
  const logos = t('landing.logos.items', { returnObjects: true }) as string[]

  return (
    <section className="border-y border-[var(--border-color)] py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
          {t('landing.logos.label')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {logos.map((name) => (
            <span
              key={name}
              className="whitespace-nowrap text-lg font-bold tracking-tight text-[var(--text-primary)] opacity-25 transition-opacity hover:opacity-50"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
