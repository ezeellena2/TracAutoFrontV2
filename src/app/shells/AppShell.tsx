import { Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeftRight, LogOut } from 'lucide-react'
import { useSessionStore } from '@/stores/session-store'
import { useLogout } from '@/features/access/hooks/useLogout'
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher'

/**
 * Shell autenticado. Envuelto por ProtectedRoute.
 * Header con: org activa + selector de contexto + nombre del usuario + logout.
 */
export function AppShell() {
  const { t } = useTranslation()
  const nombre = useSessionStore((s) => s.snapshot?.nombre)
  const apellido = useSessionStore((s) => s.snapshot?.apellido)
  const orgNombre = useSessionStore((s) => s.organizacionActiva?.nombre)
  const logoutMutation = useLogout()

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-canvas)]">
      <header className="flex items-center justify-between border-b border-[var(--color-surface-2)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {orgNombre}
          </span>
          <Link
            to="/app/selector"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-1)] hover:text-[var(--color-brand-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-canvas)]"
            aria-label={t('context.selector.switchLabel')}
          >
            <ArrowLeftRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {nombre} {apellido}
          </span>
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-1)] hover:text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-canvas)] disabled:cursor-wait disabled:opacity-50"
            aria-label={t('app.logout')}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
