const bcrypt = require('bcryptjs'); // Asegurar importación

async function main() {
    console.log('🌱 Iniciando seed de base de datos...');

    // 1. Asegurar Usuario Admin (Upsert para arreglar password si está mal)
    const adminPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@tlapacomida.com' },
        update: {
            password: adminPassword, // Actualizar password si ya existe
            role: 'ADMIN',
            username: 'admin'
        },
        create: {
            username: 'admin',
            email: 'admin@tlapacomida.com',
            password: adminPassword,
            name: 'Administrador',
            role: 'ADMIN'
        }
    });
    console.log('👤 Usuario Admin asegurado:', adminUser.username);



    // 1. Tacos El Paisa
    const tacos = await prisma.restaurant.create({
        data: {
            name: 'Tacos El Paisa',
            username: 'paisa',
            password: '$2b$10$MIHaL3Q/2e5RiOArqu7N5.d/1TfRVwWnT9wZFdsIq.Nc7JwRpB25W', // hash de '123'
            image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500',
            rating: 4.8,
            time: '15-25 min',
            deliveryFee: 15.00,
            categories: JSON.stringify(['Tacos', 'Mexicana']),
            menu: {
                create: [
                    {
                        name: 'Orden de Pastor',
                        description: '5 tacos de pastor con piña, cilantro y cebolla',
                        price: 65,
                        category: 'Tacos',
                        image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=500'
                    },
                    {
                        name: 'Gringa',
                        description: 'Tortilla de harina grande con queso y carne al pastor',
                        price: 45,
                        category: 'Tacos',
                        image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=500'
                    },
                    {
                        name: 'Horchata',
                        description: 'Agua fresca de arroz artesanal 500ml',
                        price: 25,
                        category: 'Bebidas',
                        image: 'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?w=500'
                    }
                ]
            }
        }
    });

    // 2. Burger King Tlapa
    const burger = await prisma.restaurant.create({
        data: {
            name: 'Burger King Tlapa',
            username: 'bk',
            password: '$2b$10$MIHaL3Q/2e5RiOArqu7N5.d/1TfRVwWnT9wZFdsIq.Nc7JwRpB25W',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
            rating: 4.5,
            time: '30-45 min',
            deliveryFee: 20.00,
            categories: JSON.stringify(['Hamburguesas', 'Americana']),
            menu: {
                create: [
                    {
                        name: 'Whopper Jr',
                        description: 'Hamburguesa clásica con carne a la parrilla',
                        price: 89,
                        category: 'Hamburguesas',
                        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
                    },
                    {
                        name: 'Papas Medianas',
                        description: 'Papas fritas clásicas',
                        price: 45,
                        category: 'Complementos',
                        image: 'https://images.unsplash.com/photo-1630384060421-a4332cd26882?w=500'
                    }
                ]
            }
        }
    });

    // 3. Pizza Hut
    const pizza = await prisma.restaurant.create({
        data: {
            name: 'Pizza Hut',
            username: 'pizza',
            password: '$2b$10$MIHaL3Q/2e5RiOArqu7N5.d/1TfRVwWnT9wZFdsIq.Nc7JwRpB25W',
            image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500',
            rating: 4.2,
            time: '25-40 min',
            deliveryFee: 25.00,
            categories: JSON.stringify(['Pizzas', 'Italiana']),
            menu: {
                create: [
                    {
                        name: 'Pepperoni Grande',
                        description: 'Pizza grande de pepperoni con orilla de queso',
                        price: 199,
                        category: 'Pizzas',
                        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500'
                    }
                ]
            }
        }
    });

    // 4. Repartidores
    const rider1 = await prisma.deliveryRider.create({
        data: {
            name: 'Carlos Veloz',
            username: 'carlos',
            password: '$2b$10$MIHaL3Q/2e5RiOArqu7N5.d/1TfRVwWnT9wZFdsIq.Nc7JwRpB25W',
            phone: '7571234567',
            isOnline: true,
            totalDeliveries: 154,
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        }
    });

    console.log('✅ Seed completado!');
    console.log(`👤 Admin: ${adminUser.username} (password: admin123)`);
    console.log(`🍔 Restaurantes creados: ${tacos.name}, ${burger.name}, ${pizza.name}`);
    console.log(`🛵 Repartidor creado: ${rider1.name} (user: carlos, pass: 123)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
