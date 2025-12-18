import { createContext, useState, useContext, useEffect } from 'react';
import { ORDER_STATUS } from '../constants/orderStatus';

const AppContext = createContext();

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
    // ESTADO GLOBAL - DATOS MOCK
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

    // Cargar restaurantes desde el Backend al iniciar
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // URL directa al backend local por ahora
                const response = await fetch('http://localhost:3000/api/restaurants');
                if (!response.ok) throw new Error('Error al cargar restaurantes');
                const data = await response.json();

                setRestaurants(data);

                // Actualizar categorías dinámicamente basado en los restaurantes
                const allCats = new Set([...restaurantCategories]);
                data.forEach(r => {
                    if (Array.isArray(r.categories)) {
                        r.categories.forEach(c => allCats.add(c));
                    }
                });
                setRestaurantCategories(Array.from(allCats));

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
    const [orders, setOrders] = useState([
        { id: 101, customer: "Juan Perez", restaurant: "Tacos El Paisa", items: "3x Tacos Pastor", total: 150, status: ORDER_STATUS.PENDING, time: "Hace 5 min" },
        { id: 102, customer: "Ana Garcia", restaurant: "Burger King Tlapa", items: "1x Whopper Combo", total: 180, status: ORDER_STATUS.PREPARING, time: "Hace 15 min" },
        { id: 103, customer: "Maria Lopez", restaurant: "Tacos El Paisa", items: "2x Combo Especial, 1x Horchata", total: 225, status: ORDER_STATUS.READY, time: "Hace 2 min" }
    ]);

    // Carrito de compras del cliente actual
    const [cart, setCart] = useState({ restaurantName: null, items: [], total: 0 });

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
    // ESTADO Y FUNCIONES DE CLIENTES
    // ============================================
    const [customerUser, setCustomerUser] = useState(null);
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

    const loginCustomer = (method, data) => {
        const user = registeredUsers.find(u => u.email === data.email);
        if (user) {
            setCustomerUser(user);
            return true;
        }
        // Fallback for mock simplicity if not found
        const newUser = { id: 'cust1', name: 'Juan Perez', email: data.email || 'juan@example.com', phone: data.phone || '555-1234' };
        setCustomerUser(newUser);
        return true;
    };

    const registerCustomer = (data) => {
        const newUser = {
            id: Date.now().toString(),
            ...data,
            date: new Date().toISOString().split('T')[0]
        };
        setRegisteredUsers([...registeredUsers, newUser]);
        setCustomerUser(newUser);
        return true;
    };

    const logoutCustomer = () => setCustomerUser(null);

    const updateCustomerUser = (data) => {
        if (!customerUser) return;
        const updated = { ...customerUser, ...data };
        setCustomerUser(updated);
        setRegisteredUsers(registeredUsers.map(u => u.id === customerUser.id ? updated : u));
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
    // ESTADO Y FUNCIONES DE REPARTIDORES
    // ============================================
    const [deliveryRiders, setDeliveryRiders] = useState([
        { id: 1, name: 'Carlos Velasquez', username: 'carlos', password: '123', phone: '757-123-4567', rfc: 'VEVC900101', email: 'carlos@tlapa.com', address: 'Calle Principal #10', image: null, totalDeliveries: 5 }
    ]);
    const [deliveryUser, setDeliveryUser] = useState(null);

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

    // ============================================
    // FUNCIONES DE AUTENTICACIÓN
    // ============================================
    const loginRestaurant = (username, password) => {
        return restaurants.find(r => r.username === username && r.password === password) || null;
    };


    const addToCart = (itemName, restaurantName, price) => {
        if (cart.restaurantName && cart.restaurantName !== restaurantName) {
            return false;
        }

        const existingItemIndex = cart.items.findIndex(i => i.name === itemName);
        let newItems = [];

        if (existingItemIndex > -1) {
            newItems = cart.items.map((item, idx) =>
                idx === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            newItems = [...cart.items, { name: itemName, price, quantity: 1 }];
        }

        setCart({
            restaurantName,
            items: newItems,
            total: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        });
        return true;
    };

    const decrementFromCart = (itemName) => {
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

    const clearCart = () => setCart({ restaurantName: null, items: [], total: 0 });

    const placeOrder = () => {
        if (cart.items.length === 0) return;
        const newOrder = {
            id: Date.now(),
            customer: customerUser?.name || "Usuario Actual",
            restaurant: cart.restaurantName,
            items: cart.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
            total: cart.total,
            status: ORDER_STATUS.PENDING,
            time: "Ahora mismo",
            rating: null
        };
        setOrders([newOrder, ...orders]);
        clearCart();
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
