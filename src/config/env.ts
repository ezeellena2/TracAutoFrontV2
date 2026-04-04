const DEFAULT_ACCESS_API_BASE_URL = 'https://localhost:7201'
const DEFAULT_LOCALE = 'es-AR'

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

export const appConfig = {
  accessApiBaseUrl: trimTrailingSlash(
    import.meta.env.VITE_ACCESS_API_BASE_URL ?? DEFAULT_ACCESS_API_BASE_URL,
  ),
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE ?? DEFAULT_LOCALE,
  runtimeEnvironment: import.meta.env.MODE,
} as const
