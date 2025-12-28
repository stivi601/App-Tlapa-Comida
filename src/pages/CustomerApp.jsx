
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
    MapPin, Search, Star, Clock, ShoppingBag, Home, User,
    ArrowLeft, Plus, Minus, ShoppingCart, Trash2, Check,
    X, LogOut, Smartphone, Mail, Bell, Edit2, Camera, Map, AlertTriangle
} from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

// Helpers & Constants
import { formatPrice } from '../utils/helpers';
import { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../constants/orderStatus';

export default function CustomerApp() {
    const {
        restaurants, orders, cart, addToCart, removeFromCart, clearCart, placeOrder, cancelOrder, confirmOrderReceived, restaurantCategories,
        customerUser, loginCustomer, logoutCustomer, registerCustomer,
        customerAddresses, addAddress, removeAddress, updateAddress,
        rateRestaurant, updateOrderStatus, decrementFromCart,
        updateOrder, updateCustomerUser
    } = useApp();

    const [activeTab, setActiveTab] = useState('home');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todo');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddr, setNewAddr] = useState({ label: '', address: '' });
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [editingAddressId, setEditingAddressId] = useState(null);

    // Seleccionar automáticamente la primera dirección al cargar
    useEffect(() => {
        if (customerAddresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(customerAddresses[0].id);
        }
    }, [customerAddresses]);
    const [ratingModalOrder, setRatingModalOrder] = useState(null);
    const [selectedStars, setSelectedStars] = useState(0);

    // Login State
    const [authMode, setAuthMode] = useState('login'); // login | register
    const [loginMethod, setLoginMethod] = useState('email'); // email | phone
    const [authData, setAuthData] = useState({ email: '', password: '', name: '', phone: '' });
    const [authError, setAuthError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError(null);
        setIsSubmitting(true);

        try {
            let result;
            if (authMode === 'login') {
                result = await loginCustomer(loginMethod, authData);
            } else {
                // Validación básica frontend
                if (!authData.name || !authData.email || !authData.password) {
                    setAuthError("Por favor completa todos los campos requeridos.");
                    setIsSubmitting(false);
                    return;
                }
                if (authData.password.length < 6) {
                    setAuthError("La contraseña debe tener al menos 6 caracteres.");
                    setIsSubmitting(false);
                    return;
                }
                result = await registerCustomer(authData);
            }

            if (result && !result.success) {
                setAuthError(result.error || "Ocurrió un error inesperado.");
            }
        } catch (err) {
            setAuthError("Error de conexión con el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const [currentAddressId, setCurrentAddressId] = useState(customerAddresses[0]?.id);
    const currentAddress = customerAddresses.find(a => a.id === currentAddressId) || customerAddresses[0];

    const handleAddItem = (item, price, restName) => {
        const success = addToCart(item, restName, price);
        if (!success) {
            alert("Solo puedes pedir comida de un restaurante a la vez. Vacía tu carrito para cambiar de restaurante.");
        }
    };

    // Filter logic
    const filteredRestaurants = selectedCategory === 'Todo'
        ? restaurants
        : restaurants.filter(r => r.categories && r.categories.includes(selectedCategory));

    if (!customerUser) {
        return (
            <div className="fade-in" style={{ padding: '2rem', minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary), #FF8C42)',
                        borderRadius: '24px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 20px rgba(255, 115, 0, 0.3)'
                    }}>
                        <ShoppingBag size={40} color="white" />
                    </div>
                    <h1 style={{ color: '#1E293B', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Tlapa <span style={{ color: 'var(--primary)' }}>Comida</span></h1>
                    <p style={{ color: '#64748B', marginTop: '0.5rem' }}>Lo mejor de Tlapa en tu mesa.</p>
                </div>

                <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', marginBottom: '1.5rem', background: '#F1F5F9', borderRadius: '12px', padding: '4px' }}>
                        <button
                            onClick={() => setAuthMode('login')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none',
                                background: authMode === 'login' ? 'white' : 'transparent',
                                fontWeight: '600', color: authMode === 'login' ? 'var(--primary)' : '#64748B',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >Iniciar Sesión</button>
                        <button
                            onClick={() => setAuthMode('register')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none',
                                background: authMode === 'register' ? 'white' : 'transparent',
                                fontWeight: '600', color: authMode === 'register' ? 'var(--primary)' : '#64748B',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >Registrarse</button>
                    </div>

                    {authMode === 'login' && (
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setLoginMethod('email')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                                    color: loginMethod === 'email' ? 'var(--primary)' : '#94A3B8', fontWeight: '500', cursor: 'pointer',
                                    paddingBottom: '4px', borderBottom: loginMethod === 'email' ? '2px solid var(--primary)' : '2px solid transparent'
                                }}
                            ><Mail size={18} /> Correo</button>
                            <button
                                onClick={() => setLoginMethod('phone')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                                    color: loginMethod === 'phone' ? 'var(--primary)' : '#94A3B8', fontWeight: '500', cursor: 'pointer',
                                    paddingBottom: '4px', borderBottom: loginMethod === 'phone' ? '2px solid var(--primary)' : '2px solid transparent'
                                }}
                            ><Smartphone size={18} /> Teléfono</button>
                        </div>
                    )}

                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {authMode === 'register' && (
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type="text" placeholder="Nombre completo" className="input" required
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={authData.name} onChange={e => setAuthData({ ...authData, name: e.target.value })}
                                />
                            </div>
                        )}

                        {(authMode === 'register' || loginMethod === 'phone') && (
                            <div style={{ position: 'relative' }}>
                                <Smartphone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type="tel" placeholder="Tu teléfono" className="input" required
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={authData.phone} onChange={e => setAuthData({ ...authData, phone: e.target.value })}
                                />
                            </div>
                        )}

                        {(authMode === 'register' || loginMethod === 'email') && (
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type="email" placeholder="Correo electrónico" className="input" required
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={authData.email} onChange={e => setAuthData({ ...authData, email: e.target.value })}
                                />
                            </div>
                        )}

                        <div style={{ position: 'relative' }}>
                            <X size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input
                                type="password" placeholder="Contraseña" className="input" required
                                style={{ paddingLeft: '2.5rem' }}
                                value={authData.password} onChange={e => setAuthData({ ...authData, password: e.target.value })}
                            />
                        </div>

                        {authError && (
                            <div className="fade-in" style={{
                                background: '#FEF2F2',
                                color: '#EF4444',
                                padding: '12px',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid #FEE2E2',
                                marginTop: '0.5rem'
                            }}>
                                <AlertTriangle size={18} />
                                <span style={{ fontWeight: '500' }}>{authError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                borderRadius: '14px',
                                fontSize: '1rem',
                                opacity: isSubmitting ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock size={18} className="spin" /> Procesando...
                                </>
                            ) : (
                                authMode === 'login' ? 'Iniciar Sesión' : 'Crear mi cuenta'
                            )}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
                        <span style={{ padding: '0 1rem', color: '#94A3B8', fontSize: '0.85rem' }}>o continuar con</span>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button className="btn" style={{
                            background: 'white', color: '#1E293B', border: '1px solid #E2E8F0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontWeight: '600'
                        }}>
                            Google
                        </button>
                        <button className="btn" style={{
                            background: '#1877F2', color: 'white', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontWeight: '600'
                        }}>
                            Facebook
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedRestaurant) {
        // Group menu by category
        const menuByCat = (selectedRestaurant.menu || []).reduce((acc, item) => {
            const cat = item.category || 'Otros';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});

        return (
            <div className="fade-in" style={{ paddingBottom: '80px', background: '#fff', minHeight: '100vh' }}>
                <div style={{ position: 'relative', height: '250px' }}>
                    <img src={selectedRestaurant.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={selectedRestaurant.name} />
                    <button
                        onClick={() => setSelectedRestaurant(null)}
                        style={{
                            position: 'absolute', top: '20px', left: '20px',
                            background: 'white', borderRadius: '50%', width: '40px', height: '40px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    {cart.items.length > 0 && (
                        <button
                            onClick={() => { setSelectedRestaurant(null); setActiveTab('cart'); }}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '40px', height: '40px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer'
                            }}
                        >
                            <ShoppingCart size={20} />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '0.7rem', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.items.length}</span>
                        </button>
                    )}
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedRestaurant.name}</h1>
                        <div style={{ background: '#ECFDF5', color: '#059669', padding: '4px 8px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {selectedRestaurant.rating} <Star size={16} fill="#059669" />
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <span>{selectedRestaurant.categories?.join(', ')}</span> • <span>{selectedRestaurant.time}</span> • <span>Envío {formatPrice(selectedRestaurant.deliveryFee)}</span>
                    </p>

                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.2rem', fontWeight: '800' }}>Nuestro Menú</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {Object.entries(menuByCat).map(([category, items]) => (
                            <div key={category}>
                                <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                                    {category}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {items.map((item, i) => {
                                        const cartItem = cart.items.find(ci => ci.name === item.name);
                                        const qty = cartItem ? cartItem.quantity : 0;

                                        return (
                                            <div key={i} className={qty > 0 ? "scale-up" : ""} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '1.2rem', border: '1px solid #F1F5F9', borderRadius: '18px',
                                                background: 'white', boxShadow: qty > 0 ? '0 4px 15px rgba(255,107,0,0.1)' : 'none',
                                                transition: 'all 0.3s ease',
                                                borderColor: qty > 0 ? 'var(--primary)' : '#F1F5F9'
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ marginBottom: '0.4rem', fontSize: '1.05rem', fontWeight: '700' }}>{item.name}</h4>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4', marginBottom: '0.6rem' }}>{item.desc}</p>
                                                    <p style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>{formatPrice(item.price)}</p>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: qty > 0 ? '#FFF7ED' : 'transparent', padding: '4px', borderRadius: '30px' }}>
                                                    {qty > 0 && (
                                                        <>
                                                            <button
                                                                onClick={() => decrementFromCart(item.name)}
                                                                style={{
                                                                    background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)',
                                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                                                }}
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <span style={{ fontWeight: '800', fontSize: '1rem', minWidth: '20px', textAlign: 'center', color: 'var(--text-main)' }}>{qty}</span>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleAddItem(item.name, item.price, selectedRestaurant.name)}
                                                        style={{
                                                            background: 'var(--primary)', color: 'white', border: 'none',
                                                            width: qty > 0 ? '32px' : '44px', height: qty > 0 ? '32px' : '44px', borderRadius: '50%',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,107,0,0.2)',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <Plus size={qty > 0 ? 16 : 24} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            {activeTab === 'home' && (
                <>
                    {/* Address Selection Modal */}
                    {showAddressModal && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
                            <div className="fade-in-up" style={{ background: 'white', width: '100%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '2rem 1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Selecciona una dirección</h3>
                                    <button onClick={() => setShowAddressModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <X size={18} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {customerAddresses.map(addr => (
                                        <div
                                            key={addr.id}
                                            onClick={() => { setCurrentAddressId(addr.id); setShowAddressModal(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                                border: '2px solid', borderColor: currentAddressId === addr.id ? 'var(--primary)' : '#F1F5F9',
                                                borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                                                background: currentAddressId === addr.id ? '#FFF7ED' : 'white'
                                            }}
                                        >
                                            <div style={{ background: currentAddressId === addr.id ? 'var(--primary)' : '#F1F5F9', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <MapPin size={20} color={currentAddressId === addr.id ? 'white' : '#94A3B8'} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '600', color: '#1E293B' }}>{addr.label}</p>
                                                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>{addr.address}</p>
                                            </div>
                                            {currentAddressId === addr.id && <Check size={20} color="var(--primary)" />}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setShowAddAddress(true)}
                                        style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '16px', border: '1px dashed #CBD5E1', background: 'none', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                                    >
                                        <Plus size={18} /> Agregar nueva dirección
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <header className="fade-in" style={{ padding: '1rem', background: 'white', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div
                                onClick={() => setShowAddressModal(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}
                            >
                                <MapPin size={20} />
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                    {currentAddress?.label || 'Agregar Dirección'}
                                </span>
                                <Plus size={14} style={{ transform: 'rotate(45deg)', marginLeft: '-4px' }} /> {/* Down arrow effect */}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div
                                    onClick={() => setShowNotificationsModal(true)}
                                    style={{ width: '36px', height: '36px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                                >
                                    <Bell size={20} color="var(--text-light)" />
                                    <span style={{ position: 'absolute', top: '0', right: '0', background: 'var(--primary)', border: '2px solid white', borderRadius: '50%', width: '12px', height: '12px' }}></span>
                                </div>
                                <div style={{ width: '36px', height: '36px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} color="var(--text-light)" />
                                </div>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input
                                type="text"
                                placeholder="¿Qué se te antoja hoy?"
                                className="input"
                                style={{ paddingLeft: '2.5rem', borderRadius: '20px', background: '#F8FAFC', border: 'none' }}
                            />
                        </div>
                    </header>

                    {/* Categories */}
                    <section className="fade-in" style={{ padding: '1.5rem 1rem 0.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Categorías</h3>
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                            {['Todo', ...restaurantCategories].map((cat, i) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        background: selectedCategory === cat ? 'var(--primary)' : 'white',
                                        color: selectedCategory === cat ? 'white' : 'var(--text-light)',
                                        border: '1px solid',
                                        borderColor: selectedCategory === cat ? 'transparent' : '#E2E8F0',
                                        whiteSpace: 'nowrap',
                                        fontWeight: '500',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Restaurants */}
                    <section className="fade-in" style={{ padding: '0.5rem 1rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Restaurantes Populares</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {filteredRestaurants.map(rest => (
                                <div
                                    key={rest.id}
                                    className="card"
                                    style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                                    onClick={() => setSelectedRestaurant(rest)}
                                >
                                    <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                                        <img src={rest.image} alt={rest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', borderRadius: '20px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                                            <Clock size={14} color="var(--primary)" />
                                            {rest.time}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontSize: '1.1rem' }}>{rest.name}</h4>
                                            <div style={{ background: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                {rest.rating} <Star size={12} fill="#059669" />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                            <span>{rest.categories?.join(', ')}</span>
                                            <span>•</span>
                                            <span>Envío: {formatPrice(rest.deliveryFee)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {activeTab === 'cart' && (
                <div className="fade-in" style={{ padding: '1rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Carrito de Compras</h2>
                    {cart.items.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>
                            <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>Tu carrito está vacío.</p>
                            <button onClick={() => setActiveTab('home')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Ir a Restaurantes
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>{cart.restaurantName}</h3>
                                <button onClick={clearCart} style={{ color: '#EF4444', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer' }}>Vaciar</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {cart.items.map((item, i) => (
                                    <div key={i} className="card bounce" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                        <div>
                                            <p style={{ fontWeight: '700', fontSize: '1rem' }}>{item.name}</p>
                                            <p style={{ color: 'var(--primary)', fontWeight: '600' }}>{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#F8FAFC', padding: '4px', borderRadius: '30px' }}>
                                            <button
                                                onClick={() => decrementFromCart(item.name)}
                                                style={{ background: 'white', border: '1px solid #E2E8F0', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => handleAddItem(item.name, item.price, cart.restaurantName)}
                                                style={{ background: 'var(--primary)', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#64748B' }}>Entregar en:</label>
                                {customerAddresses.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {customerAddresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                style={{
                                                    padding: '0.8rem',
                                                    borderRadius: '10px',
                                                    border: selectedAddressId === addr.id ? '2px solid var(--primary)' : '1px solid #E2E8F0',
                                                    background: selectedAddressId === addr.id ? '#EFF6FF' : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.8rem'
                                                }}
                                            >
                                                <MapPin size={18} color={selectedAddressId === addr.id ? 'var(--primary)' : '#94A3B8'} />
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{addr.label}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{addr.address}</div>
                                                </div>
                                                {selectedAddressId === addr.id && <Check size={16} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '1rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', color: '#64748B' }}>
                                        No tienes direcciones guardadas.
                                        <button onClick={() => setActiveTab('profile')} style={{ color: 'var(--primary)', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '5px' }}>Agregar una en Perfil</button>
                                    </div>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span>{formatPrice(cart.total)}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        const addr = customerAddresses.find(a => a.id === selectedAddressId);
                                        if (!addr) {
                                            alert("Selecciona una dirección de entrega");
                                            return;
                                        }
                                        placeOrder(addr);
                                        setActiveTab('orders');
                                    }}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    disabled={customerAddresses.length === 0}
                                >
                                    Confirmar Pedido
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )
            }

            {
                activeTab === 'orders' && (
                    <div className="fade-in" style={{ padding: '1rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Mis Pedidos</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map(order => (
                                <div key={order.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{order.restaurant}</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '600', display: 'block' }}>{formatPrice(order.total)}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>#{order.id}</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.8rem' }}>
                                        {order.items}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem' }}>
                                        <span style={{
                                            background: ORDER_STATUS_COLORS[order.status] ? ORDER_STATUS_COLORS[order.status] + '20' : '#F3F4F6',
                                            color: ORDER_STATUS_COLORS[order.status] || '#6B7280',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontWeight: '500',
                                            textTransform: 'capitalize'
                                        }}>
                                            {ORDER_STATUS_LABELS[order.status] || order.status}
                                        </span>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {order.status === ORDER_STATUS.PENDING && (
                                                <button
                                                    onClick={() => cancelOrder(order.id)}
                                                    style={{ border: 'none', background: '#FEE2E2', color: '#EF4444', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                                    <Trash2 size={14} /> Cancelar
                                                </button>
                                            )}
                                            {order.status !== ORDER_STATUS.PENDING && order.status !== ORDER_STATUS.COMPLETED && (
                                                <button
                                                    onClick={() => setRatingModalOrder(order)}
                                                    style={{ border: 'none', background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                                    <Check size={14} /> Confirmar Recibo
                                                </button>
                                            )}
                                            {order.status === ORDER_STATUS.COMPLETED && !order.rating && (
                                                <button
                                                    onClick={() => { setSelectedStars(0); setRatingModalOrder(order); }}
                                                    style={{ border: 'none', background: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                                    <Star size={14} /> Calificar
                                                </button>
                                            )}
                                            {order.status === ORDER_STATUS.COMPLETED && order.rating && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.85rem', fontWeight: '600' }}>
                                                    Tu calificación: {order.rating} <Star size={14} fill="#059669" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {
                activeTab === 'profile' && (
                    <div className="fade-in" style={{ padding: '2rem 1rem' }}>
                        {/* ... (contenido del perfil existente) ... */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                    {customerUser.image ? (
                                        <img src={customerUser.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                <label style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                    <Camera size={14} />
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            updateCustomerUser({ image: url });
                                        }
                                    }} />
                                </label>
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{customerUser.name}</h3>
                            <p style={{ color: 'var(--text-light)' }}>{customerUser.email}</p>
                            <p style={{ color: 'var(--text-light)' }}>{customerUser.phone}</p>
                        </div>

                        <div className="card" style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={18} color="var(--primary)" /> Mis Direcciones
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {customerAddresses.map(addr => (
                                    <div key={addr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '14px' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: '700', fontSize: '1rem' }}>{addr.label}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '2px' }}>{addr.address}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => {
                                                    setEditingAddressId(addr.id);
                                                    setNewAddr({ label: addr.label, address: addr.address });
                                                    setShowAddAddress(true);
                                                }}
                                                style={{ color: '#3B82F6', background: 'white', border: '1px solid #E2E8F0', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => removeAddress(addr.id, customerUser.token)} style={{ color: '#EF4444', background: 'white', border: '1px solid #FEE2E2', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setEditingAddressId(null);
                                    setNewAddr({ label: '', address: '' });
                                    setShowAddAddress(true);
                                }}
                                style={{ marginTop: '1rem', color: 'var(--primary)', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500' }}
                            >
                                <Plus size={18} /> Agregar Dirección
                            </button>
                        </div>

                        <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.8rem 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>Métodos de Pago</div>
                            <div style={{ padding: '0.8rem 0', cursor: 'pointer' }}>Ayuda y Soporte</div>
                        </div>

                        <button onClick={logoutCustomer} className="btn" style={{ width: '100%', background: '#FEE2E2', color: '#EF4444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                    </div>
                )
            }

            {/* FLOATING ACTIVE ORDER STATUS BAR */}
            {
                (() => {
                    // Encontrar el primer pedido activo (no completado ni cancelado)
                    const activeOrder = orders.find(o =>
                        o.status !== ORDER_STATUS.COMPLETED &&
                        o.status !== ORDER_STATUS.CANCELLED
                    );

                    if (activeOrder) {
                        return (
                            <div
                                className="fade-in-up"
                                onClick={() => setActiveTab('orders')}
                                style={{
                                    position: 'fixed',
                                    bottom: '70px', // Justo encima del nav bar
                                    left: '1rem',
                                    right: '1rem',
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '1rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    zIndex: 90,
                                    cursor: 'pointer',
                                    border: '1px solid #F1F5F9'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: ORDER_STATUS_COLORS[activeOrder.status] + '20', // Color con opacidad
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: ORDER_STATUS_COLORS[activeOrder.status]
                                    }}>
                                        {/* Icono dinámico basado en estado */}
                                        {activeOrder.status === ORDER_STATUS.PENDING && <Clock size={20} />}
                                        {activeOrder.status === ORDER_STATUS.PREPARING && <Smartphone size={20} />} {/* ChefHat no importado, usando Smartphone como fallback visual o Clock */}
                                        {activeOrder.status === ORDER_STATUS.READY && <ShoppingBag size={20} />}
                                        {activeOrder.status === ORDER_STATUS.DELIVERING && <Map size={20} />}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B' }}>
                                            {ORDER_STATUS_LABELS[activeOrder.status]}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                            {activeOrder.restaurant} • {activeOrder.time}
                                        </p>
                                    </div>
                                </div>
                                <div style={{
                                    backgroundColor: ORDER_STATUS_COLORS[activeOrder.status],
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}>
                                    Ver
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()
            }

            {/* Bottom Nav */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                borderTop: '1px solid #E2E8F0',
                padding: '0.8rem 1rem',
                display: 'flex',
                justifyContent: 'space-around',
                zIndex: 20
            }}>
                <button
                    onClick={() => { setSelectedRestaurant(null); setActiveTab('home'); }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'home' && !selectedRestaurant ? 'var(--primary)' : '#94A3B8', background: 'none', border: 'none' }}
                >
                    <Home size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Inicio</span>
                </button>
                <button
                    onClick={() => { setSelectedRestaurant(null); setActiveTab('cart'); }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'cart' ? 'var(--primary)' : '#94A3B8', background: 'none', border: 'none', position: 'relative' }}
                >
                    <ShoppingCart size={24} />
                    {cart.items.length > 0 && <span style={{ position: 'absolute', top: -5, right: 10, background: 'red', color: 'white', borderRadius: '50%', width: '14px', height: '14px', fontSize: '0.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{cart.items.length}</span>}
                    <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Carrito</span>
                </button>
                <button
                    onClick={() => { setSelectedRestaurant(null); setActiveTab('orders'); }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'orders' ? 'var(--primary)' : '#94A3B8', background: 'none', border: 'none' }}
                >
                    <ShoppingBag size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Pedidos</span>
                </button>
                <button
                    onClick={() => { setSelectedRestaurant(null); setActiveTab('profile'); }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'profile' ? 'var(--primary)' : '#94A3B8', background: 'none', border: 'none' }}
                >
                    <User size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Perfil</span>
                </button>
            </nav>

            {/* Notifications Modal */}
            {
                showNotificationsModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
                        <div className="fade-in-up" style={{ background: 'white', width: '100%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '2rem 1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Notificaciones</h3>
                                <button onClick={() => setShowNotificationsModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {useApp().systemNotifications.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem 0' }}>No tienes notificaciones nuevas.</p>
                                ) : (
                                    useApp().systemNotifications.map(notif => (
                                        <div key={notif.id} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', borderLeft: '4px solid var(--primary)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{notif.title}</h4>
                                                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{notif.date}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.4' }}>{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal for Adding Address */}
            {
                showAddAddress && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{editingAddressId ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
                                <button onClick={() => { setShowAddAddress(false); setEditingAddressId(null); setNewAddr({ label: '', address: '' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={24} color="#94A3B8" />
                                </button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (newAddr.label && newAddr.address) {
                                    if (editingAddressId) {
                                        updateAddress(editingAddressId, newAddr, customerUser.token);
                                    } else {
                                        addAddress(newAddr, customerUser.token);
                                    }
                                    setNewAddr({ label: '', address: '' });
                                    setEditingAddressId(null);
                                    setShowAddAddress(false);
                                }
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B', fontWeight: '500' }}>Etiqueta (ej. Trabajo, Casa)</label>
                                    <input
                                        type="text" className="input" placeholder="Nombre para esta dirección"
                                        required value={newAddr.label}
                                        onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B', fontWeight: '500' }}>Ubicación</label>
                                    <ErrorBoundary fallback={
                                        <div style={{ padding: '1rem', background: '#F1F5F9', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
                                            Mapa no disponible. Por favor escribe tu dirección abajo.
                                        </div>
                                    }>
                                        <LocationPicker
                                            onLocationSelect={({ lat, lng }) => {
                                                setNewAddr(prev => ({ ...prev, lat, lng }));
                                            }}
                                        />
                                    </ErrorBoundary>
                                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '5px' }}>Mueve el pin a tu ubicación exacta.</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B', fontWeight: '500' }}>Dirección Escrita / Referencias</label>
                                    <textarea
                                        className="input" style={{ minHeight: '60px', paddingTop: '0.8rem', resize: 'none' }}
                                        placeholder="Calle, número, colonia, color de casa..."
                                        required value={newAddr.address}
                                        onChange={e => setNewAddr({ ...newAddr, address: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '14px', marginTop: '0.5rem' }}>
                                    Guardar Dirección
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Rating Modal */}
            {
                ratingModalOrder && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <div className="card fade-in" style={{ width: '100%', maxWidth: '350px', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ width: '60px', height: '60px', background: '#FEF3C7', borderRadius: '20px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Star size={30} color="#D97706" fill="#D97706" />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>¿Qué te pareció {ratingModalOrder.restaurant}?</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.5rem' }}>Tu calificación ayuda a mejorar el servicio.</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setSelectedStars(star)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Star
                                            size={32}
                                            color={star <= selectedStars ? '#F59E0B' : '#E2E8F0'}
                                            fill={star <= selectedStars ? '#F59E0B' : 'none'}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <button
                                    onClick={() => {
                                        if (selectedStars > 0) {
                                            rateRestaurant(ratingModalOrder.restaurant, selectedStars);
                                            // Update the order itself in the mock state
                                            updateOrder(ratingModalOrder.id, {
                                                rating: selectedStars,
                                                status: 'completed'
                                            });

                                            setRatingModalOrder(null);
                                            setSelectedStars(0);
                                        } else {
                                            alert("Por favor selecciona una calificación");
                                        }
                                    }}
                                    className="btn btn-primary"
                                    style={{ padding: '1rem', borderRadius: '14px' }}
                                >
                                    Enviar Calificación
                                </button>
                                <button
                                    onClick={() => {
                                        if (ratingModalOrder.status !== 'completed') {
                                            confirmOrderReceived(ratingModalOrder.id);
                                        }
                                        setRatingModalOrder(null);
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.9rem', cursor: 'pointer' }}
                                >
                                    Omitir por ahora
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
