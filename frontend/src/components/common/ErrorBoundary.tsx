import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const { fallbackTitle, fallbackMessage } = this.props;

      return (
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            background: 'var(--background)',
          }}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '1px solid rgba(239, 68, 68, 0.35)',
              }}
            >
              <AlertTriangle size={34} />
            </div>

            <h2
              style={{
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.75rem',
              }}
            >
              {fallbackTitle || 'Something went wrong'}
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              {fallbackMessage ||
                'We ran into an unexpected issue while rendering this section. Your account and booking data are safe.'}
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={this.handleReset}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.25rem', gap: '0.5rem' }}
              >
                <RefreshCw size={16} /> Try Again
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem', gap: '0.5rem' }}
              >
                <Home size={16} /> Go to Home
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-outline"
                style={{ padding: '0.75rem 1.25rem', gap: '0.5rem' }}
              >
                Reload Page
              </button>
            </div>

            {this.state.error && (
              <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem 0',
                    margin: '0 auto',
                  }}
                >
                  {this.state.showDetails ? (
                    <>
                      Hide Error Details <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Show Technical Details <ChevronDown size={14} />
                    </>
                  )}
                </button>

                {this.state.showDetails && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem',
                      color: '#f87171',
                      overflowX: 'auto',
                      fontFamily: 'monospace',
                      lineHeight: 1.5,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      maxHeight: '180px',
                    }}
                  >
                    <strong>Error:</strong> {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
