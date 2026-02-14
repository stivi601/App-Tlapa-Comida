const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const restaurantRoutes = require('./src/routes/restaurants');
const orderRoutes = require('./src/routes/orders');
const deliveryRoutes = require('./src/routes/delivery');
const adminRoutes = require('./src/routes/admin');
const smsRoutes = require('./src/routes/sms');
const uploadRoutes = require('./src/routes/upload'); // Import upload routes

// Configuración
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Configuración de Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*", // Permitir todo para evitar problemas de CORS en dev
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Store para manejar conexiones
const userSockets = new Map();
const restaurantSockets = new Map();
const driverSockets = new Map();

// Inicializar Utils de WebSockets (Romper dependencia circular)
const { initSocket } = require('./src/utils/socketUtils');
initSocket(io, userSockets, restaurantSockets, driverSockets);

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('register_user', (data) => {
        const { userId, userType } = data;
        if (!userId) return;

        if (userType === 'customer') {
            userSockets.set(userId, socket.id);
            socket.join(`user_${userId}`);
        } else if (userType === 'restaurant') {
            restaurantSockets.set(userId, socket.id);
            socket.join(`restaurant_${userId}`);
        } else if (userType === 'driver') {
            driverSockets.set(userId, socket.id);
            socket.join(`driver_${userId}`);
        }

        socket.userId = userId;
        socket.userType = userType;
        console.log(`${userType} registrado: ${userId}`);
    });

    socket.on('join_order_room', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} unido a order_${orderId}`);
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            if (socket.userType === 'customer') userSockets.delete(socket.userId);
            else if (socket.userType === 'restaurant') restaurantSockets.delete(socket.userId);
            else if (socket.userType === 'driver') driverSockets.delete(socket.userId);
        }
    });
});

// Exportar instancias para usar en utils/rutas
// Exportar instancias para usar en utils/rutas
module.exports = { app, server };

// Middleware
app.use(require('helmet')()); // Security Headers
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Rate Limiting
const limiter = require('express-rate-limit').rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Aumentado para desarrollo local
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter); // Apply to API routes

// Middleware para adjuntar io a req (opcional, si se prefiere usar req.io)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Servir carpeta de uploads estática
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Variables de entorno para JWT
if (!process.env.JWT_SECRET) {
    console.warn("ADVERTENCIA: JWT_SECRET no esta definido en .env. Usando secreto inseguro por defecto.");
    process.env.JWT_SECRET = "secret_super_seguro_development";
}

// Rutas de prueba
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Servidor Backend Tlapa Comida funcionando correctamente (con WebSockets)',
        status: 'online',
        timestamp: new Date(),
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', database: 'SQLite connected' });
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/reviews', require('./src/routes/reviews'));
app.use('/api/upload', uploadRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 ERROR GLOBAL:', err.message);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
});

// Exportar app para Vercel
module.exports = app;

// Iniciar Servidor solo si no estamos en Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const prisma = require('./src/utils/prisma');

    async function startServer() {
        console.log('🔄 Verificando conexión a la base de datos...');
        try {
            await prisma.$connect();
            console.log('✅ Conexión a DB exitosa');

            server.listen(PORT, () => {
                console.log(`\n🚀 Servidor corriendo en: http://localhost:${PORT}`);
                console.log(`📡 Socket.IO activo`);
            });
        } catch (error) {
            console.error('❌ Error DB:', error);
            server.listen(PORT, () => {
                console.log(`\n⚠️ Servidor corriendo SIN DB en: http://localhost:${PORT}`);
            });
        }
    }

    startServer();
}
