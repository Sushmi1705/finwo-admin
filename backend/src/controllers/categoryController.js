import prisma from '../services/prismaClient.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.mainCategory.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { shops: true } } }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, imageUrl, isActive } = req.body;
        const category = await prisma.mainCategory.create({
            data: { name, imageUrl, isActive }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, imageUrl, isActive } = req.body;
        const category = await prisma.mainCategory.update({
            where: { id },
            data: { name, imageUrl, isActive }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.mainCategory.delete({ where: { id } });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
