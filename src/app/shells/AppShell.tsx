import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/features/shell/components/sidebar/Sidebar'
import { AppHeader } from '@/features/shell/components/AppHeader'
import { useSidebarState } from '@/features/shell/hooks/useSidebarState'

export function AppShell() {
  const { collapsed, toggle } = useSidebarState()

  return (
    <div className="flex h-screen overflow-hidden bg-bg-canvas">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
