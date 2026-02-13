let io;
let userSockets;
let restaurantSockets;
let driverSockets;

const initSocket = (ioInstance, users, restaurants, drivers) => {
    io = ioInstance;
    userSockets = users;
    restaurantSockets = restaurants;
    driverSockets = drivers;
    console.log('✅ SocketUtils inicializado correctamente');
};

const socketEvents = {
    emitToUser: (userId, event, data) => {
        if (!io || !userSockets) {
            console.error('SocketUtils no inicializado (emitToUser)');
            return;
        }
        const socketId = userSockets.get(userId);
        if (socketId) io.to(socketId).emit(event, data);
    },

    emitToRestaurant: (restaurantId, event, data) => {
        if (!io || !restaurantSockets) {
            console.error('SocketUtils no inicializado (emitToRestaurant)');
            return;
        }
        const socketId = restaurantSockets.get(restaurantId);
        if (socketId) io.to(socketId).emit(event, data);
    },

    emitToDriver: (driverId, event, data) => {
        if (!io || !driverSockets) {
            console.error('SocketUtils no inicializado (emitToDriver)');
            return;
        }
        const socketId = driverSockets.get(driverId);
        if (socketId) io.to(socketId).emit(event, data);
    },

    emitToOrderRoom: (orderId, event, data) => {
        if (!io) return;
        io.to(`order_${orderId}`).emit(event, data);
    },

    broadcastToDrivers: (event, data) => {
        if (!io) return;
        io.emit(event, data);
    }
};

module.exports = { socketEvents, initSocket };
