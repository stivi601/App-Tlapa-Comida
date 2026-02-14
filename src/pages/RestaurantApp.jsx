import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { ChefHat, CheckCircle, Clock, ArrowRight, Plus, Utensils, X, Image, ChevronDown, ChevronUp, Camera, Trash2, Lock, Bell, Settings } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('tu-dominio'))
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

export default function RestaurantApp() {
    const {
        orders, updateOrderStatus, restaurants,
        addMenuItem, removeMenuItem, removeMenuCategory,
        loginRestaurant, restaurantUser, setRestaurantUser,
        addOrderLocal, updateOrderLocal
    } = useApp();

    const { socket } = useSocket();
    const audioRef = useRef(null);

    // Form / Navigation State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'config'
    const [showAddForm, setShowAddForm] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', desc: '', image: null });

    // Local Orders for polling fallback or direct server data
    const [myOrders, setMyOrders] = useState([]);

    const myRestaurantId = restaurantUser?.id;
    const myRestaurant = restaurants.find(r => r.id === myRestaurantId) || restaurantUser;

    const fetchOrders = async () => {
        if (!restaurantUser?.token) return;
        try {
            const res = await fetch(`${API_URL}/api/orders/my-orders`, {
                headers: { 'Authorization': `Bearer ${restaurantUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    const formatted = data.map(o => ({
                        ...o,
                        customer: o.customer?.name || "Cliente",
                        items: o.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')
                    }));
                    setMyOrders(formatted);
                }
            }
        } catch (e) {
            console.error("Error polling orders", e);
        }
    };

    // Initial Fetch & Poll
    useEffect(() => {
        if (restaurantUser) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 10000);
            return () => clearInterval(interval);
        }
    }, [restaurantUser]);

    // Socket implementation
    useEffect(() => {
        if (!socket || !restaurantUser) return;

        socket.on('new_order', (data) => {
            const order = data.order || data;
            const formatted = {
                ...order,
                time: "Ahora mismo",
                customer: order.customer?.name || "Cliente",
                items: order.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ') || "Items"
            };

            // Update both local and global context if needed
            addOrderLocal(formatted);
            setMyOrders(prev => [formatted, ...prev]);

            if (audioRef.current) audioRef.current.play().catch(console.log);
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('¡Nuevo Pedido!', { body: `Nuevo pedido de ${formatted.customer}` });
            }
        });

        socket.on('order_completed', (order) => {
            updateOrderLocal(order);
            setMyOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'COMPLETED' } : o));
        });

        return () => {
            socket.off('new_order');
            socket.off('order_completed');
        };
    }, [socket, restaurantUser]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await loginRestaurant(username, password);
        if (!success) setLoginError('Credenciales inválidas');
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!restaurantUser?.token) return;
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${restaurantUser.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setMyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                updateOrderStatus(orderId, newStatus);
            } else {
                alert("Error al actualizar estado");
            }
        } catch (e) {
            console.error(e);
            alert("Error de conexión");
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;

        try {
            const res = await fetch(`${API_URL}/api/restaurants/${myRestaurantId}/menu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${restaurantUser.token}`
                },
                body: JSON.stringify({ ...newItem, price: Number(newItem.price) })
            });

            if (res.ok) {
                setNewItem({ name: '', price: '', category: '', desc: '', image: null });
                setShowAddForm(false);
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || "Error al agregar producto");
            }
        } catch (e) {
            alert("Error de conexión");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            time: formData.get('time'),
            deliveryFee: formData.get('deliveryFee')
        };

        try {
            const res = await fetch(`${API_URL}/api/restaurants/${myRestaurantId}/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${restaurantUser.token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert("Datos actualizados. Recargando...");
                window.location.reload();
            } else {
                alert("Error al actualizar");
            }
        } catch (e) {
            alert("Error de conexión");
        }
    };

    const handleToggleOnline = async () => {
        try {
            const newStatus = !myRestaurant.isOnline;
            const res = await fetch(`${API_URL}/api/restaurants/${myRestaurantId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${restaurantUser.token}`
                },
                body: JSON.stringify({ isOnline: newStatus })
            });
            if (res.ok) window.location.reload();
        } catch (e) { console.error(e); }
    };

    if (!restaurantUser) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '1rem' }}>
                <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: '#EFF6FF', borderRadius: '50%', color: '#3B82F6', marginBottom: '1rem' }}>
                            <ChefHat size={32} />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Acceso Restaurante</h1>
                        <p style={{ color: '#64748B' }}>Gestiona tus pedidos y menú</p>
                    </div>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" className="input" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} required />
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input type="password" className="input" placeholder="••••••" style={{ paddingLeft: '36px', width: '100%' }} value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        {loginError && <p style={{ color: '#EF4444', fontSize: '0.9rem', textAlign: 'center' }}>{loginError}</p>}
                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <audio ref={audioRef} src="/notification.wav" preload="auto" />
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', color: '#1E293B' }}>Panel de Restaurante</h1>
                    <p style={{ color: '#64748B' }}>{myRestaurant?.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={() => setRestaurantUser(null)} style={{ border: 'none', background: 'none', color: '#EF4444', fontWeight: 'bold', cursor: 'pointer' }}>Salir</button>
                    <label onClick={handleToggleOnline} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: myRestaurant?.isOnline ? '#10B981' : '#94A3B8' }}>{myRestaurant?.isOnline ? 'Abierto' : 'Cerrado'}</span>
                        <div style={{ width: '40px', height: '22px', background: myRestaurant?.isOnline ? '#10B981' : '#E2E8F0', borderRadius: '20px', position: 'relative', transition: 'all 0.3s' }}>
                            <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: myRestaurant?.isOnline ? '20px' : '2px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                        </div>
                    </label>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0' }}>
                {['orders', 'menu', 'config'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '1rem', flex: 1, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600',
                        borderBottom: activeTab === tab ? '3px solid #3B82F6' : '3px solid transparent',
                        color: activeTab === tab ? '#3B82F6' : '#94A3B8'
                    }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                ))}
            </div>

            {activeTab === 'orders' && (
                <div className="fade-in">
                    <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2rem', color: '#3B82F6' }}>{myOrders.length}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Pedidos Activos</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2rem', color: '#10B981' }}>${Math.round(myOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0))}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Venta Total</p>
                        </div>
                    </div>
                    {myOrders.map(order => (
                        <div key={order.id} className="card fade-in" style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: '600' }}>#{order.id.slice(0, 8)} - {order.customer}</span>
                                <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: '#F1F5F9' }}>{order.status}</span>
                            </div>
                            <p>{order.items}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                {order.status === 'PENDING' && <button onClick={() => handleUpdateStatus(order.id, 'PREPARING')} className="btn btn-primary" style={{ flex: 1 }}>Preparar</button>}
                                {order.status === 'PREPARING' && <button onClick={() => handleUpdateStatus(order.id, 'READY')} className="btn" style={{ flex: 1, background: '#10B981', color: 'white' }}>Listo</button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'menu' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h2>Gestión de Menú</h2>
                        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary"><Plus size={18} /> Nuevo</button>
                    </div>
                    {showAddForm && (
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input placeholder="Nombre" className="input" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                                <input placeholder="Precio" type="number" className="input" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                                <input placeholder="Categoría" className="input" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} required />
                                <textarea placeholder="Descripción" className="input" value={newItem.desc} onChange={e => setNewItem({ ...newItem, desc: e.target.value })} />
                                <button type="submit" className="btn btn-primary">Guardar</button>
                            </form>
                        </div>
                    )}
                    {/* Render menu sections here */}
                </div>
            )}

            {activeTab === 'config' && (
                <div className="fade-in card">
                    <h2 style={{ marginBottom: '1.5rem' }}>Configuración</h2>
                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input name="name" placeholder="Nombre" className="input" defaultValue={myRestaurant?.name} required />
                        <input name="time" placeholder="Tiempo entrega" className="input" defaultValue={myRestaurant?.time} required />
                        <input name="deliveryFee" placeholder="Costo Envío" type="number" className="input" defaultValue={myRestaurant?.deliveryFee} required />
                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                    </form>
                </div>
            )}
        </div>
    );
}
