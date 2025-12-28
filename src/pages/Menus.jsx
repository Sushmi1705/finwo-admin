import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Store } from 'lucide-react';
import { fetchShops, fetchMenusByShop, createMenu, updateMenu, deleteMenu } from '../api';

const Menus = () => {
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryName: '',
        shopId: '',
        isAvailable: true,
        isQuickSnack: false
    });

    useEffect(() => {
        loadShops();
    }, []);

    useEffect(() => {
        if (selectedShopId) {
            loadMenuItems(selectedShopId);
        } else {
            setMenuItems([]);
        }
    }, [selectedShopId]);

    const loadShops = async () => {
        try {
            const { data } = await fetchShops();
            setShops(data);
            if (data.length > 0 && !selectedShopId) {
                // Don't auto-select to force user to choose or just show empty
            }
        } catch (error) {
            console.error('Failed to load shops', error);
        }
    };

    const loadMenuItems = async (shopId) => {
        try {
            const { data } = await fetchMenusByShop(shopId);
            setMenuItems(data);
        } catch (error) {
            console.error('Failed to load menu items', error);
        }
    };

    const handleOpenModal = (item = null) => {
        if (!selectedShopId) {
            alert('Please select a shop first');
            return;
        }

        if (item) {
            setEditingItem(item);
            setFormData({
                itemName: item.itemName,
                description: item.description || '',
                price: item.price,
                imageUrl: item.imageUrl || '',
                categoryName: item.categoryName || '',
                shopId: item.shopId,
                isAvailable: item.isAvailable,
                isQuickSnack: item.isQuickSnack
            });
        } else {
            setEditingItem(null);
            setFormData({
                itemName: '',
                description: '',
                price: '',
                imageUrl: '',
                categoryName: '',
                shopId: selectedShopId,
                isAvailable: true,
                isQuickSnack: false
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price)
            };

            if (editingItem) {
                await updateMenu(editingItem.id, dataToSubmit);
            } else {
                await createMenu(dataToSubmit);
            }
            loadMenuItems(selectedShopId || formData.shopId);
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save menu item', error);
            alert('Failed to save menu item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await deleteMenu(id);
                loadMenuItems(selectedShopId);
            } catch (error) {
                console.error('Failed to delete menu item', error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
                    <div className="w-full sm:w-64">
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 font-medium"
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                        >
                            <option value="">Select a Shop</option>
                            {shops.map((shop) => (
                                <option key={shop.id} value={shop.id}>{shop.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    disabled={!selectedShopId}
                    className={`flex items-center px-4 py-2 text-white transition rounded-lg ${selectedShopId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Menu Item
                </button>
            </div>

            {!selectedShopId ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                    <Store size={48} className="mb-4 opacity-20" />
                    <p className="text-lg">Select a shop to manage its menu</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-sm font-semibold text-gray-600 bg-gray-50 border-b">
                                    <th className="p-4">Item</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {menuItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden mr-3">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-400 text-[10px]">No Img</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">{item.itemName}</div>
                                                    <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">
                                                {item.categoryName || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-gray-700">₹{item.price}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2 py-1 text-[10px] w-fit font-bold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                                                </span>
                                                {item.isQuickSnack && (
                                                    <span className="px-2 py-1 text-[10px] w-fit font-bold rounded-full bg-orange-100 text-orange-700">
                                                        QUICK SNACK
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {menuItems.length === 0 && (
                            <div className="p-12 text-center text-gray-500 bg-white">
                                <p>No menu items found for this shop.</p>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Add your first menu item
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Shop</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                    value={formData.shopId}
                                    onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a Shop</option>
                                    {shops.map((shop) => (
                                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.itemName}
                                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Category (e.g. Starters, Main)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.categoryName}
                                        onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                        placeholder="General"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={formData.isAvailable}
                                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Available</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        checked={formData.isQuickSnack}
                                        onChange={(e) => setFormData({ ...formData, isQuickSnack: e.target.checked })}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Quick Snack</span>
                                </label>
                            </div>
                            <div className="flex justify-end pt-4 space-x-3 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    {editingItem ? 'Update Item' : 'Create Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menus;
