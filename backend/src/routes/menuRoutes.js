import express from 'express';
import { getMenusByShop, createMenu, updateMenu, deleteMenu } from '../controllers/menuController.js';

const router = express.Router();

router.get('/shop/:shopId', getMenusByShop);
router.post('/', createMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

export default router;
