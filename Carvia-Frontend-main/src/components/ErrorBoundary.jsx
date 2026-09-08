import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="app-error">
          <p>Application Error</p>
          <h1>Something went wrong.</h1>
          <span>We've encountered an unexpected error. Please reload the page to continue.</span>
          <button onClick={() => window.location.reload()}>Reload Workspace</button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
