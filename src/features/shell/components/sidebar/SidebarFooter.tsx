import { useTranslation } from 'react-i18next'
import { LogOut } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useSessionStore } from '@/stores/session-store'
import { useLogout } from '@/features/access/hooks/useLogout'

function getUserInitials(nombre: string, apellido: string): string {
  return ((nombre[0] ?? '') + (apellido[0] ?? '')).toUpperCase()
}

interface Props {
  collapsed: boolean
}

export function SidebarFooter({ collapsed }: Props) {
  const { t } = useTranslation()
  const nombre = useSessionStore(s => s.snapshot?.nombre ?? '')
  const apellido = useSessionStore(s => s.snapshot?.apellido ?? '')
  const email = useSessionStore(s => s.snapshot?.email ?? '')
  const logoutMutation = useLogout()

  const initials = getUserInitials(nombre, apellido)

  return (
    <div className="border-t border-border-subtle p-3">
      <div className={cn('flex items-center gap-2.5', collapsed && 'flex-col gap-1.5')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-xs font-medium text-text-secondary">
          {initials}
        </div>
        {collapsed ? null : (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{nombre} {apellido}</p>
            <p className="truncate text-xs text-text-tertiary">{email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          aria-label={t('shell.header.logout')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-danger disabled:cursor-wait disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
