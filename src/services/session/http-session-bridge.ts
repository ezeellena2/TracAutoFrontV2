export type HttpSessionBridge = {
  getAccessToken: () => string | null
  refreshSession?: () => Promise<string | null>
  clearSession?: () => void
}

const defaultBridge: HttpSessionBridge = {
  getAccessToken: () => null,
}

let currentBridge = defaultBridge

export function configureHttpSessionBridge(bridge: HttpSessionBridge) {
  currentBridge = bridge
}

export function getHttpSessionBridge() {
  return currentBridge
}
