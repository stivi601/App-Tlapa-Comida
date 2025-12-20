const prisma = require('./src/utils/prisma');

async function main() {
    const lastOrder = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { items: true, restaurant: true }
    });
    console.log(JSON.stringify(lastOrder, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
