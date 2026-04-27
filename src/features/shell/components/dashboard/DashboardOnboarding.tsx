import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'
import { WizardStep1 } from './WizardStep1'
import { WizardStep2 } from './WizardStep2'
import { WizardStep3 } from './WizardStep3'

interface StepIndicatorProps {
  step: number
  current: number
  label: string
}

function StepIndicator({ step, current, label }: StepIndicatorProps) {
  const done = step < current
  const active = step === current
  return (
    <div className={cn('flex items-center gap-2 text-sm', active && 'font-medium text-text-primary', !active && !done && 'text-text-tertiary', done && 'text-text-secondary')}>
      <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold', active && 'bg-brand-cyan text-bg-canvas', done && 'bg-success/20 text-success', !active && !done && 'bg-surface-tertiary text-text-tertiary')}>
        {step}
      </span>
      {label}
    </div>
  )
}

function WizardStepIndicators({ current }: { current: number }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-3">
      <StepIndicator step={1} current={current} label={t('shell.dashboard.onboarding.step1Label')} />
      <span className="h-px flex-1 bg-border-subtle" />
      <StepIndicator step={2} current={current} label={t('shell.dashboard.onboarding.step2Label')} />
      <span className="h-px flex-1 bg-border-subtle" />
      <StepIndicator step={3} current={current} label={t('shell.dashboard.onboarding.step3Label')} />
    </div>
  )
}

interface Props {
  onComplete: () => void
}

export function DashboardOnboarding({ onComplete }: Props) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)

  return (
    <section className="mx-auto max-w-2xl" aria-label={t('shell.dashboard.onboarding.kicker')}>
      <div className="mb-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-brand-cyan">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
          {t('shell.dashboard.onboarding.kicker')}
        </p>
        <h1 className="text-xl font-semibold text-text-primary">{t('shell.dashboard.onboarding.title')}</h1>
        <p className="mt-1.5 text-sm text-text-secondary">{t('shell.dashboard.onboarding.subtitle')}</p>
        <div className="mt-5">
          <WizardStepIndicators current={step} />
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface-primary p-6 shadow-sm">
        {step === 1 ? <WizardStep1 onNext={() => setStep(2)} onCancel={onComplete} /> : null}
        {step === 2 ? <WizardStep2 onNext={() => setStep(3)} onSkip={() => setStep(3)} /> : null}
        {step === 3 ? <WizardStep3 onFinish={onComplete} onSkip={onComplete} /> : null}
      </div>
    </section>
  )
}
