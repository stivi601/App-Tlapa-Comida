import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChefHat, CheckCircle, Clock, ArrowRight, Plus, Utensils, X, Image, ChevronDown, ChevronUp, Camera, Trash2, Lock, Settings } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('tu-dominio'))
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

export default function RestaurantApp() {
    const { orders, updateOrderStatus, restaurants, addMenuItem, removeMenuItem, removeMenuCategory, loginRestaurant } = useApp();

    // Auth State
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'

    // Form State
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', desc: '', image: null });
    const [showAddForm, setShowAddForm] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Sincronizar 'user' con la data actualizada de 'restaurants' del context (que hace polling)
    // Esto asegura que si cambia el estado isOnline o llegan items nuevos (si se gestionara centralizado), se refleje.
    // Sin embargo, las ORDENES vienen de 'orders' del context.

    // Si el usuario está logueado, actualizar su referencia
    if (user) {
        const updatedUser = restaurants.find(r => r.id === user.id);
        if (updatedUser && updatedUser !== user) {
            // Cuidado con loop infinito si la referencia cambia siempre.
            // En React simple, esto puede causar re-renders si no se controla.
            // Lo haremos solo al renderizar, tomando 'myRestaurant' derivado.
        }
    }

    const myRestaurantId = user?.id;
    const myRestaurant = restaurants.find(r => r.id === myRestaurantId) || user;

    // Filtrar órdenes para este restaurante
    const myOrders = orders.filter(o => o.restaurantId === myRestaurantId);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/restaurants/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                setUser({ ...data.restaurant, token: data.token });
                setLoginError('');
            } else {
                const err = await res.json();
                setLoginError(err.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error(error);
            setLoginError('Error de conexión');
        }
    };

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '1rem' }}>
                <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: '#EFF6FF', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1rem' }}>
                            <ChefHat size={32} />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Acceso Restaurante</h1>
                        <p style={{ color: 'var(--text-light)' }}>Gestiona tus pedidos y menú</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Usuario</label>
                            <input
                                type="text"
                                className="input"
                                style={{ width: '100%' }}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Ej. tacos_paisa"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type="password"
                                    className="input"
                                    style={{ width: '100%', paddingLeft: '36px' }}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    required
                                />
                            </div>
                        </div>

                        {loginError && <p style={{ color: '#EF4444', fontSize: '0.9rem', textAlign: 'center' }}>{loginError}</p>}

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        );
    }



    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;
        addMenuItem(myRestaurantId, {
            ...newItem,
            price: Number(newItem.price)
        });
        setNewItem({ name: '', price: '', category: '', desc: '' });
        setShowAddForm(false);
    };

    const updateRestaurant = async (data) => {
        try {
            const res = await fetch(`${API_URL}/api/restaurants/${myRestaurantId}/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                // Forzar recarga o actualizar context si fuera posible. 
                // Por simplicidad en este MVP que usa 'login' local:
                alert("Datos actualizados. Recargando...");
                window.location.reload();
            } else {
                alert("Error al actualizar");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return (
        <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Panel de Restaurante</h1>
                    <p style={{ color: 'var(--text-light)' }}>{myRestaurant?.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: myRestaurant?.isOnline ? '#10B981' : '#94A3B8' }}>
                            {myRestaurant?.isOnline ? 'Abierto' : 'Cerrado'}
                        </span>
                        <div
                            style={{
                                width: '40px', height: '22px', background: myRestaurant?.isOnline ? '#10B981' : '#E2E8F0',
                                borderRadius: '20px', position: 'relative', transition: 'all 0.3s'
                            }}
                            onClick={async () => {
                                try {
                                    const newStatus = !myRestaurant.isOnline;
                                    // Optimistic update locally (optional, but good UX)
                                    // Better to call API then refresh
                                    const res = await fetch(`${API_URL}/api/restaurants/${myRestaurantId}/status`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ isOnline: newStatus })
                                    });
                                    if (res.ok) {
                                        // Trigger global refresh if available, or force reload. 
                                        // For now we assume AppContext updates or we force a reload.
                                        window.location.reload();
                                    }
                                } catch (e) { console.error(e); }
                            }}
                        >
                            <div style={{
                                width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                                position: 'absolute', top: '2px', left: myRestaurant?.isOnline ? '20px' : '2px',
                                transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}></div>
                        </div>
                    </label>

                    <div style={{ background: '#EFF6FF', padding: '0.5rem', borderRadius: '50%', color: '#3B82F6' }}>
                        <ChefHat size={24} />
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0' }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'orders' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'orders' ? 'var(--primary)' : '#94A3B8',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                    Pedidos
                </button>
                <button
                    onClick={() => setActiveTab('menu')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'menu' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'menu' ? 'var(--primary)' : '#94A3B8',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                    Mi Menú
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'config' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'config' ? 'var(--primary)' : '#94A3B8',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                    Configuración
                </button>
            </div>

            {activeTab === 'orders' && (
                <div className="fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{myOrders.length}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Pedidos Activos</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2rem', color: '#10B981' }}>$330</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Venta Hoy</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pedidos Recientes</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {myOrders.map(order => (
                            <div key={order.id} className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600' }}>#{order.id} - {order.customer}</span>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        background: order.status === 'pending' ? '#FFF7ED' : '#F0FDF4',
                                        color: order.status === 'pending' ? '#C2410C' : '#15803D'
                                    }}>
                                        {order.status === 'pending' ? 'Pendiente' :
                                            order.status === 'preparing' ? 'En Preparación' :
                                                order.status === 'ready' ? 'Listo para Recoger' : 'Finalizado'}
                                    </span>
                                </div>

                                <div>
                                    <p style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>{order.items}</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Total: ${order.total}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    {order.status === 'pending' && (
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 1, fontSize: '0.9rem' }}
                                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                                        >
                                            <ChefHat size={16} /> Preparar
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button
                                            className="btn"
                                            style={{ flex: 1, fontSize: '0.9rem', background: '#10B981', color: 'white' }}
                                            onClick={() => updateOrderStatus(order.id, 'ready')}
                                        >
                                            <CheckCircle size={16} /> Listo para enviar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'menu' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem' }}>Gestión de Menú</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={18} /> Agregar Producto
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="card fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Nuevo Producto</h3>
                            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            placeholder="Nombre del platillo"
                                            className="input"
                                            style={{ marginBottom: '1rem', width: '100%' }}
                                            value={newItem.name}
                                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                            required
                                        />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <input
                                                type="number"
                                                placeholder="Precio"
                                                className="input"
                                                value={newItem.price}
                                                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                                required
                                            />
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    list="categories-list"
                                                    placeholder="Categoría"
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    value={newItem.category}
                                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                                    required
                                                />
                                                <datalist id="categories-list">
                                                    {Array.from(new Set(myRestaurant?.menu?.map(i => i.category))).map(cat => (
                                                        <option key={cat} value={cat} />
                                                    ))}
                                                </datalist>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', position: 'absolute', top: '100%', left: 0 }}>
                                                    Escribe nueva para crear
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Upload Area */}
                                    <div style={{ width: '100px', flexShrink: 0 }}>
                                        <label style={{
                                            width: '100%', height: '100px',
                                            border: '2px dashed #E2E8F0', borderRadius: '8px',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', overflow: 'hidden', position: 'relative',
                                            background: newItem.image ? `url(${newItem.image}) center/cover` : '#F8FAFC'
                                        }}>
                                            {!newItem.image && (
                                                <>
                                                    <Camera size={24} color="#94A3B8" />
                                                    <span style={{ fontSize: '0.6rem', color: '#94A3B8', marginTop: '4px' }}>Foto</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const url = URL.createObjectURL(file);
                                                        setNewItem({ ...newItem, image: url });
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Descripción corta"
                                    className="input"
                                    style={{ height: '80px', fontFamily: 'inherit' }}
                                    value={newItem.desc}
                                    onChange={e => setNewItem({ ...newItem, desc: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowAddForm(false)} className="btn" style={{ background: '#F1F5F9', color: 'var(--text-main)' }}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar Producto</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.entries((myRestaurant?.menu || []).reduce((acc, item) => {
                            acc[item.category] = [...(acc[item.category] || []), item];
                            return acc;
                        }, {})).map(([category, items]) => (
                            <div key={category} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingRight: '1rem',
                                    background: 'white'
                                }}>
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: 'var(--text-main)',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span>{category} <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 'normal' }}>({items.length} items)</span></span>
                                        {expandedCategory === category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`¿Eliminar categoría "${category}" y sus productos?`)) {
                                                removeMenuCategory(myRestaurantId, category);
                                            }
                                        }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0.5rem' }}
                                        title="Eliminar categoría"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {expandedCategory === category && (
                                    <div style={{ padding: '0 1rem 1rem 1rem', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', paddingTop: '1rem' }}>
                                            {items.map((item, i) => (
                                                <div key={i} style={{
                                                    background: 'white',
                                                    borderRadius: '8px',
                                                    padding: '0.8rem',
                                                    border: '1px solid #E2E8F0',
                                                    display: 'flex',
                                                    gap: '0.8rem',
                                                    position: 'relative'
                                                }}>
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '60px', height: '60px', borderRadius: '6px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Utensils size={20} color="#94A3B8" />
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.2rem' }}>
                                                            <h4 style={{ fontWeight: '600', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{item.name}</h4>
                                                            <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>${item.price}</span>
                                                        </div>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {item.desc || 'Sin descripción'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`¿Eliminar "${item.name}"?`)) {
                                                                removeMenuItem(myRestaurantId, item);
                                                            }
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '0.5rem',
                                                            right: '0.5rem',
                                                            background: '#FEF2F2',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '4px',
                                                            cursor: 'pointer',
                                                            color: '#EF4444'
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'config' && (
                <div className="fade-in card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <Settings className="text-primary" size={28} />
                        <h2 style={{ fontSize: '1.4rem' }}>Configuración del Restaurante</h2>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        updateRestaurant({
                            name: formData.get('name'),
                            time: formData.get('time'),
                            deliveryFee: formData.get('deliveryFee'),
                            image: formData.get('image') // Hidden input managed below
                        });
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Image Preview & Upload */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                                <img
                                    src={myRestaurant.image || 'https://via.placeholder.com/150'}
                                    id="preview-img"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                />
                                <label style={{
                                    position: 'absolute', bottom: '-10px', right: '-10px',
                                    background: 'var(--primary)', color: 'white',
                                    padding: '8px', borderRadius: '50%', cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <Camera size={20} />
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            document.getElementById('preview-img').src = url;
                                            // Mock: put URL in hidden input. 
                                            // Real app: upload to server first, get URL.
                                            // For this MVP we send the blob URL but server won't be able to display it for others.
                                            // Ideally we have an upload endpoint. 
                                            // But for now we rely on the same 'updateRestaurant' which accepts image string.
                                            // So we will just set the value of a hidden input?
                                            // Better: update a local state or ref.
                                            // Or simplified: Just set the value of the hidden input manually?
                                            // Actually, controlled input is better but I used uncontrolled form.
                                            // Let's just create a hidden input and set its value? Invalid for file.
                                            // We will assume 'image' is a text field for URL in this MVP form.
                                            // Wait, the user wants 'functionality'.
                                            // I will use a simple text input for Image URL for now OR just rely on the 'image' field being passed if I managed state.
                                            // Implementation simplified:
                                            const input = document.getElementById('image-url-input');
                                            if (input) input.value = url;
                                            // NOTE: Blob URLs are local only. Other users won't see it.
                                            // Addressing 'Address Image Uploads' is the next specific step in the plan.
                                            // So I will stick to text input for URL for robustness or just Blob URL as placeholder.
                                        }
                                    }} />
                                </label>
                            </div>
                        </div>
                        <input type="hidden" name="image" id="image-url-input" defaultValue={myRestaurant.image} />


                        <div>
                            <label className="label">Nombre del Restaurante</label>
                            <input name="name" type="text" className="input" defaultValue={myRestaurant.name} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Tiempo Estimado (min)</label>
                                <input name="time" type="text" className="input" defaultValue={myRestaurant.time} placeholder="Ej. 20-30 min" required />
                            </div>
                            <div>
                                <label className="label">Costo Envío ($)</label>
                                <input name="deliveryFee" type="number" step="0.50" className="input" defaultValue={myRestaurant.deliveryFee} required />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
