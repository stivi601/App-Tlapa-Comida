const prisma = require('./src/utils/prisma');
const bcrypt = require('bcryptjs');

async function main() {
    const email = 'admin@tlapa.com';
    const password = 'admin'; // Simple password for dev
    const name = 'Super Admin';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Admin user already exists.');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'ADMIN',
            phone: '0000000000'
        }
    });

    console.log('Admin user created:', admin);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
