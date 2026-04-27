import { useState } from 'react'

const STORAGE_KEY = 'tracauto-v2-sidebar-collapsed'

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )

  function toggle() {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return { collapsed, toggle }
}
