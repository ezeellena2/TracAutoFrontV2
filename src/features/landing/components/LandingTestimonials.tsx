import { useTranslation } from 'react-i18next'

const TESTIMONIALS = [
  { key: '0', initials: 'CM', bgColor: 'var(--cyan-muted)', textColor: 'var(--cyan)' },
  { key: '1', initials: 'LP', bgColor: 'var(--amber-muted)', textColor: 'var(--amber)' },
  { key: '2', initials: 'MG', bgColor: 'var(--success-muted)', textColor: 'var(--success)' },
]

export function LandingTestimonials() {
  const { t } = useTranslation()

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
            {t('landing.testimonials.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((tm) => (
            <TestimonialCard
              key={tm.key}
              initials={tm.initials}
              bgColor={tm.bgColor}
              textColor={tm.textColor}
              quote={t(`landing.testimonials.items.${tm.key}.quote`)}
              name={t(`landing.testimonials.items.${tm.key}.name`)}
              role={t(`landing.testimonials.items.${tm.key}.role`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  initials, bgColor, textColor, quote, name, role,
}: {
  initials: string; bgColor: string; textColor: string; quote: string; name: string; role: string
}) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6">
      <p className="mb-5 text-base italic leading-relaxed text-[var(--text-primary)]">
        <span style={{ color: 'var(--cyan)' }}>&ldquo;</span>
        {quote}
        <span style={{ color: 'var(--cyan)' }}>&rdquo;</span>
      </p>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: bgColor, color: textColor }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">{name}</div>
          <div className="text-xs text-[var(--text-secondary)]">{role}</div>
        </div>
      </div>
    </div>
  )
}
