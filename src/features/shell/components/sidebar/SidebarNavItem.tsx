import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import type { NavLinkItem } from '../../nav-config'

interface Props {
  item: NavLinkItem
  collapsed: boolean
}

export function SidebarNavItem({ item, collapsed }: Props) {
  const { t } = useTranslation()
  const Icon = item.icon
  const label = t(item.labelKey)

  return (
    <NavLink
      to={item.path}
      end={item.key === 'dashboard'}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'mx-2 flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
          'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
          isActive && 'bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/15 hover:text-brand-cyan',
          collapsed && 'justify-center px-0'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {collapsed ? null : <span>{label}</span>}
    </NavLink>
  )
}
