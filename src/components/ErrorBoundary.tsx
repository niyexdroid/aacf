"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the entire app
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught an error:", error, errorInfo);
    }

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
              Something went wrong
            </h2>

            <p className="mb-6 text-center text-gray-600">
              We encountered an unexpected error. Please try refreshing the page
              or return to the home page.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-4 rounded bg-red-50 p-3">
                <p className="text-sm font-medium text-red-800">
                  Error Details:
                </p>
                <p className="mt-1 break-all font-mono text-xs text-red-700">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                className="flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simplified Error Boundary for inline use
 */
export function SimpleErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Unable to load this content. Please try again later.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
