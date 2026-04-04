import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { setupSessionBridge } from '@/services/session/setup-session-bridge'

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  )

  // Conectar el bridge de sesion al store — una sola vez al montar
  useEffect(() => {
    setupSessionBridge()
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
