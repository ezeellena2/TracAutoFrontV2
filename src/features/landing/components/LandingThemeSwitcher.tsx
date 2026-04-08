import { Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePreferencesStore } from '@/stores/preferences-store'

/**
 * Theme toggle para la landing — usa los mockup tokens (--text-*, --surface-*, --bg-base)
 * en lugar de los Tailwind @theme tokens para coherencia con el resto de la landing.
 */
export function LandingThemeSwitcher() {
  const { t } = useTranslation()
  const theme = usePreferencesStore((s) => s.theme)
  const setTheme = usePreferencesStore((s) => s.setTheme)

  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={t('common.theme.toggle')}
      title={theme === 'dark' ? t('common.theme.light') : t('common.theme.dark')}
      className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--amber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
