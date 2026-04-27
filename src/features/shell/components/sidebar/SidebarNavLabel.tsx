import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'
import type { NavLabelItem } from '../../nav-config'

interface Props {
  item: NavLabelItem
  collapsed: boolean
}

export function SidebarNavLabel({ item, collapsed }: Props) {
  const { t } = useTranslation()

  if (collapsed) return null

  return (
    <div className={cn('px-4 pb-1 pt-1 text-xs font-medium uppercase tracking-wider text-text-tertiary', item.topMargin && 'mt-6')}>
      {t(item.labelKey)}
    </div>
  )
}
