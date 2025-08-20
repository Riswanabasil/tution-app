import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Link } from "react-router-dom";


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
    // Switch state so fallback UI is displayed
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Here you can log errors to your backend
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
              <p className="mb-4">Please try refreshing the page or go back home.</p>
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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
