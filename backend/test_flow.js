const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_URL = 'http://localhost:5173/api'; // Wait, backend is on 3000 usually. Check server.js
// Checking server.js... it usually runs on 3000 or 5000.
// Let's assume 3000 based on standard express apps or check vercel.json.
// The frontend is 5173. The backend is likely 3000.

const BACKEND_URL = 'http://localhost:3000/api';

async function runTest() {
    try {
        console.log('1. Logging in as Customer...');
        const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: 'jebacriper@gmail.com',
            password: '123456'
        });
        const token = loginRes.data.token;
        const user = loginRes.data.user;
        console.log('   Logged in as:', user.name);

        console.log('2. Fetching Restaurants...');
        const resRes = await axios.get(`${BACKEND_URL}/restaurants`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const restaurant = resRes.data[0];
        if (!restaurant) throw new Error('No restaurants found');
        console.log('   Selected Restaurant:', restaurant.name);

        let menuItem = null;
        if (restaurant.menu && restaurant.menu.length > 0) {
            menuItem = restaurant.menu[0];
        } else {
            console.warn('   No menu items found! Order might fail if Referential Integrity checks ID.');
            // Try to proceed with dummy, but it likely fails as we saw.
            // Actually, let's create a menu item if none exists? No, too complex.
            // Let's assume there is at least one item.
            throw new Error('Restaurant has no menu items.');
        }

        const orderData = {
            restaurantId: restaurant.id,
            items: [
                {
                    id: menuItem.id,
                    name: menuItem.name || "Item",
                    price: menuItem.price || 10,
                    quantity: 1
                }
            ],
            total: menuItem.price || 10,
            addressId: null, // Ignored by backend for now
            paymentMethod: 'cash'
        };

        const orderRes = await axios.post(`${BACKEND_URL}/orders`, orderData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const orderId = orderRes.data.id;
        console.log('   Order Placed! ID:', orderId);
        console.log('   Initial Status:', orderRes.data.status);

        // Function to update status via Database Direct (Simulating Restaurant/Rider)
        const updateStatus = async (status) => {
            console.log(`\n--- Simulating: Moving Order to ${status} ---`);
            await prisma.order.update({
                where: { id: orderId },
                data: { status: status }
            });
            console.log(`   Order ${orderId} is now ${status}`);
        };

        // Simulate Flow
        await new Promise(r => setTimeout(r, 2000));
        await updateStatus('PREPARING'); // Restaurant accepts

        await new Promise(r => setTimeout(r, 2000));
        await updateStatus('READY'); // Food ready

        await new Promise(r => setTimeout(r, 2000));
        await updateStatus('DELIVERING'); // Rider picks up
        console.log('   >>> CHECK APP NOW FOR MAP <<<');

        // We exit here so I can check the map manually/via subagent
        process.exit(0);

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
