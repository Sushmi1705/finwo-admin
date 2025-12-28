import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Shops from './pages/Shops';
import ShopDetails from './pages/ShopDetails';
import Menus from './pages/Menus';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/login" element={<Login />} /> Login removed */}

                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="shops" element={<Shops />} />
                    <Route path="shops/:id" element={<ShopDetails />} />
                    <Route path="menus" element={<Menus />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
