import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || 'An unexpected error occurred.';
      let isPermissionError = false;

      try {
        // Check if it's our structured Firestore error
        const parsedError = JSON.parse(errorMessage);
        if (parsedError.error && parsedError.error.includes('Missing or insufficient permissions')) {
          isPermissionError = true;
          errorMessage = "Permission Denied: You do not have access to perform this action. Please ensure you are logged in and have the correct Firestore Security Rules configured.";
        }
      } catch (e) {
        // Not a JSON string, ignore
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="bg-error/10 text-error p-6 rounded-2xl max-w-md w-full flex flex-col items-center text-center space-y-4 border border-error/20">
            <AlertTriangle className="w-12 h-12" />
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="text-sm opacity-90">{errorMessage}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2 bg-error text-white rounded-xl font-semibold hover:bg-error/90 transition-colors mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
