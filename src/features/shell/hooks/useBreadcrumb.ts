import { useLocation } from 'react-router-dom'
import { NAV_CONFIG } from '../nav-config'

export interface BreadcrumbItem {
  labelKey: string
  path?: string
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const { pathname } = useLocation()

  for (const item of NAV_CONFIG) {
    if (item.type === 'label') continue

    if (item.type === 'link') {
      const isDashboard = item.key === 'dashboard' && pathname === '/app'
      const isOther = item.key !== 'dashboard' && pathname.startsWith(item.path)
      if (isDashboard || isOther) {
        return [{ labelKey: item.labelKey, path: item.path }]
      }
    }

    if (item.type === 'group') {
      const sub = item.items.find(s => pathname.startsWith(s.path))
      if (sub) {
        return [
          { labelKey: item.labelKey },
          { labelKey: sub.labelKey, path: sub.path },
        ]
      }
    }
  }

  return []
}
