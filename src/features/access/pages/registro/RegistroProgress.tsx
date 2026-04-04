interface RegistroProgressProps {
  currentStep: number
  totalSteps: number
}

/**
 * Barra de progreso del registro multi-step.
 * Segmentos: completado (cyan), activo (cyan), pendiente (surface-3).
 */
export function RegistroProgress({ currentStep, totalSteps }: RegistroProgressProps) {
  return (
    <div className="mb-10">
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isActive = step === currentStep
          return (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-colors ${
                isCompleted
                  ? 'bg-[var(--color-brand-cyan)]'
                  : isActive
                    ? 'bg-[var(--color-brand-cyan)]'
                    : 'bg-[var(--color-surface-3)]'
              }`}
            />
          )
        })}
      </div>
      <p className="mt-2 text-right text-sm tabular-nums text-[var(--color-text-tertiary)]">
        {currentStep} / {totalSteps}
      </p>
    </div>
  )
}
