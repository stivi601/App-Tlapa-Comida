import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Store, TrendingUp, DollarSign, Activity, Trash2, Plus, Camera, Bell, Bike, ShieldCheck, Truck, Search } from 'lucide-react';

export default function AdminApp() {
    const {
        restaurants, orders,
        restaurantCategories, addRestaurantCategory, removeRestaurantCategory,
        addRestaurant, updateRestaurant, deleteRestaurant,
        registeredUsers, sendMassNotification,
        deliveryRiders, addDeliveryRider, updateDeliveryRider
    } = useApp();

    const [activeSection, setActiveSection] = useState('Dashboard');
    const [newCatName, setNewCatName] = useState('');

    // Notification State
    const [newNotif, setNewNotif] = useState({ title: '', message: '' });
    const [notifSent, setNotifSent] = useState(false);

    // Restaurant Form State
    const [showRestForm, setShowRestForm] = useState(false);
    const [restFormData, setRestFormData] = useState({ id: null, name: '', username: '', password: '', categories: [] });

    // Rider Form State
    const [showRiderForm, setShowRiderForm] = useState(false);
    const [riderFormData, setRiderFormData] = useState({ name: '', username: '', password: '', phone: '', address: '', rfc: '', email: '', assignedRestaurant: '' });

    // Search States
    const [searchRest, setSearchRest] = useState('');
    const [searchRider, setSearchRider] = useState('');
    const [searchUser, setSearchUser] = useState('');

    // Stats State
    const [stats, setStats] = useState({
        sales: 0,
        restaurants: 0,
        orders: 0,
        users: 0,
        riders: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error loading admin stats", error);
            }
        };
        fetchStats();
    }, []);

    const totalSales = stats.sales;

    const handleSaveRestaurant = (e) => {
        e.preventDefault();
        if (restFormData.id) {
            updateRestaurant(restFormData.id, restFormData);
        } else {
            addRestaurant(restFormData);
        }
        setShowRestForm(false);
        setRestFormData({ id: null, name: '', username: '', password: '', categories: [] });
    };

    const handleEditRestaurant = (r) => {
        setRestFormData({ ...r });
        setShowRestForm(true);
    };

    const toggleRestCategory = (cat) => {
        const current = restFormData.categories || [];
        if (current.includes(cat)) {
            setRestFormData({ ...restFormData, categories: current.filter(c => c !== cat) });
        } else {
            setRestFormData({ ...restFormData, categories: [...current, cat] });
        }
    };

    const handleSendNotif = (e) => {
        e.preventDefault();
        sendMassNotification(newNotif);
        setNotifSent(true);
        setNewNotif({ title: '', message: '' });
        setTimeout(() => setNotifSent(false), 3000);
    };

    const handleSaveRider = (e) => {
        e.preventDefault();
        if (riderFormData.id) {
            updateDeliveryRider(riderFormData.id, riderFormData);
        } else {
            addDeliveryRider(riderFormData);
        }
        setShowRiderForm(false);
        setRiderFormData({ name: '', username: '', password: '', phone: '', address: '', rfc: '', email: '', assignedRestaurant: '' });
    };

    const handleEditRider = (rider) => {
        setRiderFormData({ ...rider });
        setShowRiderForm(true);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', background: '#1E293B', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity color="var(--primary)" /> Admin
                </h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { name: 'Dashboard', icon: <TrendingUp size={18} /> },
                        { name: 'Restaurantes', icon: <Store size={18} /> },
                        { name: 'Categorías', icon: <Plus size={18} /> },
                        { name: 'Repartidores', icon: <Bike size={18} /> },
                        { name: 'Usuarios', icon: <Users size={18} /> },
                        { name: 'Notificaciones', icon: <Bell size={18} /> }
                    ].map((item) => (
                        <button key={item.name}
                            onClick={() => setActiveSection(item.name)}
                            style={{
                                background: activeSection === item.name ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: activeSection === item.name ? 'white' : '#94A3B8',
                                textAlign: 'left',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                            {item.icon}
                            {item.name}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

                {activeSection === 'Dashboard' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '1.8rem' }}>Dashboard General</h1>
                            <p style={{ color: 'var(--text-light)' }}>Bienvenido al panel de control de Tlapa Comida.</p>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#EFF6FF', borderRadius: '12px', color: '#3B82F6' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Ventas Totales</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>${totalSales.toLocaleString()}</h3>
                                </div>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '12px', color: '#D97706' }}>
                                    <Store size={24} />
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Restaurantes</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats.restaurants}</h3>
                                </div>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#ECFDF5', borderRadius: '12px', color: '#059669' }}>
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Ordenes Hoy</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats.orders}</h3>
                                </div>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#F5F3FF', borderRadius: '12px', color: '#8B5CF6' }}>
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Usuarios Reg.</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats.users}</h3>
                                </div>
                            </div>
                            {/* Card extra para repartidores */}
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#EFF6FF', borderRadius: '12px', color: '#3B82F6' }}>
                                    <Bike size={24} />
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Repartidores</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats.riders}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'Usuarios' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '1.8rem' }}>Usuarios Registrados</h1>
                            <p style={{ color: 'var(--text-light)' }}>Listado de clientes que han descargado y se han registrado en la app.</p>
                        </header>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ position: 'relative', maxWidth: '400px' }}>
                                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type="text" className="input" style={{ paddingLeft: '40px' }}
                                    placeholder="Buscar usuario por nombre, email o tel..."
                                    value={searchUser}
                                    onChange={e => setSearchUser(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="card" style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Nombre</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Email</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Teléfono</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Fecha Reg.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registeredUsers.filter(u =>
                                        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                                        u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
                                        u.phone.includes(searchUser)
                                    ).map(user => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.95rem' }}>{user.name}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.95rem', color: '#3B82F6' }}>{user.email}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.95rem' }}>{user.phone}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.95rem', color: '#64748B' }}>{user.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'Notificaciones' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '1.8rem' }}>Notificaciones Masivas</h1>
                            <p style={{ color: 'var(--text-light)' }}>Envía avisos push o mensajes generales a todos tus usuarios.</p>
                        </header>

                        <div className="card" style={{ maxWidth: '600px' }}>
                            {notifSent && (
                                <div style={{ background: '#DCFCE7', color: '#15803D', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <TrendingUp size={18} /> ¡Notificación enviada exitosamente a {registeredUsers.length} usuarios!
                                </div>
                            )}

                            <form onSubmit={handleSendNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Título de la Notificación</label>
                                    <input
                                        type="text" className="input" style={{ width: '100%' }}
                                        placeholder="Ej: ¡Nuevo descuento del 20%!"
                                        required
                                        value={newNotif.title}
                                        onChange={e => setNewNotif({ ...newNotif, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Cuerpo del Mensaje</label>
                                    <textarea
                                        className="input" style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
                                        placeholder="Describe la promoción o aviso aquí..."
                                        required
                                        value={newNotif.message}
                                        onChange={e => setNewNotif({ ...newNotif, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    <Bell size={18} /> Enviar a Todos los Usuarios
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeSection === 'Categorías' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '1.8rem' }}>Categorías de Restaurante</h1>
                            <p style={{ color: 'var(--text-light)' }}>Gestiona los tipos de comida disponibles en la plataforma.</p>
                        </header>

                        <div className="card" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Nueva Categoría (ej. Mariscos)"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (newCatName) {
                                            addRestaurantCategory(newCatName);
                                            setNewCatName('');
                                        }
                                    }}
                                >
                                    <Plus size={18} /> Agregar
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {restaurantCategories.map(cat => (
                                <div key={cat} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                    <span style={{ fontWeight: '500' }}>{cat}</span>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`¿Eliminar categoría "${cat}"?`)) removeRestaurantCategory(cat);
                                        }}
                                        style={{ background: '#FEF2F2', border: 'none', padding: '0.5rem', borderRadius: '6px', color: '#EF4444', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'Restaurantes' && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ fontSize: '1.8rem' }}>Gestión de Restaurantes</h1>
                                <p style={{ color: 'var(--text-light)' }}>Crea accesos y asigna categorías.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ position: 'relative', width: '300px' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input
                                        type="text" className="input" style={{ paddingLeft: '40px' }}
                                        placeholder="Buscar restaurante..."
                                        value={searchRest}
                                        onChange={e => setSearchRest(e.target.value)}
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={() => {
                                    setRestFormData({ id: null, name: '', username: '', password: '', categories: [] });
                                    setShowRestForm(true);
                                }}>
                                    <Plus size={18} /> Agregar Restaurante
                                </button>
                            </div>
                        </div>

                        {showRestForm && (
                            <div className="card fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--primary)', maxWidth: '800px' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>{restFormData.id ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h3>
                                <form onSubmit={handleSaveRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                                            {/* Image Upload Area */}
                                            <div style={{ width: '100px', flexShrink: 0 }}>
                                                <label style={{
                                                    width: '100%', height: '100px',
                                                    border: '2px dashed #E2E8F0', borderRadius: '8px',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                                                    background: restFormData.image ? `url(${restFormData.image}) center/cover` : '#F8FAFC'
                                                }}>
                                                    {!restFormData.image && (
                                                        <>
                                                            <Camera size={24} color="#94A3B8" />
                                                            <span style={{ fontSize: '0.6rem', color: '#94A3B8', marginTop: '4px' }}>Logo</span>
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
                                                                setRestFormData({ ...restFormData, image: url });
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre del Restaurante</label>
                                                <input
                                                    type="text" className="input" style={{ width: '100%' }}
                                                    value={restFormData.name}
                                                    onChange={e => setRestFormData({ ...restFormData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Usuario (Login)</label>
                                            <input
                                                type="text" className="input" style={{ width: '100%' }}
                                                value={restFormData.username}
                                                onChange={e => setRestFormData({ ...restFormData, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contraseña</label>
                                            <input
                                                type="text" className="input" style={{ width: '100%' }}
                                                value={restFormData.password}
                                                onChange={e => setRestFormData({ ...restFormData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Categorías (Selecciona múltiples)</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem', background: '#F8FAFC', borderRadius: '8px' }}>
                                            {restaurantCategories.map(cat => (
                                                <button
                                                    type="button"
                                                    key={cat}
                                                    onClick={() => toggleRestCategory(cat)}
                                                    style={{
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '20px',
                                                        border: '1px solid',
                                                        borderColor: restFormData.categories?.includes(cat) ? 'var(--primary)' : '#E2E8F0',
                                                        background: restFormData.categories?.includes(cat) ? '#EFF6FF' : 'white',
                                                        color: restFormData.categories?.includes(cat) ? 'var(--primary)' : 'var(--text-main)',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" className="btn" onClick={() => setShowRestForm(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {restaurants.filter(r => r.name.toLowerCase().includes(searchRest.toLowerCase())).map(r => (
                                <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h3 style={{ fontSize: '1.1rem' }}>{r.name}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditRestaurant(r)} style={{ fontSize: '0.8rem', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
                                            <button onClick={() => { if (window.confirm('Eliminar?')) deleteRestaurant(r.id) }} style={{ fontSize: '0.8rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>Borrar</button>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        <div>User: <strong>{r.username}</strong> | Pass: <strong>{r.password}</strong></div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                        {r.categories?.map(c => (
                                            <span key={c} style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#F1F5F9', borderRadius: '10px' }}>
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'Repartidores' && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ fontSize: '1.8rem' }}>Gestión de Repartidores</h1>
                                <p style={{ color: 'var(--text-light)' }}>Registra y administra el personal de entrega.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ position: 'relative', width: '300px' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input
                                        type="text" className="input" style={{ paddingLeft: '40px' }}
                                        placeholder="Buscar por nombre o rfc..."
                                        value={searchRider}
                                        onChange={e => setSearchRider(e.target.value)}
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={() => {
                                    setRiderFormData({ name: '', username: '', password: '', phone: '', address: '', rfc: '', email: '', assignedRestaurant: '' });
                                    setShowRiderForm(true);
                                }}>
                                    <Plus size={18} /> Nuevo Repartidor
                                </button>
                            </div>
                        </div>

                        {showRiderForm && (
                            <div className="card fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--primary)', maxWidth: '800px' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>{riderFormData.id ? 'Editar Repartidor' : 'Datos del Nuevo Repartidor'}</h3>
                                <form onSubmit={handleSaveRider} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Nombre Completo</label>
                                            <input type="text" className="input" required value={riderFormData.name} onChange={e => setRiderFormData({ ...riderFormData, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>RFC</label>
                                            <input type="text" className="input" required value={riderFormData.rfc} onChange={e => setRiderFormData({ ...riderFormData, rfc: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Usuario</label>
                                            <input type="text" className="input" required value={riderFormData.username} onChange={e => setRiderFormData({ ...riderFormData, username: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Contraseña</label>
                                            <input type="text" className="input" required value={riderFormData.password} onChange={e => setRiderFormData({ ...riderFormData, password: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Teléfono</label>
                                            <input type="tel" className="input" required value={riderFormData.phone} onChange={e => setRiderFormData({ ...riderFormData, phone: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Email</label>
                                            <input type="email" className="input" required value={riderFormData.email} onChange={e => setRiderFormData({ ...riderFormData, email: e.target.value })} />
                                        </div>
                                        <div style={{ gridColumn: 'span 1' }}>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Dirección</label>
                                            <input type="text" className="input" required value={riderFormData.address} onChange={e => setRiderFormData({ ...riderFormData, address: e.target.value })} />
                                        </div>
                                        <div style={{ gridColumn: 'span 1' }}>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Asignar Restaurante (Opcional)</label>
                                            <select
                                                className="input"
                                                value={riderFormData.assignedRestaurant}
                                                onChange={e => setRiderFormData({ ...riderFormData, assignedRestaurant: e.target.value })}
                                            >
                                                <option value="">Cualquier restaurante (Abierto)</option>
                                                {restaurants.map(r => (
                                                    <option key={r.id} value={r.name}>{r.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" className="btn" onClick={() => setShowRiderForm(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">{riderFormData.id ? 'Guardar Cambios' : 'Registrar Repartidor'}</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="card" style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Repartidor</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Asignado a</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>RFC</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Usuario/Pass</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Entregas</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Contacto</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#64748B' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveryRiders.filter(r =>
                                        r.name.toLowerCase().includes(searchRider.toLowerCase()) ||
                                        r.rfc.toLowerCase().includes(searchRider.toLowerCase())
                                    ).map(rider => (
                                        <tr key={rider.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {rider.image ? <img src={rider.image} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : <Bike size={16} color="#64748B" />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{rider.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{rider.address}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {rider.assignedRestaurant ? (
                                                    <span style={{ fontSize: '0.85rem', background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>
                                                        {rider.assignedRestaurant}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Libre (Todos)</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{rider.rfc}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                                <div>U: {rider.username}</div>
                                                <div style={{ color: '#94A3B8' }}>P: {rider.password}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ background: '#F0FDF4', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                                                    {rider.totalDeliveries} done
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                                <div>{rider.phone}</div>
                                                <div style={{ color: '#94A3B8' }}>{rider.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleEditRider(rider)}
                                                    style={{ color: '#3B82F6', background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
