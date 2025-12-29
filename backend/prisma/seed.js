import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureMainCategory(name, imageUrl = null, isActive = true) {
    let cat = await prisma.mainCategory.findFirst({ where: { name } });
    if (!cat) {
        cat = await prisma.mainCategory.create({ data: { name, imageUrl, isActive } });
    }
    return cat;
}

async function ensureShop(data) {
    let shop = await prisma.shop.findFirst({ where: { name: data.name } });
    if (!shop) {
        shop = await prisma.shop.create({ data });
    }
    return shop;
}

async function ensureMenuItem(shopId, itemName, details) {
    const existing = await prisma.menu.findFirst({ where: { shopId, itemName } });
    if (!existing) {
        return await prisma.menu.create({ data: { shopId, itemName, ...details } });
    }
    return existing;
}

async function main() {
    // Admin user
    const email = 'admin@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            mobile: '1234567890',
            isAdmin: true,
            status: 'ACTIVE'
        },
    });

    // Main categories
    const beverages = await ensureMainCategory('Beverages', 'https://picsum.photos/seed/bev/200/200');
    const fastFood = await ensureMainCategory('Fast Food', 'https://picsum.photos/seed/ff/200/200');
    const desserts = await ensureMainCategory('Desserts', 'https://picsum.photos/seed/des/200/200');

    // Shops
    const cafe = await ensureShop({
        categoryId: beverages.id,
        name: 'Cafe Good',
        logoUrl: 'https://picsum.photos/seed/cafe/600/400',
        description: 'A cozy cafe for great coffee and snacks',
        address: '123 Coffee St',
        phoneNumber: '9876543210'
    });

    const burger = await ensureShop({
        categoryId: fastFood.id,
        name: 'Burger Barn',
        logoUrl: 'https://picsum.photos/seed/burger/600/400',
        description: 'Tasty burgers and fries',
        address: '456 Burger Ave',
        phoneNumber: '9123456780'
    });

    // Menus
    await ensureMenuItem(cafe.id, 'Cappuccino', { description: 'Rich espresso with milk foam', price: 120, imageUrl: 'https://picsum.photos/seed/capp/200/200', categoryName: 'Hot Beverages', isQuickSnack: false });
    await ensureMenuItem(cafe.id, 'Blueberry Muffin', { description: 'Freshly baked muffin', price: 80, imageUrl: 'https://picsum.photos/seed/muff/200/200', categoryName: 'Bakery', isQuickSnack: true });

    await ensureMenuItem(burger.id, 'Classic Burger', { description: 'Beef patty with lettuce and tomato', price: 220, imageUrl: 'https://picsum.photos/seed/classic/200/200', categoryName: 'Main', isQuickSnack: false });
    await ensureMenuItem(burger.id, 'Fries', { description: 'Crispy golden fries', price: 70, imageUrl: 'https://picsum.photos/seed/fries/200/200', categoryName: 'Sides', isQuickSnack: true });

    // Summary logs
    const shopsCount = await prisma.shop.count();
    const menusCount = await prisma.menu.count();
    const catCount = await prisma.mainCategory.count();

    console.log('Seeding complete:');
    console.log({ admin: admin.email, categories: catCount, shops: shopsCount, menus: menusCount });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
