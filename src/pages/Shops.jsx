import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchShops, createShop, updateShop, deleteShop, fetchCategories } from '../api';

const Shops = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShop, setEditingShop] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        logoUrl: '',
        description: '',
        address: '',
        phoneNumber: ''
    });

    useEffect(() => {
        loadShops();
        loadCategories();
    }, []);

    const loadShops = async () => {
        try {
            const { data } = await fetchShops();
            setShops(data);
        } catch (error) {
            console.error('Failed to load shops', error);
        }
    };

    const loadCategories = async () => {
        try {
            const { data } = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleOpenModal = (shop = null) => {
        if (shop) {
            setEditingShop(shop);
            setFormData({
                name: shop.name,
                categoryId: shop.categoryId,
                logoUrl: shop.logoUrl || '',
                description: shop.description || '',
                address: shop.address || '',
                phoneNumber: shop.phoneNumber || ''
            });
        } else {
            setEditingShop(null);
            setFormData({
                name: '',
                categoryId: selectedCategoryId || (categories.length > 0 ? categories[0].id : ''),
                logoUrl: '',
                description: '',
                address: '',
                phoneNumber: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingShop(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingShop) {
                await updateShop(editingShop.id, formData);
            } else {
                await createShop(formData);
            }
            loadShops();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save shop', error);
            alert('Failed to save shop');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shop?')) {
            try {
                await deleteShop(id);
                loadShops();
            } catch (error) {
                console.error('Failed to delete shop', error);
            }
        }
    };

    const filteredShops = selectedCategoryId
        ? shops.filter(shop => shop.categoryId === selectedCategoryId)
        : shops;

    return (
        <div className="p-6">
            <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Shops</h1>
                    <div className="w-full sm:w-64">
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 font-medium"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Shop
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredShops.map((shop) => (
                    <div key={shop.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
                        <div className="relative h-48 bg-gray-200">
                            {shop.logoUrl ? (
                                <img
                                    src={shop.logoUrl}
                                    alt={shop.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400">
                                    No Image
                                </div>
                            )}
                            <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-white rounded-md shadow-sm opacity-90">
                                {shop.category?.name || 'Uncategorized'}
                            </span>
                        </div>
                        <div className="p-4">
                            <h3
                                onClick={() => navigate(`/shops/${shop.id}`)}
                                className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-600 truncate"
                            >
                                {shop.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
                                {shop.description || 'No description provided.'}
                            </p>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="truncate">{shop.address || 'No address'}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="truncate">{shop.phoneNumber || 'No phone'}</span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 mt-4 space-x-2 border-t border-gray-100">
                                <button
                                    onClick={() => handleOpenModal(shop)}
                                    className="p-2 text-blue-600 rounded-lg hover:bg-blue-50"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(shop.id)}
                                    className="p-2 text-red-600 rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredShops.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    No shops found. Create a category first, then add a shop.
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">{editingShop ? 'Edit Shop' : 'New Shop'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Shop Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Logo/Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="https://..."
                                        value={formData.logoUrl}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
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
                                    {editingShop ? 'Update Shop' : 'Create Shop'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shops;
