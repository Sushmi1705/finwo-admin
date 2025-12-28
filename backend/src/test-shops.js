import prisma from './services/prismaClient.js';

async function main() {
    try {
        console.log('Testing Shop Data...');

        // 1. Count Shops
        const shopsCount = await prisma.shop.count();
        console.log(`📊 Total Shops in DB: ${shopsCount}`);

        // 2. Fetch Sample Shops
        if (shopsCount > 0) {
            const shops = await prisma.shop.findMany({
                take: 3,
                include: { category: true } // Check relation
            });
            console.log('Sample Shops:', JSON.stringify(shops, null, 2));
        } else {
            console.log('⚠️ No shops found in the database.');
        }

    } catch (error) {
        console.error('❌ Error fetching shops:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
