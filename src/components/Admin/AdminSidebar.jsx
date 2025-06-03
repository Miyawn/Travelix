// src/components/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Impor ikon dari lucide-react sesuai dengan gambar
import {
  Home,
  Plane,        // Untuk Airline
  Building2,    // Untuk Hotel (atau Building)
  Users2,       // Untuk Users (atau User)
  CreditCard,   // Untuk Transactions
  FileText,     // Untuk Log
  Menu,         // Ikon menu di header sidebar
  CircleUserRound // Placeholder untuk logo Travelix jika tidak ada SVG
} from 'lucide-react';

function AdminSidebar() {
  const location = useLocation();

  // Navigasi item disesuaikan dengan gambar
  // Path bisa Anda sesuaikan dengan struktur routing admin Anda
  // Misalnya, jika base path admin adalah /admin, maka path menjadi /admin/users, dll.
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Airline", path: "/dashboard/flights", icon: <Plane size={20} /> },
    { name: "Hotel", path: "/dashboard/hotel", icon: <Building2 size={20} /> },
    { name: "Users", path: "/dashboard/users", icon: <Users2 size={20} /> },
    { name: "Transactions", path: "/dashboard/transactions", icon: <CreditCard size={20} /> },
    { name: "Log", path: "/dashboard/log", icon: <FileText size={20} /> },
  ];

  // State untuk toggle sidebar di layar kecil (opsional, bisa diimplementasikan nanti)
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // Sidebar utama, w-64 untuk lebar, bg-neutral untuk warna gelap (DaisyUI)
    // atau bg-gray-800 jika tidak pakai DaisyUI penuh
    <div className={`w-64 bg-gray-100 shadow-sm text-yellow-400 flex flex-col h-screen border-r border-gray-200 transition-all duration-300`}>
      {/* Header Sidebar */}
      <div className="flex items-center justify-between p-4 h-16">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-primary pl-1 text-yellow-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Travelix</span> {/* Warna text-primary dari DaisyUI */}
        </Link>
        {/* Ikon Menu (untuk toggle di mobile, fungsionalitas bisa ditambahkan) */}
        <button className="btn btn-ghost btn-square btn-sm lg:hidden"> {/* Hanya tampil di mobile/tablet */}
          <Menu size={20} />
        </button>
      </div>

      {/* Daftar Navigasi */}
      <nav className="flex-1 px-2 py-4 space-y-1"> {/* space-y-1 untuk jarak antar item */}
        {navItems.map((item) => {
          // Logika untuk active state:
          // Jika pathnya '/admin', aktif hanya jika location.pathname persis '/admin'.
          // Jika path lain (misal '/admin/users'), aktif jika location.pathname dimulai dengan path tersebut.
          const isActive = item.path === "/admin" 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-base-content/5 text-yellow-500' // Latar aktif (abu-abu muda di tema gelap, atau warna aksen)
                  : 'hover:bg-base-content/5 text-neutral-content/80 hover:text-yellow-500' // Efek hover
              }`}
            >
              {React.cloneElement(item.icon, { strokeWidth: isActive ? 2.5 : 2 })} {/* Ikon lebih tebal jika aktif */}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bagian bawah sidebar (opsional, misal untuk logout atau info user) */}
      {/* <div className="p-4 border-t border-neutral-focus mt-auto">
        <p className="text-xs text-neutral-content/60">© 2025 Travelix Admin</p>
      </div> */}
    </div>
  );
}

export default AdminSidebar;