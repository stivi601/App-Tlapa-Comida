const { io, userSockets, restaurantSockets, driverSockets } = require('../../server');

const socketEvents = {
    emitToUser: (userId, event, data) => {
        const socketId = userSockets.get(userId);
        if (socketId) io.to(socketId).emit(event, data);
    },

    emitToRestaurant: (restaurantId, event, data) => {
        const socketId = restaurantSockets.get(restaurantId);
        if (socketId) io.to(socketId).emit(event, data);
    },

    emitToDriver: (driverId, event, data) => {
        const socketId = driverSockets.get(driverId);
        if (socketId) io.to(socketId).emit(event, data);
    },

    emitToOrderRoom: (orderId, event, data) => {
        io.to(`order_${orderId}`).emit(event, data);
    },

    broadcastToDrivers: (event, data) => {
        io.emit(event, data);
    }
};

module.exports = { socketEvents };
