import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout = () => {
    // Auth check removed as per user request
    // const token = localStorage.getItem('adminToken');
    // if (!token) return <Navigate to="/login" replace />;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 p-8 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
