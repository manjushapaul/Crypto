"use client";

import { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import Card from "./Card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React component errors
 * Provides a fallback UI when a component fails to render
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console or error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-danger/20 bg-red-50 dark:bg-red-950/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-danger" />
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-[#1E293B] dark:text-gray-100">
                Something went wrong
              </h3>
              <p className="text-xs text-[#64748B] dark:text-gray-400">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}




