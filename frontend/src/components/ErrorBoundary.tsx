import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
            <div className="rounded-lg bg-red-100 p-6 text-center text-red-700 shadow-lg">
              <h2 className="mb-2 text-2xl font-bold">Something went wrong.</h2>
              <p className="mb-4">Please try refreshing the page or go back home.</p>
              <Link
                to="/"
                className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
