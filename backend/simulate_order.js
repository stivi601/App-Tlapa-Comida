const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLatestOrder(status) {
    try {
        const latestOrder = await prisma.order.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!latestOrder) {
            console.log('No orders found.');
            return;
        }

        const updated = await prisma.order.update({
            where: { id: latestOrder.id },
            data: { status: status }
        });

        console.log(`Order ${updated.id} updated to ${status}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

const status = process.argv[2];
if (!status) {
    console.log("Please provide a status: PENDING, PREPARING, READY, DELIVERING, COMPLETED");
} else {
    updateLatestOrder(status);
}
