import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Props {
  collapsed: boolean
  onToggle: () => void
}

function BrandIcon() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10">
      <svg className="h-4 w-4 text-brand-cyan" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M9 23.5L20 10l11 13.5M13.5 30h13" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function BrandLink() {
  return (
    <Link to="/app" className="flex flex-1 items-center gap-2 overflow-hidden">
      <BrandIcon />
      <span className="text-sm font-semibold text-text-primary">
        Trac<span className="text-brand-cyan">Auto</span>
      </span>
    </Link>
  )
}

export function SidebarHeader({ collapsed, onToggle }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex h-14 shrink-0 items-center border-b border-border-subtle px-3">
      {collapsed ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={t('shell.sidebar.expand')}
          className="flex w-full items-center justify-center rounded-lg py-1.5 text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <>
          <BrandLink />
          <button
            type="button"
            onClick={onToggle}
            aria-label={t('shell.sidebar.collapse')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )
}
