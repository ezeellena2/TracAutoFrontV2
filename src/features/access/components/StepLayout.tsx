import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function StepContainer({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-[var(--color-text-secondary)]">
          {subtitle}
        </p>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  )
}

export function StepNav({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex gap-3">{children}</div>
}

export function LoginLink() {
  const { t } = useTranslation()
  return (
    <div className="mt-6 text-center text-base text-[var(--color-text-secondary)]">
      {t('auth.registro.hasAccount')}{' '}
      <Link
        to="/auth/login"
        className="font-medium text-[var(--color-brand-cyan)] hover:underline"
      >
        {t('auth.registro.loginLink')}
      </Link>
    </div>
  )
}
