import { cn } from '@/shared/utils/cn'
import { SidebarHeader } from './SidebarHeader'
import { OrgSwitcher } from './OrgSwitcher'
import { SidebarNav } from './SidebarNav'
import { SidebarFooter } from './SidebarFooter'

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col bg-surface-primary border-r border-border-subtle transition-[width] duration-200 overflow-hidden',
        collapsed ? 'w-[60px]' : 'w-60'
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
      <OrgSwitcher collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </aside>
  )
}
