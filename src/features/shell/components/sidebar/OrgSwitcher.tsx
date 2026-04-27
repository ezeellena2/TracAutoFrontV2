import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ChevronsUpDown, ArrowLeftRight } from 'lucide-react'
import { useSessionStore } from '@/stores/session-store'
import { useClickOutside } from '@/shared/hooks/useClickOutside'

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase()
}

interface DropdownProps {
  onClose: () => void
}

function OrgDropdown({ onClose }: DropdownProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleSwitch() {
    onClose()
    navigate('/app/selector')
  }

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border-subtle bg-surface-secondary shadow-lg">
      <p className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
        {t('shell.orgSwitcher.changeLabel')}
      </p>
      <button
        type="button"
        onClick={handleSwitch}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
      >
        <ArrowLeftRight className="h-4 w-4 shrink-0" />
        {t('shell.orgSwitcher.changeOrg')}
      </button>
    </div>
  )
}

interface Props {
  collapsed: boolean
}

export function OrgSwitcher({ collapsed }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const orgNombre = useSessionStore(s => s.organizacionActiva?.nombre ?? '')
  const esMicroOrg = useSessionStore(s => s.organizacionActiva?.esMicroOrg)
  const rol = useSessionStore(s => s.organizacionActiva?.rol ?? '')

  useClickOutside(ref, () => setOpen(false))

  if (collapsed) return null

  const initials = getInitials(orgNombre)
  const tipo = esMicroOrg ? t('shell.orgSwitcher.personal') : t('shell.orgSwitcher.empresa')

  return (
    <div ref={ref} className="relative mx-3 my-2">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-surface-tertiary"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10 text-xs font-semibold text-brand-cyan">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">{orgNombre}</p>
          <p className="truncate text-xs text-text-tertiary">{tipo} · {rol}</p>
        </div>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
      </button>
      {open ? <OrgDropdown onClose={() => setOpen(false)} /> : null}
    </div>
  )
}
