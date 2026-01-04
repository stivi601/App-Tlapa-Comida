import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useApp } from './AppContext'; // Usamos useApp para obtener el usuario autenticado

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Obtenemos el usuario de cualquiera de los contextos (Customer, Restaurant, Delivery, Admin)
    const { customerUser, restaurantUser, deliveryUser, adminUser } = useApp();

    // Determinar el usuario activo y su rol
    const activeUser = customerUser || restaurantUser || deliveryUser || adminUser;

    useEffect(() => {
        if (!activeUser) return;

        let role = 'guest';
        let id = activeUser.id;

        if (customerUser) role = 'customer';
        else if (restaurantUser) role = 'restaurant';
        else if (deliveryUser) role = 'driver';
        else if (adminUser) role = 'admin';

        // URL del backend (ajustar si es necesario)
        const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const socketInstance = io(URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
            console.log('✅ Conectado a WebSocket:', socketInstance.id);
            setIsConnected(true);

            // Registrar usuario
            socketInstance.emit('register_user', {
                userId: id,
                userType: role
            });
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Desconectado de WebSocket');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [customerUser, restaurantUser, deliveryUser, adminUser]);

    const joinOrderRoom = (orderId) => {
        if (socket) socket.emit('join_order_room', orderId);
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, joinOrderRoom }}>
            {children}
        </SocketContext.Provider>
    );
};
