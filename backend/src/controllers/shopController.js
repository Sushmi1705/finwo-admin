import prisma from '../services/prismaClient.js';

export const getShops = async (req, res) => {
    try {
        const shops = await prisma.shop.findMany({
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });
        res.json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shops' });
    }
};

export const getShopById = async (req, res) => {
    try {
        const { id } = req.params;
        const shop = await prisma.shop.findUnique({
            where: { id },
            include: { category: true, images: true, menus: true }
        });
        if (!shop) return res.status(404).json({ error: 'Shop not found' });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shop details' });
    }
};

export const createShop = async (req, res) => {
    try {
        const {
            categoryId,
            name,
            logoUrl,
            description,
            reviewDescription,
            address,
            phoneNumber,
            area,
            city,
            latitude,
            longitude,
            websiteUrl,
            chatLink,
            openHours
        } = req.body;

        const shop = await prisma.shop.create({
            data: {
                categoryId,
                name,
                logoUrl,
                description,
                reviewDescription,
                address,
                phoneNumber,
                area,
                city,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                websiteUrl,
                chatLink,
                openHours
            }
        });
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create shop' });
    }
};

export const updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        if (data.latitude !== undefined && data.latitude !== null && data.latitude !== '') data.latitude = parseFloat(data.latitude);
        if (data.longitude !== undefined && data.longitude !== null && data.longitude !== '') data.longitude = parseFloat(data.longitude);

        const shop = await prisma.shop.update({
            where: { id },
            data
        });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shop' });
    }
};

export const deleteShop = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.shop.delete({ where: { id } });
        res.json({ message: 'Shop deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete shop' });
    }
};
