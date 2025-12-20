const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const restaurantRoutes = require('./src/routes/restaurants');
const orderRoutes = require('./src/routes/orders');
const deliveryRoutes = require('./src/routes/delivery');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/upload'); // Import upload routes

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite peticiones desde el Frontend (Vite)
app.use(express.json()); // Permite leer JSON en las peticiones

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
app.use('/api/upload', uploadRoutes);

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
