import { useSessionStore } from '@/stores/session-store'
import { NAV_CONFIG, type NavItem } from '../../nav-config'
import { SidebarNavLabel } from './SidebarNavLabel'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarNavGroup } from './SidebarNavGroup'

interface Props {
  collapsed: boolean
}

export function SidebarNav({ collapsed }: Props) {
  const modulos = useSessionStore(s => s.organizacionActiva?.modulos ?? [])

  function isVisible(item: NavItem): boolean {
    if (item.type === 'label') return true
    if (!('module' in item) || !item.module) return true
    return modulos.includes(item.module)
  }

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto py-2">
      {NAV_CONFIG.filter(isVisible).map((item, i) =>
        item.type === 'label' ? (
          <SidebarNavLabel key={i} item={item} collapsed={collapsed} />
        ) : item.type === 'link' ? (
          <SidebarNavItem key={item.key} item={item} collapsed={collapsed} />
        ) : (
          <SidebarNavGroup key={item.key} item={item} collapsed={collapsed} />
        )
      )}
    </nav>
  )
}
