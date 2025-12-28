import { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminLogin({ onLoginSuccess }) {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Pasar datos al componente padre (AppContext se encargará de localstorage)
            onLoginSuccess({ ...data.user, token: data.token });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, var(--primary), #EC4899)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <ShieldCheck size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Panel</h1>
                    <p style={{ color: 'var(--text-light)' }}>Tlapa Comida</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        background: '#FEE2E2',
                        color: '#991B1B',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            Usuario
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="admin"
                            value={loginData.username}
                            onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                            required
                            autoFocus
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: loading ? '#94A3B8' : undefined
                        }}
                    >
                        {loading ? (
                            'Iniciando sesión...'
                        ) : (
                            <>
                                <LogIn size={18} />
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Note */}
                <p style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#94A3B8'
                }}>
                    Solo administradores autorizados
                </p>
            </div>
        </div>
    );
}
