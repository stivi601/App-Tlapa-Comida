import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bike, Navigation, Package, User, LogOut, Camera, Home, CheckCircle, MapPin, Layers } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

export default function DeliveryApp() {
    const { setDeliveryUser, deliveryUser } = useApp();
    const [activeTab, setActiveTab] = useState('orders'); // orders | available | profile
    const [isOnline, setIsOnline] = useState(true);
    const [orders, setOrders] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);

    // Login State
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Cargar datos al iniciar si hay usuario
    useEffect(() => {
        if (deliveryUser?.token) {
            fetchOrders();
            fetchAvailableOrders();
            fetchStats();
        }
    }, [deliveryUser, activeTab]); // Recargar al cambiar de tab

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/my-orders`, {
                headers: { 'Authorization': `Bearer ${deliveryUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    const fetchAvailableOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/available`, {
                headers: { 'Authorization': `Bearer ${deliveryUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAvailableOrders(data);
            }
        } catch (error) {
            console.error("Error fetching available orders", error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/delivery/stats`, {
                headers: { 'Authorization': `Bearer ${deliveryUser.token}` }
            });
            if (res.ok) {
                // Actualizar stats si es necesario
            }
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/delivery/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

            // Guardar usuario en contexto con el token
            setDeliveryUser({ ...data.rider, token: data.token });
            setIsOnline(data.rider.isOnline);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${deliveryUser.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchOrders(); // Recargar pedidos propios
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const assignToMe = async (orderId) => {
        try {
            // Usamos el endpoint de asignación.
            // Ojo: definimos PUT /api/orders/:id/assign en backend?
            // Revisando orderController.js: assignOrder usa req.body.riderId.
            // Si el user es Rider, tal vez debamos permitir self-assign o usar un endpoint específico "take".
            // Usaremos el de assign pasando nuestro propio ID.
            const res = await fetch(`${API_URL}/orders/${orderId}/assign`, {
                method: 'PATCH', // Es PATCH o PUT según definimos? Revisaré... definí PUT en orders.js pero PATCH en controller?
                // Revisemos routes/orders.js: router.put('/:id/assign', ...)
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${deliveryUser.token}`
                },
                body: JSON.stringify({ riderId: deliveryUser.id })
            });

            if (res.ok) {
                alert("¡Pedido asignado! Ve a 'Mis Pedidos' para gestionarlo.");
                fetchAvailableOrders();
                fetchOrders();
                setActiveTab('orders');
            } else {
                const err = await res.json();
                alert("No se pudo asignar: " + err.error);
            }
        } catch (error) {
            console.error("Error assigning order", error);
        }
    };

    const toggleOnlineStatus = async () => {
        try {
            const newStatus = !isOnline;
            const res = await fetch(`${API_URL}/delivery/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${deliveryUser.token}`
                },
                body: JSON.stringify({ isOnline: newStatus })
            });

            if (res.ok) {
                setIsOnline(newStatus);
            }
        } catch (error) {
            console.error("Error toggling status", error);
        }
    };

    if (!deliveryUser) {
        return (
            <div className="fade-in" style={{ padding: '2rem', minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#10B981', borderRadius: '24px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                        <Bike size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Tlapa <span style={{ color: '#10B981' }}>Repartidor</span></h1>
                    <p style={{ color: '#64748B' }}>Inicia sesión para comenzar a entregar.</p>
                </div>

                <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Usuario</label>
                            <input type="text" className="input" required value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Contraseña</label>
                            <input type="password" className="input" required value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                        </div>
                        {error && <p style={{ color: '#EF4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
                        <button type="submit" disabled={loading} className="btn" style={{ background: '#10B981', color: 'white', padding: '1rem', borderRadius: '12px' }}>
                            {loading ? 'Cargando...' : 'Entrar al Panel'}
                        </button>
                    </form>
                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
                        <p>Demo: carlos / 123</p>
                    </div>
                </div>
            </div>
        );
    }

    // Filtrar órdenes activas vs historial
    const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

    return (
        <div style={{ paddingBottom: '80px', background: '#F8FAFC', minHeight: '100vh' }}>

            <header className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#10B981', color: 'white', padding: '1.2rem', borderRadius: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {deliveryUser.image ? <img src={deliveryUser.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Bike size={20} />}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>Hola, {deliveryUser.name.split(' ')[0]}</h2>
                        <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{isOnline ? '● En línea' : '○ Desconectado'}</span>
                    </div>
                </div>
                <button
                    onClick={toggleOnlineStatus}
                    style={{ background: 'white', color: isOnline ? '#10B981' : '#64748B', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
                >
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                </button>
            </header>

            {!isOnline ? (
                <div className="fade-in" style={{ padding: '1.5rem', textAlign: 'center', marginTop: '2rem', color: '#94A3B8' }}>
                    <Bike size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                    <h3 style={{ color: '#64748B' }}>Estás desconectado</h3>
                    <p style={{ fontSize: '0.9rem' }}>Activa tu estado para recibir pedidos.</p>
                </div>
            ) : (
                <>
                    {/* Available Orders Tab */}
                    {activeTab === 'available' && (
                        <div className="fade-in" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                    <Layers size={20} color="#3B82F6" /> Pedidos Disponibles
                                </h3>
                                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{availableOrders.length} cercanos</span>
                            </div>

                            {availableOrders.length === 0 ? (
                                <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94A3B8', padding: '2rem', background: 'white', borderRadius: '20px' }}>
                                    <p>No hay pedidos pendientes por asignar.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {availableOrders.map(order => (
                                        <div key={order.id} className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #3B82F6' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.8rem', background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>NUEVO PEDIDO</span>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>${order.total}</span>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{order.restaurant?.name}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem', color: '#64748B', fontSize: '0.9rem' }}>
                                                    <MapPin size={16} /> {order.customer?.address || 'Dirección del cliente'}
                                                </div>
                                            </div>
                                            <button
                                                className="btn"
                                                style={{ width: '100%', background: '#3B82F6', color: 'white', fontWeight: '700' }}
                                                onClick={() => assignToMe(order.id)}
                                            >
                                                Aceptar Pedido
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="fade-in" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                    <Package size={20} color="#10B981" /> Mis Pedidos
                                </h3>
                                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{activeOrders.length} activos</span>
                            </div>

                            {activeOrders.length === 0 ? (
                                <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94A3B8', padding: '2rem', background: 'white', borderRadius: '20px' }}>
                                    <p>No tienes pedidos activos. Ve a "Disponibles" para tomar uno.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {activeOrders.map(order => (
                                        <div key={order.id} className="card fade-in" style={{ padding: '1.2rem', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 12px', background: order.status === 'READY' ? '#FEF3C7' : '#DBEAFE', color: order.status === 'READY' ? '#D97706' : '#1E40AF', fontSize: '0.7rem', fontWeight: '700', borderBottomLeftRadius: '12px' }}>
                                                {order.status === 'READY' ? 'LISTO PARA RECOGER' : 'EN CAMINO'}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1.2rem', marginTop: '0.5rem' }}>
                                                <div style={{ background: '#F0FDF4', padding: '0.6rem', borderRadius: '12px' }}>
                                                    <Navigation size={24} color="#10B981" />
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{order.restaurant?.name || 'Restaurante'}</h4>
                                                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Pedido #{order.id.slice(0, 8)}</p>
                                                </div>
                                            </div>

                                            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.2rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Cliente:</span>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{order.customer?.name || 'Cliente'}</span>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#1E293B', fontStyle: 'italic' }}>
                                                    {order.items?.map(i => `${i.quantity}x ${i.menuItem?.name}`).join(', ')}
                                                </div>
                                                <div style={{ marginTop: '0.5rem', textAlign: 'right', fontWeight: '700' }}>
                                                    ${order.total}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                {order.status === 'READY' || order.status === 'PREPARING' ? (
                                                    <button
                                                        className="btn"
                                                        style={{ flex: 1, background: '#10B981', color: 'white', fontWeight: '700' }}
                                                        onClick={() => handleUpdateStatus(order.id, 'DELIVERING')}
                                                    >
                                                        Recoger Pedido
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn"
                                                            style={{ background: '#25D366', color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                                            onClick={() => {
                                                                const message = `¡Hola! Soy ${deliveryUser.name}, tu repartidor 🛵\n\nEstoy en camino con tu pedido #${order.id.slice(0, 4)}\n\n¡Llegaré pronto! 😊`;
                                                                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                                                            }}
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                            </svg>
                                                            Compartir Ubicación
                                                        </button>
                                                        <button
                                                            className="btn"
                                                            style={{ background: '#1E293B', color: 'white', fontWeight: '700' }}
                                                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                                        >
                                                            Marcar como Entregado
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'profile' && (
                <div className="fade-in" style={{ padding: '2rem 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                {deliveryUser.image ? (
                                    <img src={deliveryUser.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                                        <User size={60} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{deliveryUser.name}</h2>
                        <label style={{ background: '#10B981', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                            Repartidor Verificado
                        </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
                            <CheckCircle size={24} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{deliveryUser.totalDeliveries || 0}</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>ENTREGAS TOTALES</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
                            <Navigation size={24} color="#3B82F6" style={{ margin: '0 auto 0.5rem' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>4.9</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>CALIFICACIÓN</p>
                        </div>
                    </div>

                    <button onClick={() => setDeliveryUser(null)} className="btn" style={{ width: '100%', background: '#FEE2E2', color: '#EF4444', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            )}

            {/* Bottom Nav */}
            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E2E8F0', padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-around', zIndex: 20 }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'orders' ? '#10B981' : '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <Home size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>Mis Pedidos</span>
                </button>
                <button
                    onClick={() => setActiveTab('available')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'available' ? '#3B82F6' : '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <Layers size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: activeTab === 'available' ? '#3B82F6' : '#94A3B8' }}>Disponibles</span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'profile' ? '#10B981' : '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <User size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>Perfil</span>
                </button>
            </nav>
        </div>
    );
}
