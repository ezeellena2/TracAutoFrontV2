import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { NavGroupItem, NavSubItem } from '../../nav-config'

interface SubItemsProps {
  items: NavSubItem[]
}

function GroupSubItems({ items }: SubItemsProps) {
  const { t } = useTranslation()
  return (
    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border-subtle pl-3">
      {items.map(sub => (
        <NavLink
          key={sub.key}
          to={sub.path}
          className={({ isActive }) =>
            cn(
              'block rounded-lg px-3 py-1.5 text-sm transition-colors',
              'text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary',
              isActive && 'bg-brand-cyan/10 text-brand-cyan'
            )
          }
        >
          {t(sub.labelKey)}
        </NavLink>
      ))}
    </div>
  )
}

interface Props {
  item: NavGroupItem
  collapsed: boolean
}

export function SidebarNavGroup({ item, collapsed }: Props) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const Icon = item.icon
  const label = t(item.labelKey)
  const containsActive = item.items.some(s => pathname.startsWith(s.path))
  const [open, setOpen] = useState(containsActive)

  useEffect(function syncOpenWithActive() {
    if (containsActive) setOpen(true)
  }, [containsActive])

  return (
    <div className="mx-2">
      <button
        type="button"
        title={collapsed ? label : undefined}
        onClick={() => { if (!collapsed) setOpen(prev => !prev) }}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
          'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
          containsActive && 'text-brand-cyan',
          collapsed && 'justify-center px-0'
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {collapsed ? null : <span className="flex-1 text-left">{label}</span>}
        {collapsed ? null : (
          <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 text-text-tertiary transition-transform', open && 'rotate-90')} />
        )}
      </button>
      {!collapsed && open ? <GroupSubItems items={item.items} /> : null}
    </div>
  )
}
