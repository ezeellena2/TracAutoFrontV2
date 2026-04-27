import { useState } from 'react'

const STORAGE_KEY = 'tracauto-v2-has-data'

export function useDashboardState() {
  const [hasData, setHasData] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )

  function markHasData() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setHasData(true)
  }

  return { hasData, markHasData }
}
