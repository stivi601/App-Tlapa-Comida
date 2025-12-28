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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n✅ Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📡 Esperando peticiones...`);
    console.log(`🔐 Auth: /api/auth`);
    console.log(`🍔 Restaurantes: /api/restaurants`);
    console.log(`📦 Pedidos: /api/orders`);
    console.log(`🛵 Repartidores: /api/delivery`);
    console.log(`📊 Admin: /api/admin\n`);
});
