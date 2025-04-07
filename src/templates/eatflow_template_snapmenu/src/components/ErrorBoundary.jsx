import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
              <details className="bg-white p-4 rounded border border-gray-200 mb-4">
                <summary className="font-semibold cursor-pointer mb-2">Error Details</summary>
                <p className="text-red-600 mb-2">{this.state.error && this.state.error.toString()}</p>
                <div className="mt-4 bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  <pre className="text-sm text-gray-800">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
              <p className="mb-4">
                Please try refreshing the page. If the problem persists, contact support.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
