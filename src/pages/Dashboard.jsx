import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Total Shops</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Active Categories</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
