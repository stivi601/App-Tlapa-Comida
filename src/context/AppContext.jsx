import { createContext, useState, useContext, useEffect } from 'react';
import { ORDER_STATUS } from '../constants/orderStatus';

const AppContext = createContext();

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('tu-dominio'))
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

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
    const [customerAddresses, setCustomerAddresses] = useState([
        { id: 1, label: 'Casa', address: 'Calle 5 Poniente #12, Centro' },
        { id: 2, label: 'Trabajo', address: 'Av. Universidad #100, Col. Roma' }
    ]);
    const [registeredUsers, setRegisteredUsers] = useState([
        { id: 'cust1', name: 'Juan Perez', email: 'juan@example.com', phone: '555-1234', date: '2025-10-01' },
        { id: 'cust2', name: 'Ana Garcia', email: 'ana@example.com', phone: '555-4321', date: '2025-11-15' }
    ]);
    const [systemNotifications, setSystemNotifications] = useState([
        { id: 1, title: '¡Bienvenido!', message: 'Gracias por descargar Tlapa Comida.', date: 'Ahora' }
    ]);
    const [deliveryRiders, setDeliveryRiders] = useState([
        { id: 1, name: 'Carlos Velasquez', username: 'carlos', password: '123', phone: '757-123-4567', rfc: 'VEVC900101', email: 'carlos@tlapa.com', address: 'Calle Principal #10', image: null, totalDeliveries: 5 }
    ]);

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

    const addRestaurant = (data) => {
        const newRest = {
            id: Date.now(),
            menu: [],
            rating: 5.0,
            ...data
        };
        setRestaurants([...restaurants, newRest]);
    };

    const updateRestaurant = (id, data) => {
        setRestaurants(restaurants.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const deleteRestaurant = (id) => {
        setRestaurants(restaurants.filter(r => r.id !== id));
    };


    // ============================================
    // POLLING DE DATOS (Simulación Real-Time)
    // ============================================
    useEffect(() => {
        // Interval para refrescar órdenes y restaurantes cada 10s
        const interval = setInterval(() => {
            const fetchUpdates = async () => {
                try {
                    // Refrescar restaurantes para estados (open/closed)
                    const resRest = await fetch(`${API_URL}/api/restaurants`);
                    if (resRest.ok) {
                        const dataRest = await resRest.json();
                        setRestaurants(prev => {
                            // Solo actualizar si hay cambios significativos, 
                            // pero por simplicidad de React, setstate funciona.
                            // Si queremos evitar re-renders innecesarios, podríamos comparar.
                            // Si categories ya es array o no existe
                            return dataRest.map(r => ({
                                ...r,
                                categories: (typeof r.categories === 'string') ? JSON.parse(r.categories) : (r.categories || [])
                            }));
                        });
                    }

                    // Refrescar órdenes si soy delivery o restaurante logueado
                    // Nota: para Customers, ya hay un useEffect que carga 'my-orders' al montar.
                    // Podríamos refrescar mis órdenes también aquí si customerUser existe.

                    if (customerUser?.token) {
                        const resMyOrders = await fetch(`${API_URL}/api/orders/my-orders`, {
                            headers: { 'Authorization': `Bearer ${customerUser.token}` }
                        });
                        if (resMyOrders.ok) {
                            const myOrders = await resMyOrders.json();
                            // Actualizar solo las mías podría ser conflicto con el estado global 'orders' 
                            // que parece ser usado para todo. 
                            // En este AppContext, 'orders' parece ser una lista GLOBAL para fines de demo
                            // o una lista personal?
                            // Revisando el código original: 'orders' se usa en Admin y RestaurantApp.
                            // CustomerApp usa 'activeOrders' filter del global 'orders' O pide sus propias.
                            // Vamos a asumir que 'orders' en AppContext es LA lista global para Admin/Restaurante (mock),
                            // pero el backend real tiene endpoints separados.

                            // Si estamos en modo "Backend Real", AppContext debería quizás
                            // exponer 'refreshOrders' y que cada componente llame lo suyo,
                            // o centralizarlo aquí.

                            // Por ahora, para simplificar el UX de "Real time":
                            // Refrescaremos las órdenes globales SOLO si hay un admin o restaurante "logueado" (simulado).
                            // O simplemente refrescamos '/api/orders' si queremos ver todo (Admin).
                        }
                    }

                } catch (err) {
                    console.error("Polling error", err);
                }
            };
            fetchUpdates();
        }, 10000); // 10 segundos

        return () => clearInterval(interval);
    }, [customerUser]); // Dependencias

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

    const updateCustomerUser = async (data) => {
        if (!customerUser?.token) return { success: false, error: "No autenticado" };

        try {
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${customerUser.token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Error al actualizar perfil");

            // Mantener el token del usuario actual ya que el endpoint no lo devuelve
            setCustomerUser({ ...result, token: customerUser.token });
            return { success: true };
        } catch (error) {
            console.error("Update profile error", error);
            return { success: false, error: error.message };
        }
    };

    const addAddress = (addr) => {
        setCustomerAddresses([...customerAddresses, { id: Date.now(), ...addr }]);
    };

    const removeAddress = (id) => {
        setCustomerAddresses(customerAddresses.filter(a => a.id !== id));
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

    const addDeliveryRider = (riderData) => {
        const newRider = {
            id: Date.now(),
            totalDeliveries: 0,
            image: null,
            ...riderData
        };
        setDeliveryRiders([...deliveryRiders, newRider]);
    };

    const updateDeliveryRider = (id, data) => {
        setDeliveryRiders(deliveryRiders.map(r => r.id === id ? { ...r, ...data } : r));
        if (deliveryUser?.id === id) {
            setDeliveryUser({ ...deliveryUser, ...data });
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
        if (cart.items.length === 0) return false;
        if (!customerUser || !customerUser.token) {
            alert("Debes iniciar sesión para ordenar");
            return false;
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
            return true;
        } catch (error) {
            console.error("Error placeOrder", error);
            alert("Error al realizar el pedido: " + error.message);
            return false;
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

    // Funciones de menú eliminadas (ahora gestionadas directamente por RestaurantApp con API)


    return (
        <AppContext.Provider value={{
            restaurants, orders, cart, restaurantCategories,
            addToCart, removeFromCart, decrementFromCart, clearCart, placeOrder,
            cancelOrder, confirmOrderReceived, updateOrderStatus,
            addRestaurantCategory, removeRestaurantCategory,
            addRestaurant, updateRestaurant, deleteRestaurant,
            customerUser, loginCustomer, logoutCustomer, registerCustomer,
            customerAddresses, addAddress, removeAddress, updateAddress,
            registeredUsers, systemNotifications, sendMassNotification,
            deliveryRiders, deliveryUser, loginDelivery, addDeliveryRider, updateDeliveryRider, rateRestaurant, setDeliveryUser,
            updateOrder, updateCustomerUser
        }}>
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
