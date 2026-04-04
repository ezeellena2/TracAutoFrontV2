import { useTranslation } from 'react-i18next'

const STEPS = ['01', '02', '03'] as const

export function LandingSteps() {
  const { t } = useTranslation()

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
            {t('landing.steps.title')}
          </h2>
          <p className="mx-auto max-w-[560px] text-lg text-[var(--text-secondary)]">
            {t('landing.steps.subtitle')}
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Dashed line connecting steps (desktop) */}
          <div className="absolute left-[16.67%] right-[16.67%] top-8 hidden border-t-2 border-dashed border-[var(--border-color)] md:block" />
          {STEPS.map((num, i) => (
            <StepItem
              key={num}
              number={num}
              title={t(`landing.steps.items.${i}.title`)}
              description={t(`landing.steps.items.${i}.desc`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative z-[1] text-center">
      <div className="relative mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cyan-subtle)] text-3xl font-bold tabular-nums text-[var(--cyan)] shadow-[0_0_0_6px_var(--bg-base)]">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  )
}
