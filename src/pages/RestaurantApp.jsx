import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChefHat, CheckCircle, Clock, ArrowRight, Plus, Utensils, X, Image, ChevronDown, ChevronUp, Camera, Trash2, Lock } from 'lucide-react';

export default function RestaurantApp() {
    const { orders, updateOrderStatus, restaurants, addMenuItem, removeMenuItem, removeMenuCategory, loginRestaurant, restaurantUser, setRestaurantUser } = useApp();

    // Auth State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'

    // Form State
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', desc: '', image: null });
    const [showAddForm, setShowAddForm] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await loginRestaurant(username, password);
        if (success) {
            setLoginError('');
        } else {
            setLoginError('Credenciales inválidas');
        }
    };

    if (!restaurantUser) {
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

    const myRestaurantId = restaurantUser.id;
    const myRestaurant = restaurants.find(r => r.id === myRestaurantId) || restaurantUser; // Ensure we get latest state
    const myOrders = orders.filter(o => o.restaurant === myRestaurant.name);

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

    return (
        <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Panel de Restaurante</h1>
                    <p style={{ color: 'var(--text-light)' }}>{myRestaurant?.name}</p>
                </div>
                <div style={{ background: '#EFF6FF', padding: '0.5rem', borderRadius: '50%', color: '#3B82F6' }}>
                    <ChefHat size={24} />
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
        </div>
    );
}
