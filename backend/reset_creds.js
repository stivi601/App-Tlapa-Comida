const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetCreds() {
    console.log('🔄 Asegurando credenciales...');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456', salt);
    const adminHash = await bcrypt.hash('admin123', salt);

    // 1. ADMIN
    const adminEmail = 'admin@tlapacomida.com';
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { password: adminHash, role: 'ADMIN', name: 'Administrador' },
        create: { email: adminEmail, password: adminHash, name: 'Administrador', role: 'ADMIN' }
    });
    console.log(`✅ Admin: ${adminEmail} / admin123`);

    // 2. RESTAURANT
    // Upsert restaurant by username
    const restUser = 'tacos_test';
    const rest = await prisma.restaurant.upsert({
        where: { username: restUser },
        update: { password: hash, name: 'Tacos de Prueba' }, // Ensure password is correct
        create: {
            username: restUser,
            password: hash,
            name: 'Tacos de Prueba',
            time: '20 min',
            deliveryFee: 15,
            categories: JSON.stringify(['Tacos']),
            rating: 5.0,
            image: 'https://cdn-icons-png.flaticon.com/512/3014/3014795.png'
        }
    });

    // Ensure menu item for ordering
    const menuItem = await prisma.menuItem.findFirst({ where: { restaurantId: rest.id } });
    if (!menuItem) {
        await prisma.menuItem.create({
            data: {
                name: 'Taco Simple',
                description: 'Taco de prueba',
                price: 15,
                category: 'Tacos',
                image: '',
                restaurantId: rest.id
            }
        });
    }
    console.log(`✅ Restaurant: ${restUser} / 123456`);

    // 3. RIDER
    const riderUser = 'rider_test';
    const rider = await prisma.deliveryRider.upsert({
        where: { username: riderUser },
        update: { password: hash },
        create: {
            username: riderUser,
            password: hash,
            name: 'Rider de Prueba',
            phone: '5555555555',
            rfc: 'RIDER123'
        }
    });
    console.log(`✅ Rider: ${riderUser} / 123456`);

    // 4. CUSTOMER
    const custEmail = 'jebacriper@gmail.com';
    await prisma.user.upsert({
        where: { email: custEmail },
        update: { password: hash, name: 'Cliente Prueba' },
        create: { email: custEmail, password: hash, name: 'Cliente Prueba', role: 'CUSTOMER' }
    });
    console.log(`✅ Customer: ${custEmail} / 123456`);

}

resetCreds()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
