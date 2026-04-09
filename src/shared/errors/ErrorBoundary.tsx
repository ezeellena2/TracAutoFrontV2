import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { ErrorFallback } from './ErrorFallback'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Captura errores de renderizado en el subarbol y muestra un fallback
 * en lugar de desmontar toda la aplicacion.
 *
 * React requiere class component para componentDidCatch.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleReset = (): void => {
    this.props.onReset?.()
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
  }
}
