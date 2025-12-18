const { PrismaClient } = require('@prisma/client');

// Inicialización estándar de Prisma Client
// Prisma leerá automáticamente la variable DATABASE_URL del entorno o del archivo .env
const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

module.exports = prisma;
