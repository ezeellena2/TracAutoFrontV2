import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'
import { appConfig } from '@/config/env'
import { getHttpSessionBridge } from '@/services/session/http-session-bridge'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _tracautoRetried?: boolean
}

let refreshPromise: Promise<string | null> | null = null

function attachHeaders(
  config: InternalAxiosRequestConfig,
  accessToken: string | null,
) {
  const headers = AxiosHeaders.from(config.headers)
  headers.set('Accept', 'application/json')
  headers.set('X-TracAuto-Client', 'web')

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  } else {
    headers.delete('Authorization')
  }

  config.headers = headers
  return config
}

export const httpClient = axios.create({
  baseURL: appConfig.accessApiBaseUrl,
  timeout: 15_000,
  withCredentials: true,
})

httpClient.interceptors.request.use((config) => {
  const token = getHttpSessionBridge().getAccessToken()
  return attachHeaders(config, token)
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestConfig = error.config as RetriableRequestConfig | undefined

    if (!requestConfig || !error.response) {
      return Promise.reject(error)
    }

    if (
      error.response.status !== 401 ||
      requestConfig._tracautoRetried ||
      requestConfig.url?.includes('/api/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    const bridge = getHttpSessionBridge()

    if (!bridge.refreshSession) {
      bridge.clearSession?.()
      return Promise.reject(error)
    }

    refreshPromise ??= bridge.refreshSession().finally(() => {
      refreshPromise = null
    })

    try {
      const nextAccessToken = await refreshPromise

      if (!nextAccessToken) {
        bridge.clearSession?.()
        return Promise.reject(error)
      }

      requestConfig._tracautoRetried = true
      return httpClient(attachHeaders(requestConfig, nextAccessToken))
    } catch (refreshError) {
      bridge.clearSession?.()
      return Promise.reject(refreshError)
    }
  },
)
