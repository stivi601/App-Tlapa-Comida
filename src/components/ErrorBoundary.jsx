import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div style={{ padding: '20px', textAlign: 'center', background: '#FEF2F2', border: '1px solid #EF4444', borderRadius: '8px', color: '#B91C1C' }}>
                    <h3>Algo salió mal.</h3>
                    <p style={{ fontSize: '0.9rem' }}>{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#EF4444', color: 'white', cursor: 'pointer' }}
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
