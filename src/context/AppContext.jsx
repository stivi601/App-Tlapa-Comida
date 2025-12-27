import { createContext, useState, useContext, useEffect } from 'react';
import { ORDER_STATUS } from '../constants/orderStatus';

const AppContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * AppProvider - Proveedor del contexto global de la aplicación
 * Maneja todo el estado compartido entre los 4 módulos:
 * - Customer App
 * - Restaurant App
 * - Delivery App
 * - Admin App
 */
export const AppProvider = ({ children }) => {
    // ============================================
    // ESTADO GLOBAL
    // ============================================

    // Listas dinámicas
    const [restaurantCategories, setRestaurantCategories] = useState([
        'Tacos', 'Pizzas', 'Hamburguesas', 'Japonesa',
        'Postres', 'Cafetería', 'Mexicana', 'Pollos'
    ]);

    // ESTADO DE RESTAURANTES (Cargado del Backend)
    const [restaurants, setRestaurants] = useState([]);
    const [loadingRestaurants, setLoadingRestaurants] = useState(true);
    const [errorRestaurants, setErrorRestaurants] = useState(null);

    // Usuarios y Autenticación
    const [customerUser, setCustomerUser] = useState(null);
    const [deliveryUser, setDeliveryUser] = useState(null);

    // Pedidos y Carrito
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState({ restaurantName: null, items: [], total: 0 });

    // Datos Adicionales (Direcciones, Notificaciones, etc.)
    const [customerAddresses, setCustomerAddresses] = useState([]);
    // registeredUsers eliminado: ahora se gestiona directamente desde la API en AdminApp
    const [systemNotifications, setSystemNotifications] = useState([
        { id: 1, title: '¡Bienvenido!', message: 'Gracias por descargar Tlapa Comida.', date: 'Ahora' }
    ]);
    const [deliveryRiders, setDeliveryRiders] = useState([]);

    // Cargar restaurantes desde el Backend al iniciar
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // URL directa al backend local por ahora
                const response = await fetch(`${API_URL}/api/restaurants`);
                if (!response.ok) throw new Error('Error al cargar restaurantes');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRestaurants(data);

                    // Actualizar categorías dinámicamente basado en los restaurantes
                    const allCats = new Set([...restaurantCategories]);
                    data.forEach(r => {
                        if (Array.isArray(r.categories)) {
                            r.categories.forEach(c => allCats.add(c));
                        }
                    });
                    setRestaurantCategories(Array.from(allCats));
                } else {
                    console.error("Data received is not an array:", data);
                    setRestaurants([]);
                }

            } catch (err) {
                console.error("Error fetching restaurants:", err);
                setErrorRestaurants(err.message);
                // Fallback a datos vacíos o mostrar error
            } finally {
                setLoadingRestaurants(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Pedidos activos en el sistema

    // Cargar pedidos del usuario
    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!customerUser?.token) return;
            try {
                const res = await fetch(`${API_URL}/api/orders/my-orders`, {
                    headers: { 'Authorization': `Bearer ${customerUser.token}` }
                });
                if (res.ok) {
                    const data = await res.json();

                    if (Array.isArray(data)) {
                        // Formatear para frontend
                        const formatted = data.map(o => ({
                            ...o,
                            customer: o.customer?.name || "Yo",
                            restaurant: o.restaurant?.name,
                            items: o.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')
                        }));
                        setOrders(formatted);
                    }
                }
            } catch (e) { console.error(e); }
        };
        fetchMyOrders();
    }, [customerUser]);

    // Carrito de compras del cliente actual

    // ============================================
    // FUNCIONES DE ADMINISTRACIÓN
    // ============================================
    const addRestaurantCategory = (name) => {
        if (!restaurantCategories.includes(name)) {
            setRestaurantCategories([...restaurantCategories, name]);
        }
    };

    const removeRestaurantCategory = (name) => {
        setRestaurantCategories(restaurantCategories.filter(c => c !== name));
    };

    const addRestaurant = async (data, token) => {
        try {
            const res = await fetch(`${API_URL}/api/restaurants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const newRest = await res.json();
                setRestaurants([...restaurants, newRest]);
                return true;
            }
        } catch (error) {
            console.error("Error adding restaurant", error);
        }
        return false;
    };

    const updateRestaurant = async (id, data, token) => {
        try {
            const res = await fetch(`${API_URL}/api/restaurants/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const updated = await res.json();
                setRestaurants(restaurants.map(r => r.id === id ? { ...r, ...updated } : r));
            }
        } catch (error) {
            console.error("Error updating restaurant", error);
        }
    };

    const deleteRestaurant = async (id, token) => {
        try {
            const res = await fetch(`${API_URL}/api/restaurants/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRestaurants(restaurants.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error("Error deleting restaurant", error);
        }
    };


    // ============================================
    // FUNCIONES DE CLIENTES
    // ============================================

    const loginCustomer = async (method, data) => {
        try {
            // Asumimos login con email/password por ahora para simplificar la integración con backend existente
            // Si el frontend manda 'method' phone, tendríamos que adaptar el backend o el form.
            // Por ahora mapeamos data.email y password (que falta en el form login, ojo).
            // Si es login sin password (solo email/phone), necesitamos ajustar.
            // Para el MVP, usaremos la ruta de registro/login normal.

            const payload = {
                email: data.email,
                password: data.password || '123456' // Password default si el UI no lo pide aun
            };

            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            setCustomerUser({ ...result.user, token: result.token });
            loadAddresses(result.token);
            return { success: true };
        } catch (error) {
            console.error("Login error", error);
            return { success: false, error: error.message };
        }
    };

    const registerCustomer = async (data) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password || '123456',
                    phone: data.phone
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            setCustomerUser({ ...result.user, token: result.token });
            return { success: true };
        } catch (error) {
            console.error("Register error", error);
            return { success: false, error: error.message };
        }
    };

    const logoutCustomer = () => setCustomerUser(null);

    const updateCustomerUser = (data) => {
        if (!customerUser) return;
        const updated = { ...customerUser, ...data };
        setCustomerUser(updated);
    };



    const loadAddresses = async (token) => {
        try {
            const res = await fetch(`${API_URL}/api/users/addresses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCustomerAddresses(data);
            }
        } catch (error) {
            console.error("Error loading addresses", error);
        }
    };

    const addAddress = async (addr, token) => {
        try {
            const res = await fetch(`${API_URL}/api/users/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addr)
            });
            if (res.ok) {
                const newAddr = await res.json();
                setCustomerAddresses([...customerAddresses, newAddr]);
                return true;
            }
        } catch (error) {
            console.error("Error adding address", error);
        }
        return false;
    };

    const removeAddress = async (id, token) => {
        try {
            const res = await fetch(`${API_URL}/api/users/addresses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setCustomerAddresses(customerAddresses.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error("Error deleting address", error);
        }
    };

    const updateAddress = (id, data) => {
        setCustomerAddresses(customerAddresses.map(a => a.id === id ? { ...a, ...data } : a));
    };

    const sendMassNotification = (notif) => {
        const newNotif = {
            id: Date.now(),
            ...notif,
            date: 'Justo ahora'
        };
        setSystemNotifications([newNotif, ...systemNotifications]);
    };

    // ============================================
    // FUNCIONES DE REPARTIDORES
    // ============================================

    const loginDelivery = (username, password) => {
        const rider = deliveryRiders.find(r => r.username === username && r.password === password);
        if (rider) {
            setDeliveryUser(rider);
            return true;
        }
        return false;
    };

    const addDeliveryRider = async (riderData, token) => {
        try {
            const res = await fetch(`${API_URL}/api/delivery/riders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(riderData)
            });
            if (res.ok) {
                const newRider = await res.json();
                setDeliveryRiders([...deliveryRiders, newRider]);
                return true;
            }
        } catch (error) {
            console.error("Error adding rider", error);
        }
        return false;
    };

    const updateDeliveryRider = async (id, data, token) => {
        // Si no hay token (ej. actualización interna de status), manejamos diferente o requerimos token sistema?
        // Para AdminApp siempre habrá token. Para update interno (status), se usa otro endpoint.
        // Asumiremos uso Admin aquí.
        if (!token) {
            // Fallback updates locales si no es admin operation (ej. simulaciones, aunque deberíamos mover todo a backend)
            setDeliveryRiders(deliveryRiders.map(r => r.id === id ? { ...r, ...data } : r));
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/delivery/riders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const updated = await res.json();
                setDeliveryRiders(deliveryRiders.map(r => r.id === id ? { ...r, ...updated } : r));
            }
        } catch (error) {
            console.error("Error updating rider", error);
        }
    };

    // Función para cargar riders (llamada desde AdminApp)
    const loadDeliveryRiders = async (token) => {
        try {
            const res = await fetch(`${API_URL}/api/delivery/riders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDeliveryRiders(data);
            }
        } catch (error) {
            console.error("Error loading riders", error);
        }
    };

    const rateRestaurant = (restaurantName, rating) => {
        setRestaurants(restaurants.map(r => {
            if (r.name === restaurantName) {
                // For a simple mock, we'll just update the rating as an average (conceptually)
                const currentRating = r.rating || 5;
                const newRating = ((currentRating + rating) / 2).toFixed(1);
                return { ...r, rating: parseFloat(newRating) };
            }
            return r;
        }));
    };

    // ============================================
    // FUNCIONES DE AUTENTICACIÓN
    // ============================================
    const loginRestaurant = (username, password) => {
        return restaurants.find(r => r.username === username && r.password === password) || null;
    };


    const addToCart = (item, restaurantName, price) => {
        // Validación: Solo un restaurante a la vez
        if (cart.restaurantId && cart.restaurantId !== item.restaurantId) {
            // Nota: item.restaurantId debe venir del objeto si existe, o usamos restaurantName para comparar por ahora
            // Si el objeto item viene de selectedRestaurant.menu, no siempre trae restaurantId explícito en el JSON anidado
            // Compararemos por nombre que es lo que teníamos, o id si pasamos el id del restaurante.
        }

        // Mejor usamos el nombre por compatibilidad con código existente, pero guardamos el ID del restaurante si podemos.
        // Asumiremos que el frontend limpia el carrito si cambia de restaurante manualmente.
        if (cart.restaurantName && cart.restaurantName !== restaurantName) {
            return false;
        }

        const existingItemIndex = cart.items.findIndex(i => i.id === item.id); // Usar ID para unicidad
        let newItems = [];

        if (existingItemIndex > -1) {
            newItems = cart.items.map((cartItem, idx) =>
                idx === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
        } else {
            // Guardamos ID, nombre, precio para el POST del backend
            newItems = [...cart.items, { id: item.id, name: item.name, price, quantity: 1 }];
        }

        // Encontrar el restaurante para obtener su ID (necesario para el backend order)
        const restId = restaurants.find(r => r.name === restaurantName)?.id;

        setCart({
            restaurantName,
            restaurantId: restId,
            items: newItems,
            total: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        });
        return true;
    };

    const decrementFromCart = (itemName) => {
        // FIXME: Ajustar a itemID cuando refactoricemos todo, usando name por ahora compatible
        const existingItemIndex = cart.items.findIndex(i => i.name === itemName);
        if (existingItemIndex === -1) return;

        let newItems = [];
        const item = cart.items[existingItemIndex];

        if (item.quantity > 1) {
            newItems = cart.items.map((i, idx) =>
                idx === existingItemIndex ? { ...i, quantity: i.quantity - 1 } : i
            );
        } else {
            newItems = cart.items.filter((_, idx) => idx !== existingItemIndex);
        }

        setCart({
            ...cart,
            items: newItems,
            total: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0),
            restaurantName: newItems.length === 0 ? null : cart.restaurantName
        });
    };

    const removeFromCart = (index) => {
        const newItems = cart.items.filter((_, i) => i !== index);
        setCart({
            ...cart,
            items: newItems,
            total: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0),
            restaurantName: newItems.length === 0 ? null : cart.restaurantName
        });
    };

    const clearCart = () => setCart({ restaurantId: null, restaurantName: null, items: [], total: 0 });

    const placeOrder = async () => {
        if (cart.items.length === 0) return;
        if (!customerUser || !customerUser.token) {
            alert("Debes iniciar sesión para ordenar");
            return;
        }

        try {
            const payload = {
                restaurantId: cart.restaurantId,
                total: cart.total,
                items: cart.items.map(i => ({
                    id: i.id,
                    quantity: i.quantity,
                    price: i.price
                }))
            };

            const res = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${customerUser.token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error al crear pedido');
            }

            const newOrder = await res.json();

            // Agregar al estado local mockeando la estructura visual si difiere
            const formattedOrder = {
                ...newOrder,
                time: "Ahora mismo",
                customer: customerUser.name,
                restaurant: cart.restaurantName,
                // Items string para display rápido en frontend existente
                items: cart.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
            };

            setOrders([formattedOrder, ...orders]);
            clearCart();
            alert("¡Pedido realizado con éxito!");
        } catch (error) {
            console.error("Error placeOrder", error);
            alert("Error al realizar el pedido: " + error.message);
        }
    };

    const cancelOrder = (orderId) => {
        setOrders(orders.filter(o => o.id !== orderId));
    };

    const confirmOrderReceived = (orderId) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: ORDER_STATUS.COMPLETED } : o));
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(orders.map(o => {
            if (o.id === orderId) {
                // If marking as completed, increment rider count
                if (status === ORDER_STATUS.COMPLETED && deliveryUser) {
                    updateDeliveryRider(deliveryUser.id, { totalDeliveries: (deliveryUser.totalDeliveries || 0) + 1 });
                }
                return { ...o, status, riderId: deliveryUser?.id };
            }
            return o;
        }));
    };

    const updateOrder = (orderId, data) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, ...data } : o));
    };

    const addMenuItem = (restaurantId, newItem) => {
        setRestaurants(restaurants.map(r => {
            if (r.id === restaurantId) {
                return { ...r, menu: [...(r.menu || []), newItem] };
            }
            return r;
        }));
    };

    const getCategories = (restaurantId) => {
        const r = restaurants.find(r => r.id === restaurantId);
        if (!r) return [];
        const cats = new Set(r.menu?.map(m => m.category) || []);
        return Array.from(cats);
    };

    const removeMenuItem = (restaurantId, itemToRemove) => {
        setRestaurants(restaurants.map(r => {
            if (r.id === restaurantId) {
                return { ...r, menu: r.menu.filter(i => i !== itemToRemove) };
            }
            return r;
        }));
    };

    const removeMenuCategory = (restaurantId, categoryName) => {
        setRestaurants(restaurants.map(r => {
            if (r.id === restaurantId) {
                return { ...r, menu: r.menu.filter(i => i.category !== categoryName) };
            }
            return r;
        }));
    };

    return (
        <AppContext.Provider value={{
            restaurants, orders, cart, restaurantCategories,
            addToCart, removeFromCart, decrementFromCart, clearCart, placeOrder,
            cancelOrder, confirmOrderReceived, updateOrderStatus,
            addMenuItem, getCategories, removeMenuItem, removeMenuCategory,
            addRestaurantCategory, removeRestaurantCategory,
            addRestaurant, updateRestaurant, deleteRestaurant, loginRestaurant,
            customerUser, loginCustomer, logoutCustomer, registerCustomer,
            customerAddresses, addAddress, removeAddress, updateAddress,
            systemNotifications, sendMassNotification,
            deliveryRiders, deliveryUser, loginDelivery, addDeliveryRider, updateDeliveryRider, loadDeliveryRiders, rateRestaurant, setDeliveryUser,
            updateOrder, updateCustomerUser
        }}>
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
