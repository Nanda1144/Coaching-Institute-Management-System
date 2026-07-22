import { Component, type ReactNode, type ErrorInfo } from 'react'
import FallbackUI from './FallbackUI'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.props.onReset?.()
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <FallbackUI
          error={this.state.error}
          onRetry={this.handleRetry}
          title="Something went wrong"
          message="An unexpected error occurred. Please try refreshing the page."
        />
      )
    }
    return this.props.children
  }
}
