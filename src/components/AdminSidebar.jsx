// src/components/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/admin-dashboard" }, // Atau ke halaman utama admin
    { name: "Users", path: "/admin-dashboard/users" },
    { name: "Transactions", path: "/admin-dashboard/transactions" },
    { name: "Log", path: "/admin-dashboard/log" },
    // Anda bisa menambahkan item navigasi lain di sini
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen fixed top-0 left-0 pt-16"> {/* pt-16 agar tidak tertutup navbar */}
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md ${
                  location.pathname.startsWith(item.path) ? 'bg-yellow-500 text-black font-semibold' : 'hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;