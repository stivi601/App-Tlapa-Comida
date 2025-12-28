const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const restaurantRoutes = require('./src/routes/restaurants');
const orderRoutes = require('./src/routes/orders');
const deliveryRoutes = require('./src/routes/delivery');
const adminRoutes = require('./src/routes/admin');
const smsRoutes = require('./src/routes/sms');

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite peticiones desde el Frontend (Vite)
app.use(express.json({ limit: '50mb' })); // Permite leer JSON en las peticiones (aumentado para imágenes base64)

// Rutas de prueba
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Servidor Backend Tlapa Comida funcionando correctamente',
        status: 'online',
        timestamp: new Date(),
        endpoints: {
            auth: '/api/auth',
            restaurants: '/api/restaurants',
            orders: '/api/orders',
            delivery: '/api/delivery',
            admin: '/api/admin',
            health: '/api/health'
        }
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


// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`\n✅ Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📡 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database URL configurada: ${process.env.DATABASE_URL ? 'SÍ' : 'NO'}`);
    console.log(`🔐 JWT Secret configurado: ${process.env.JWT_SECRET ? 'SÍ' : 'NO'}`);
    console.log(`🚀 Rutas activas:`);
    console.log(`   🍔 /api/restaurants`);
    console.log(`   📦 /api/orders\n`);
});

// Manejador de errores global para capturar fallos inesperados
app.use((err, req, res, next) => {
    console.error('🔥 ERROR GLOBAL CAPTURADO:');
    console.error('Mensaje:', err.message);
    console.error('Stack:', err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Error interno del servidor',
        detail: err.message,
        code: err.code || 'UNKNOWN_ERROR'
    });
});
