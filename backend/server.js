const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite peticiones desde el Frontend (Vite)
app.use(express.json()); // Permite leer JSON en las peticiones

// Rutas de prueba
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Servidor Backend Tlapa Comida funcionando correctamente',
        status: 'online',
        timestamp: new Date()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', db_connection: 'pending' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n✅ Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📡 Esperando peticiones...\n`);
});
