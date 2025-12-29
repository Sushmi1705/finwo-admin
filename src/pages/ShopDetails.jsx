import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShopById, createShop, updateShop, createMenu, deleteMenu, fetchCategories } from '../api';

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [shop, setShop] = useState({
        name: '', categoryId: '', description: '', reviewDescription: '', address: '', area: '', city: '',
        latitude: 0, longitude: 0, phoneNumber: '', isActive: true, logoUrl: '', websiteUrl: '', chatLink: '', openHours: ''
    });
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);

    // Menu Form State
    const [showMenuForm, setShowMenuForm] = useState(false);
    const [menuData, setMenuData] = useState({ itemName: '', price: '', description: '', categoryName: '' });

    useEffect(() => {
        loadCategories();
        if (!isNew) {
            loadShopDetails();
        }
    }, [id]);

    const loadCategories = async () => {
        try {
            const { data } = await fetchCategories();
            setCategories(data);
        } catch (error) { console.error('Failed to load categories', error); }
    };

    const loadShopDetails = async () => {
        try {
            const { data } = await fetchShopById(id);
            setShop(data);
            setMenus(data.menus || []);
        } catch (error) { console.error('Failed to load shop', error); }
    };

    const handleShopSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...shop,
                latitude: parseFloat(shop.latitude) || 0,
                longitude: parseFloat(shop.longitude) || 0
            };

            if (isNew) {
                const { data } = await createShop(payload);
                navigate(`/shops/${data.id}`);
            } else {
                await updateShop(id, payload);
                alert('Shop updated!');
                loadShopDetails();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save shop');
        }
    };

    const handleMenuAdd = async (e) => {
        e.preventDefault();
        try {
            await createMenu({ ...menuData, shopId: id });
            setShowMenuForm(false);
            setMenuData({ itemName: '', price: '', description: '', categoryName: '' });
            loadShopDetails(); // Reload to see new menu
        } catch (error) {
            console.error(error);
            alert('Failed to add menu item');
        }
    };

    const handleDeleteMenu = async (menuId) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await deleteMenu(menuId);
            loadShopDetails();
        } catch (error) {
            console.error(error);
            alert('Failed to delete');
        }
    };

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Create Shop' : 'Edit Shop'}</h1>
                <button onClick={() => navigate('/shops')} className="text-gray-600 hover:text-gray-900 font-medium">
                    &larr; Back to List
                </button>
            </div>

            {/* Shop Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleShopSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Name</label>
                        <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.name} onChange={e => setShop({ ...shop, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.categoryId} onChange={e => setShop({ ...shop, categoryId: e.target.value })} required>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="2" value={shop.description || ''} onChange={e => setShop({ ...shop, description: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Review Description</label>
                        <textarea className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="2" value={shop.reviewDescription || ''} onChange={e => setShop({ ...shop, reviewDescription: e.target.value })} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                        <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.logoUrl || ''} onChange={e => setShop({ ...shop, logoUrl: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Website URL</label>
                        <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.websiteUrl || ''} onChange={e => setShop({ ...shop, websiteUrl: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Chat Link</label>
                        <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.chatLink || ''} onChange={e => setShop({ ...shop, chatLink: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Open Hours</label>
                        <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.openHours || ''} onChange={e => setShop({ ...shop, openHours: e.target.value })} placeholder="e.g. 09:00 - 21:00" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                        <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.phoneNumber || ''} onChange={e => setShop({ ...shop, phoneNumber: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                        <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.address || ''} onChange={e => setShop({ ...shop, address: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
                            <input type="number" step="any" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.latitude} onChange={e => setShop({ ...shop, latitude: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
                            <input type="number" step="any" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={shop.longitude} onChange={e => setShop({ ...shop, longitude: e.target.value })} />
                        </div>
                    </div>

                    <div className="col-span-2 flex justify-end pt-4 border-t border-gray-100">
                        <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition">
                            {isNew ? 'Create Shop' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Menu Management (Only for existing shops) */}
            {!isNew && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Menu Items</h2>
                        <button
                            onClick={() => setShowMenuForm(!showMenuForm)}
                            className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${showMenuForm ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        >
                            {showMenuForm ? 'Cancel' : '+ Add Item'}
                        </button>
                    </div>

                    {showMenuForm && (
                        <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
                            <form onSubmit={handleMenuAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Item Name</label>
                                    <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Cheese Burger" value={menuData.itemName} onChange={e => setMenuData({ ...menuData, itemName: e.target.value })} required />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                                    <input type="number" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="199" value={menuData.price} onChange={e => setMenuData({ ...menuData, price: e.target.value })} required />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <input className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Burgers" value={menuData.categoryName} onChange={e => setMenuData({ ...menuData, categoryName: e.target.value })} />
                                </div>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-semibold h-[46px]">
                                    Add Item
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="p-4 font-semibold">Item Name</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Price</th>
                                    <th className="p-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {menus.map(m => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-800">{m.itemName}</td>
                                        <td className="p-4 text-gray-500">{m.categoryName || '-'}</td>
                                        <td className="p-4 font-medium text-gray-800">₹{m.price}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDeleteMenu(m.id)} className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {menus.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500 bg-gray-50 flex-col">
                                            <span>No menu items yet.</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopDetails;
