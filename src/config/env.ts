const DEFAULT_ACCESS_API_BASE_URL = 'https://localhost:7201'
const DEFAULT_LOCALE = 'es-AR'
const DEFAULT_GOOGLE_CLIENT_ID =
  '644236758922-hbf6kbllem8ljmtamrhbjp1pp8r8m4ap.apps.googleusercontent.com'

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

export const appConfig = {
  accessApiBaseUrl: trimTrailingSlash(
    import.meta.env.VITE_ACCESS_API_BASE_URL ?? DEFAULT_ACCESS_API_BASE_URL,
  ),
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE ?? DEFAULT_LOCALE,
  runtimeEnvironment: import.meta.env.MODE,
  googleClientId:
    import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || DEFAULT_GOOGLE_CLIENT_ID,
} as const
