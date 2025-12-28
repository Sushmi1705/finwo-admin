import prisma from '../services/prismaClient.js';

export const getMenusByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const menus = await prisma.menu.findMany({
            where: { shopId },
            orderBy: { itemName: 'asc' }
        });
        res.json(menus);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menus' });
    }
};

export const createMenu = async (req, res) => {
    try {
        const { shopId, itemName, description, price, imageUrl, categoryName, isQuickSnack, quantity } = req.body;
        const menu = await prisma.menu.create({
            data: {
                shopId,
                itemName,
                description,
                price: parseFloat(price),
                imageUrl,
                categoryName,
                isQuickSnack,
                quantity: quantity ? parseInt(quantity) : null
            }
        });
        res.json(menu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create menu item' });
    }
};

export const updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, description, price, imageUrl, categoryName, isQuickSnack, isAvailable, quantity } = req.body;
        const menu = await prisma.menu.update({
            where: { id },
            data: {
                itemName,
                description,
                price: parseFloat(price),
                imageUrl,
                categoryName,
                isQuickSnack,
                isAvailable,
                quantity: quantity ? parseInt(quantity) : null
            }
        });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update menu item' });
    }
};

export const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.menu.delete({ where: { id } });
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};
