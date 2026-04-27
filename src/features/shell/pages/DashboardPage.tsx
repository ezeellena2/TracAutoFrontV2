import { useDashboardState } from '../hooks/useDashboardState'
import { DashboardOnboarding } from '../components/dashboard/DashboardOnboarding'
import { DashboardHasData } from '../components/dashboard/DashboardHasData'

export function DashboardPage() {
  const { hasData, markHasData } = useDashboardState()

  return hasData ? (
    <DashboardHasData />
  ) : (
    <DashboardOnboarding onComplete={markHasData} />
  )
}
