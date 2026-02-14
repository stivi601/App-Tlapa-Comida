import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Store, TrendingUp, DollarSign, Activity, Trash2, Plus, Camera, Bell, Bike, ShieldCheck, Truck, Search, LogOut, X } from 'lucide-react';
import AdminLogin from '../components/AdminLogin';
import CategoryManager from './CategoryManagerComponent';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('tu-dominio'))
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

export default function AdminApp() {
    const {
        restaurants, orders,
        restaurantCategories, addRestaurantCategory, removeRestaurantCategory,
        addRestaurant, updateRestaurant, deleteRestaurant,
        sendMassNotification,
        deliveryRiders, addDeliveryRider, updateDeliveryRider, loadDeliveryRiders,
        adminUser, setAdminUser } = useApp();

    const [activeSection, setActiveSection] = useState('Dashboard');
    const [newCatName, setNewCatName] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);

    // Notification State
    const [newNotif, setNewNotif] = useState({ title: '', message: '' });
    const [notifSent, setNotifSent] = useState(false);

    // Restaurant Form State
    const [showRestForm, setShowRestForm] = useState(false);
    const [restFormData, setRestFormData] = useState({
        id: null, name: '', username: '', password: '',
        categories: [], image: '', time: '15-25 min', deliveryFee: 20
    });

    // Rider Form State
    const [showRiderForm, setShowRiderForm] = useState(false);
    const [riderFormData, setRiderFormData] = useState({ name: '', username: '', password: '', phone: '', address: '', rfc: '', email: '', assignedRestaurantId: '', image: '' });

    // Search States
    const [searchRest, setSearchRest] = useState('');
    const [searchRider, setSearchRider] = useState('');
    const [searchUser, setSearchUser] = useState('');

    // Available Categories (local cache)
    const [availableCategories, setAvailableCategories] = useState([]);

    // Users List State
    const [users, setUsers] = useState([]);

    // Stats State
    const [stats, setStats] = useState({ sales: 0, restaurants: 0, orders: 0, users: 0, riders: 0 });

    // Report State
    const [reportStartDate, setReportStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().slice(0, 10));
    const [reportRestFilter, setReportRestFilter] = useState('');
    const [reportRiderFilter, setReportRiderFilter] = useState('');
    const [reportData, setReportData] = useState(null);

    const fetchReports = async () => {
        if (!adminUser) return;
        try {
            const params = new URLSearchParams({
                startDate: reportStartDate,
                endDate: reportEndDate
            });
            if (reportRestFilter) params.append('restaurantId', reportRestFilter);
            if (reportRiderFilter) params.append('riderId', reportRiderFilter);

            const res = await fetch(`${API_URL}/api/admin/reports?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${adminUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            }
        } catch (error) {
            console.error("Error fetching reports", error);
        }
    };

    const fetchData = async () => {
        if (!adminUser) return;
        try {
            const h = { 'Authorization': `Bearer ${adminUser.token}` };

            // Stats
            const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers: h });
            if (statsRes.ok) setStats(await statsRes.json());

            // Users
            const usersRes = await fetch(`${API_URL}/api/admin/users`, { headers: h });
            if (usersRes.ok) setUsers(await usersRes.json());

            // Riders
            loadDeliveryRiders(adminUser.token);

            // Fetch Reports
            fetchReports();
        } catch (error) {
            console.error("Error loading admin data", error);
        }
    };

    useEffect(() => {
        if (adminUser) fetchData();
    }, [adminUser, activeSection]);

    // Re-fetch reports when filters change if in Dashboard
    useEffect(() => {
        if (adminUser && activeSection === 'Dashboard') {
            fetchReports();
        }
    }, [adminUser, activeSection, reportStartDate, reportEndDate, reportRestFilter, reportRiderFilter]);

    const handleLogout = () => {
        setAdminUser(null);
    };

    const toggleRestCategory = (cat) => {
        setRestFormData(prev => {
            const current = prev.categories || [];
            if (current.includes(cat)) {
                return { ...prev, categories: current.filter(c => c !== cat) };
            } else {
                return { ...prev, categories: [...current, cat] };
            }
        });
    };

    const handleEditRestaurant = (r) => {
        setRestFormData({ ...r });
        setShowRestForm(true);
    };

    const handleSaveRestaurant = async (e) => {
        e.preventDefault();
        const finalData = {
            ...restFormData,
            deliveryFee: parseFloat(restFormData.deliveryFee) || 0
        };

        if (finalData.id) {
            await updateRestaurant(finalData.id, finalData, adminUser.token);
        } else {
            await addRestaurant(finalData, adminUser.token);
        }
        fetchData();
        setShowRestForm(false);
        setRestFormData({
            id: null, name: '', username: '', password: '',
            categories: [], image: '', time: '15-25 min', deliveryFee: 20
        });
    };

    const handleSendNotif = (e) => {
        e.preventDefault();
        sendMassNotification(newNotif);
        setNotifSent(true);
        setNewNotif({ title: '', message: '' });
        setTimeout(() => setNotifSent(false), 3000);
    };

    const handleSaveRider = async (e) => {
        e.preventDefault();
        if (riderFormData.id) {
            await updateDeliveryRider(riderFormData.id, riderFormData, adminUser.token);
        } else {
            await addDeliveryRider(riderFormData, adminUser.token);
        }
        fetchData();
        setShowRiderForm(false);
        setRiderFormData({ name: '', username: '', password: '', phone: '', address: '', rfc: '', email: '', assignedRestaurantId: '', image: '' });
    };

    const handleEditRider = (rider) => {
        setRiderFormData({ ...rider });
        setShowRiderForm(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRiderFormData({ ...riderFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!adminUser) return <AdminLogin onLoginSuccess={setAdminUser} />;

    const totalSales = stats.sales;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', position: 'relative' }}>
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 1100,
                    background: '#10b981', color: 'white', border: 'none',
                    width: '56px', height: '56px', borderRadius: '50%',
                    display: 'none', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                className="mobile-show"
            >
                {showSidebar ? <X /> : <Activity />}
            </button>

            {/* Sidebar */}
            <aside style={{
                width: '250px', background: '#1E293B', color: 'white', padding: '1.5rem',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 1000,
                transition: 'transform 0.3s ease',
                transform: `translateX(${showSidebar ? '0' : '-100%'})`
            }} className="admin-sidebar">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity color="#10b981" /> Admin
                </h2>
                <div style={{ marginBottom: '2rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div style={{ color: '#94A3B8', marginBottom: '2px' }}>Sesión activa</div>
                    <div style={{ fontWeight: '600' }}>{adminUser.username}</div>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {[
                        { name: 'Dashboard', icon: <TrendingUp size={18} /> },
                        { name: 'Restaurantes', icon: <Store size={18} /> },
                        { name: 'Categorías', icon: <Plus size={18} /> },
                        { name: 'Repartidores', icon: <Bike size={18} /> },
                        { name: 'Usuarios', icon: <Users size={18} /> },
                        { name: 'Notificaciones', icon: <Bell size={18} /> }
                    ].map((item) => (
                        <button key={item.name}
                            onClick={() => { setActiveSection(item.name); setShowSidebar(false); }}
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
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'rgba(239,68,68,0.1)',
                        color: '#FCA5A5',
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginTop: 'auto'
                    }}
                >
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>
            </aside>

            {/* Content Overflow Guard */}
            {showSidebar && (
                <div
                    onClick={() => setShowSidebar(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900 }}
                    className="mobile-show"
                />
            )}

            {/* Content */}
            <main style={{ flex: 1, padding: '1.5rem', marginLeft: '0', transition: 'margin 0.3s ease' }} className="admin-main">

                {activeSection === 'Dashboard' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '1.8rem' }}>Dashboard General</h1>
                            <p style={{ color: '#64748B' }}>Panel de control administrativo para Tlapa Comida.</p>
                        </header>

                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Generar Reporte Avanzado</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Fecha Inicio</label>
                                    <input type="date" className="input" style={{ width: '100%' }} value={reportStartDate} onChange={e => setReportStartDate(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Fecha Fin</label>
                                    <input type="date" className="input" style={{ width: '100%' }} value={reportEndDate} onChange={e => setReportEndDate(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Restaurante</label>
                                    <select className="input" style={{ width: '100%' }} value={reportRestFilter} onChange={e => setReportRestFilter(e.target.value)}>
                                        <option value="">Todos</option>
                                        {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                                <button className="btn btn-primary" onClick={fetchReports} style={{ height: '42px' }}>Actualizar</button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#EFF6FF', borderRadius: '12px', color: '#3B82F6' }}><DollarSign size={24} /></div>
                                <div>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Ventas Periodo</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>${(reportData?.summary?.totalSales || 0).toLocaleString()}</h3>
                                </div>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '12px', color: '#166534' }}><Store size={24} /></div>
                                <div>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Pedidos Periodo</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{reportData?.summary?.totalOrders || 0}</h3>
                                </div>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#F5F3FF', borderRadius: '12px', color: '#8B5CF6' }}><Users size={24} /></div>
                                <div>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Usuarios S.</p>
                                    <h3 style={{ fontSize: '1.5rem' }}>{stats.users}</h3>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <div className="card">
                                <h3>Top Restaurantes</h3>
                                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                    <tbody>
                                        {reportData?.restaurantRanking?.map((r, i) => (
                                            <tr key={i}><td style={{ padding: '0.5rem' }}>{r.name}</td><td style={{ textAlign: 'right' }}><b>${r.value.toLocaleString()}</b></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card">
                                <h3>Top Repartidores</h3>
                                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                    <tbody>
                                        {reportData?.riderRanking?.map((r, i) => (
                                            <tr key={i}><td style={{ padding: '0.5rem' }}>{r.name}</td><td style={{ textAlign: 'right' }}><b>{r.value} pedidos</b></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'Restaurantes' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1 style={{ fontSize: '1.8rem' }}>Gestión de Restaurantes</h1>
                            <button className="btn btn-primary" onClick={() => { setRestFormData({ id: null, name: '', username: '', password: '', categories: [], image: '', time: '15-25 min', deliveryFee: 20 }); setShowRestForm(true); }}>
                                <Plus size={18} /> Nuevo Restaurante
                            </button>
                        </header>

                        {showRestForm && (
                            <div className="card" style={{ marginBottom: '2rem', border: '1px solid #10b981' }}>
                                <form onSubmit={handleSaveRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input placeholder="Nombre" className="input" value={restFormData.name} onChange={e => setRestFormData({ ...restFormData, name: e.target.value })} required />
                                        <input placeholder="Usuario" className="input" value={restFormData.username} onChange={e => setRestFormData({ ...restFormData, username: e.target.value })} required />
                                        <input placeholder="Contraseña" type="password" className="input" value={restFormData.password} onChange={e => setRestFormData({ ...restFormData, password: e.target.value })} placeholder={restFormData.id ? "Nueva contraseña (opcional)" : "Contraseña"} />
                                        <input placeholder="Tiempo (ej: 20 min)" className="input" value={restFormData.time} onChange={e => setRestFormData({ ...restFormData, time: e.target.value })} />
                                        <input placeholder="Tarifa Envío" type="number" className="input" value={restFormData.deliveryFee} onChange={e => setRestFormData({ ...restFormData, deliveryFee: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Categorías</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {restaurantCategories.map(cat => (
                                                <button type="button" key={cat} onClick={() => toggleRestCategory(cat)} style={{
                                                    padding: '4px 12px', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '0.8rem',
                                                    background: restFormData.categories.includes(cat) ? '#10b981' : 'white',
                                                    color: restFormData.categories.includes(cat) ? 'white' : '#64748B'
                                                }}>{cat}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn btn-primary">Guardar</button>
                                        <button type="button" className="btn" onClick={() => setShowRestForm(false)}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {restaurants.filter(r => r.name.toLowerCase().includes(searchRest.toLowerCase())).map(r => (
                                <div key={r.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h3 style={{ fontSize: '1.1rem' }}>{r.name}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditRestaurant(r)} style={{ color: '#3B82F6', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => { if (window.confirm('¿Borrar?')) deleteRestaurant(r.id, adminUser.token) }} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}>Del</button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Login: {r.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'Categorías' && (
                    <CategoryManager API_URL={API_URL} token={adminUser.token} />
                )}

                {activeSection === 'Repartidores' && (
                    <div className="fade-in">
                        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1 style={{ fontSize: '1.8rem' }}>Repartidores</h1>
                            <button className="btn btn-primary" onClick={() => { setRiderFormData({ name: '', username: '', password: '', phone: '', address: '', rfc: '', email: '', assignedRestaurantId: '', image: '' }); setShowRiderForm(true); }}>
                                <Plus size={18} /> Nuevo Repartidor
                            </button>
                        </header>

                        {showRiderForm && (
                            <div className="card" style={{ marginBottom: '2rem' }}>
                                <form onSubmit={handleSaveRider} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input placeholder="Nombre" className="input" value={riderFormData.name} onChange={e => setRiderFormData({ ...riderFormData, name: e.target.value })} required />
                                        <input placeholder="RFC" className="input" value={riderFormData.rfc} onChange={e => setRiderFormData({ ...riderFormData, rfc: e.target.value })} required />
                                        <input placeholder="Usuario" className="input" value={riderFormData.username} onChange={e => setRiderFormData({ ...riderFormData, username: e.target.value })} required />
                                        <input placeholder="Password" type="password" className="input" value={riderFormData.password} onChange={e => setRiderFormData({ ...riderFormData, password: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn btn-primary">Guardar</button>
                                        <button type="button" className="btn" onClick={() => setShowRiderForm(false)}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="card" style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>RFC</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveryRiders.map(rider => (
                                        <tr key={rider.id} style={{ borderTop: '1px solid #E2E8F0' }}>
                                            <td style={{ padding: '1rem' }}>{rider.name}</td>
                                            <td style={{ padding: '1rem' }}>{rider.rfc}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button onClick={() => handleEditRider(rider)} style={{ color: '#3B82F6', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'Usuarios' && (
                    <div className="fade-in">
                        <h1>Usuarios</h1>
                        <div className="card" style={{ padding: 0, marginTop: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} style={{ borderTop: '1px solid #E2E8F0' }}>
                                            <td style={{ padding: '1rem' }}>{u.name}</td>
                                            <td style={{ padding: '1rem' }}>{u.email}</td>
                                            <td style={{ padding: '1rem' }}>{u.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'Notificaciones' && (
                    <div className="fade-in">
                        <h1>Notificaciones</h1>
                        <div className="card" style={{ maxWidth: '600px', marginTop: '1rem' }}>
                            <form onSubmit={handleSendNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input placeholder="Título" className="input" value={newNotif.title} onChange={e => setNewNotif({ ...newNotif, title: e.target.value })} required />
                                <textarea placeholder="Mensaje" className="input" style={{ minHeight: '100px' }} value={newNotif.message} onChange={e => setNewNotif({ ...newNotif, message: e.target.value })} required />
                                <button type="submit" className="btn btn-primary">Enviar a todos</button>
                                {notifSent && <p style={{ color: '#10b981' }}>¡Enviado!</p>}
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
