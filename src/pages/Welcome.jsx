import { useNavigate } from 'react-router-dom';
import { Utensils, Store, Bike, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'customer',
            title: 'Cliente',
            desc: 'Pide comida de tus restaurantes favoritos.',
            icon: <Utensils size={32} />,
            path: '/customer',
            color: 'var(--primary)',
            bg: '#FFF0E6'
        },
        {
            id: 'restaurant',
            title: 'Restaurante',
            desc: 'Gestiona tu menú y pedidos entrantes.',
            icon: <Store size={32} />,
            path: '/restaurant',
            color: '#3B82F6',
            bg: '#EFF6FF'
        },
        {
            id: 'delivery',
            title: 'Repartidor',
            desc: 'Entrega pedidos y gana dinero.',
            icon: <Bike size={32} />,
            path: '/delivery',
            color: '#10B981',
            bg: '#ECFDF5'
        },
        {
            id: 'admin',
            title: 'Administrador',
            desc: 'Control total de la plataforma.',
            icon: <ShieldCheck size={32} />,
            path: '/admin',
            color: '#64748B',
            bg: '#F1F5F9'
        }
    ];

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 1rem' }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="fade-in">
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Tlapa <span style={{ color: 'var(--primary)' }}>Comida</span>
                </h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                    La plataforma integral para conectar comida, restaurantes y repartidores.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                maxWidth: '1000px',
                width: '100%',
                margin: '0 auto'
            }}>
                {modules.map((m, idx) => (
                    <div
                        key={m.id}
                        className="card fade-in"
                        style={{
                            animationDelay: `${idx * 0.1}s`,
                            cursor: 'pointer',
                            border: `1px solid transparent`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                        onClick={() => navigate(m.path)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = m.color;
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            backgroundColor: m.bg,
                            color: m.color,
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {m.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{m.title}</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.5' }}>{m.desc}</p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: m.color, fontWeight: '500', fontSize: '0.9rem' }}>
                            Entrar <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                        </div>
                    </div>
                ))}
            </div>

            <footer style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                &copy; {new Date().getFullYear()} Tlapa Comida. Todos los derechos reservados.
            </footer>
        </div>
    );
}
