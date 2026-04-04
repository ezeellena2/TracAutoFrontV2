import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const FEATURES = [
  { key: 'gps', icon: '\uD83D\uDCCD' },
  { key: 'alerts', icon: '\uD83D\uDD14' },
  { key: 'history', icon: '\uD83D\uDDFA\uFE0F' },
  { key: 'status', icon: '\uD83D\uDCCA' },
]

export function LandingB2C() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        <B2CFeatures />
        <PhoneMock />
      </div>
    </section>
  )
}

function B2CFeatures() {
  const { t } = useTranslation()
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
          {t('landing.b2c.title')}
        </h2>
        <p className="text-lg text-[var(--text-secondary)]">{t('landing.b2c.subtitle')}</p>
      </div>
      <div className="flex flex-col gap-6">
        {FEATURES.map((f) => (
          <div key={f.key} className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--cyan-subtle)] text-xl">
              {f.icon}
            </div>
            <div>
              <h4 className="mb-1 text-base font-semibold text-[var(--text-primary)]">
                {t(`landing.b2c.features.${f.key}.title`)}
              </h4>
              <p className="text-sm text-[var(--text-secondary)]">
                {t(`landing.b2c.features.${f.key}.desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          to="/auth/registro"
          className="inline-block rounded-xl bg-[var(--amber)] px-6 py-3 text-sm font-semibold text-[var(--amber-text)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
        >
          {t('landing.b2c.cta')}
        </Link>
      </div>
    </div>
  )
}

function PhoneMock() {
  const { t } = useTranslation()

  return (
    <div className="flex justify-center">
      <div className="relative w-[260px] rounded-[36px] border-2 border-[var(--border-color)] bg-[var(--surface-1)] p-3">
        {/* Notch */}
        <div className="absolute left-1/2 top-3 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[var(--surface-3)]" />
        <div className="overflow-hidden rounded-[28px] bg-[var(--bg-base)] px-4 pb-6 pt-8">
          {/* Mini map */}
          <div className="relative mb-4 h-[200px] overflow-hidden rounded-lg bg-[var(--surface-2)]">
            <div
              className="absolute inset-0"
              style={{
                background: [
                  'repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(6,182,212,0.06) 16px, rgba(6,182,212,0.06) 17px)',
                  'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(6,182,212,0.06) 16px, rgba(6,182,212,0.06) 17px)',
                ].join(','),
              }}
            />
            <div className="tracking-point" style={{ top: '40%', left: '50%' }} />
          </div>
          <PhoneStatusCard
            color="var(--success)"
            text={t('landing.b2c.mock.engineOn')}
            sub={t('landing.b2c.mock.location')}
          />
          <PhoneStatusCard
            color="var(--cyan)"
            text={t('landing.b2c.mock.speedValue')}
            sub={t('landing.b2c.mock.speedLabel')}
          />
          <PhoneStatusCard
            color="var(--amber)"
            text={t('landing.b2c.mock.batteryValue')}
            sub={t('landing.b2c.mock.batteryLabel')}
          />
        </div>
      </div>
    </div>
  )
}

function PhoneStatusCard({ color, text, sub }: { color: string; text: string; sub: string }) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--surface-1)] p-3">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <div>
        <div className="text-xs text-[var(--text-primary)]">{text}</div>
        <div className="text-[11px] text-[var(--text-secondary)]">{sub}</div>
      </div>
    </div>
  )
}
