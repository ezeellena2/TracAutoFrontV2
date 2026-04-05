/**
 * Adapter compartido para Google Identity Services.
 * Carga el script de GIS dinamicamente y expone funciones puras.
 * Ningun componente ni pagina debe inicializar GIS en linea.
 */

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string
            callback: (response: { credential: string }) => void
          }): void
          prompt(callback?: (notification: unknown) => void): void
        }
      }
    }
  }
}

let scriptLoaded = false
let scriptLoading: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve()
  if (scriptLoading) return scriptLoading

  scriptLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    script.onerror = () => {
      scriptLoading = null
      reject(new Error('No se pudo cargar Google Identity Services'))
    }
    document.head.appendChild(script)
  })

  return scriptLoading
}

/**
 * Inicializa GIS y abre el popup/prompt de Google Sign-In.
 * Llama onCredential con el ID token JWT cuando el usuario se autentica.
 */
export async function promptGoogleSignIn(
  clientId: string,
  onCredential: (credential: string) => void,
): Promise<void> {
  await loadScript()

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: { credential: string }) =>
      onCredential(response.credential),
  })

  window.google.accounts.id.prompt()
}
