import { useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

interface UseMultiStepUrlOptions {
  totalSteps: number
  paramName?: string
}

/**
 * Sincroniza el paso actual de un formulario multi-step con ?step=N en la URL.
 *
 * - Browser back/forward navega entre pasos.
 * - Refresh mantiene el paso actual en la URL (aunque los datos del form se pierden).
 * - Guard contra skip: no permite ir a un step mayor que maxReachedStep + 1.
 * - Si el step en la URL es invalido o mayor al maximo alcanzado, se corrige a 1.
 */
export function useMultiStepUrl({ totalSteps, paramName = 'step' }: UseMultiStepUrlOptions) {
  const [searchParams, setSearchParams] = useSearchParams()
  const maxReachedStep = useRef(1)

  const rawStep = parseInt(searchParams.get(paramName) || '1', 10)
  const currentStep = isValidStep(rawStep, totalSteps, maxReachedStep.current) ? rawStep : 1

  // Sincronizar maxReachedStep con el step actual valido
  if (currentStep > maxReachedStep.current) {
    maxReachedStep.current = currentStep
  }

  const goToStep = useCallback(
    (step: number) => {
      const clamped = Math.max(1, Math.min(step, totalSteps))
      if (clamped > maxReachedStep.current + 1) return

      if (clamped > maxReachedStep.current) {
        maxReachedStep.current = clamped
      }

      setSearchParams({ [paramName]: String(clamped) }, { replace: false })
    },
    [totalSteps, paramName, setSearchParams],
  )

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setSearchParams({ [paramName]: String(currentStep - 1) }, { replace: false })
    }
  }, [currentStep, paramName, setSearchParams])

  const resetToFirstStep = useCallback(() => {
    maxReachedStep.current = 1
    setSearchParams({ [paramName]: '1' }, { replace: true })
  }, [paramName, setSearchParams])

  return { currentStep, goToStep, goBack, resetToFirstStep } as const
}

function isValidStep(step: number, totalSteps: number, maxReached: number): boolean {
  return Number.isInteger(step) && step >= 1 && step <= totalSteps && step <= maxReached + 1
}
