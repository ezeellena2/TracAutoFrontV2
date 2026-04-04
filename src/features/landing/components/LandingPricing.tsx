import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

export function LandingPricing() {
  const { t } = useTranslation()

  return (
    <section className="py-20" id="planes">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
            {t('landing.pricing.title')}
          </h2>
          <p className="mx-auto max-w-[560px] text-lg text-[var(--text-secondary)]">
            {t('landing.pricing.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          <PricingCard planKey="personal" to="/auth/registro" />
          <PricingCard planKey="profesional" to="/auth/registro-empresa" featured />
          <PricingCard planKey="enterprise" to="#contacto" isAnchor />
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  planKey,
  to,
  featured,
  isAnchor,
}: {
  planKey: string
  to: string
  featured?: boolean
  isAnchor?: boolean
}) {
  const { t } = useTranslation()
  const rawFeatures = t(`landing.pricing.plans.${planKey}.features`, { returnObjects: true })
  const features: string[] = Array.isArray(rawFeatures) ? rawFeatures : []

  const cardClass = featured
    ? 'relative border-[var(--cyan)] shadow-[var(--shadow-cyan)] scale-[1.02] mt-3.5'
    : 'border-[var(--border-color)]'

  const LinkOrAnchor = isAnchor ? 'a' : Link

  return (
    <div className={`flex flex-col rounded-xl border bg-[var(--surface-1)] p-8 transition-all ${cardClass}`}>
      {featured ? (
        <div className="absolute -top-3.5 left-1/2 z-[2] -translate-x-1/2">
          <span className="rounded-full border-2 border-[var(--cyan)] bg-[var(--bg-base)] px-4 py-1 text-xs font-semibold text-[var(--cyan)]">
            {t('landing.pricing.popular')}
          </span>
        </div>
      ) : null}
      <div className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
        {t(`landing.pricing.plans.${planKey}.name`)}
      </div>
      <div className="mb-1 text-4xl font-bold tabular-nums text-[var(--text-primary)]">
        {t(`landing.pricing.plans.${planKey}.price`)}
        {planKey === 'profesional' ? (
          <span className="text-base font-normal text-[var(--text-secondary)]">
            {t('landing.pricing.perMonth')}
          </span>
        ) : null}
      </div>
      <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
        {t(`landing.pricing.plans.${planKey}.desc`)}
      </p>
      <div className="mb-6 flex flex-1 flex-col gap-3">
        {features.map((feat) => (
          <div key={feat} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Check className="h-4 w-4 shrink-0 text-[var(--cyan)]" />
            {feat}
          </div>
        ))}
      </div>
      <LinkOrAnchor
        to={to}
        href={to}
        className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] ${
          isAnchor
            ? 'border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
            : 'bg-[var(--amber)] text-[var(--amber-text)]'
        }`}
      >
        {t(`landing.pricing.plans.${planKey}.cta`)}
      </LinkOrAnchor>
    </div>
  )
}
