import { useEffect } from 'react'
import { usePreferencesStore } from '@/stores/preferences-store'

/**
 * Sincroniza el tema activo del store con el atributo `data-theme` en <html>.
 * Dark = default (sin atributo). Light = `data-theme="light"`.
 * Se invoca una vez en el componente raiz (App.tsx).
 */
export function useThemeSync() {
  const theme = usePreferencesStore((s) => s.theme)

  useEffect(function syncThemeAttribute() {
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])
}
