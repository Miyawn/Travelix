// src/components/AdminTopBar.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
// Anda bisa menggunakan UserCircle2 sebagai fallback jika tidak ingin gradient avatar
// import { UserCircle2 } from 'lucide-react';

function AdminTopBar({ adminName = "admin", welcomeText = "Welcome!" }) {
  // Styling untuk avatar gradient seperti pada gambar
  // Anda bisa menyesuaikan warna gradient ini
  const avatarGradientStyle = {
    backgroundImage: 'linear-gradient(to bottom right, #6EE7B7, #3B82F6)', // Contoh: emerald-300 ke blue-500
  };

  return (
    // Kontainer utama untuk top bar
    // Styling dasar: background, padding, flex, border bawah, shadow
    // Kelas font-inter ditambahkan sesuai permintaan dari HTML
    <div className="bg-gray-100 px-6 h-16 flex justify-between items-center border-gray-200 border-b shadow-sm font-inter">
      {/* Bagian Kiri: Pesan Selamat Datang */}
      <div>
        <h1 className="text-md md:text-lg font-medium text-yellow-400">
          {welcomeText}    {adminName}
        </h1>
      </div>

      {/* Bagian Kanan: Profil Pengguna dengan Dropdown */}
      <div className="dropdown dropdown-end">
        {/* Tombol untuk memicu dropdown */}
        <label
          tabIndex={0}
          className="btn btn-ghost btn-sm flex items-center normal-case px-1 md:px-2 hover:bg-transparent focus:bg-transparent active:bg-transparent group"
          style={{ boxShadow: "none", border: "none" }} // Hilangkan efek shadow dari button ghost
        >
          {/* Avatar dengan gradient */}
          <div
            className="w-8 h-8 md:w-9 md:h-9 rounded-full mr-2 flex items-center justify-center text-white font-semibold text-sm"
            style={avatarGradientStyle}
          >
            {adminName.substring(0, 1).toUpperCase()}
          </div>
          {/* Nama Admin */}
          <span className="text-sm text-yellow-400 hidden sm:inline group-hover:text-blue-600 transition-colors duration-200">
            {adminName}
          </span>
          {/* Ikon Panah Dropdown */}
          <ChevronDown size={18} className="ml-1 text-base-content/70 group-hover:text-blue-600 transition-colors duration-200" />
        </label>
        {/* Konten Dropdown */}
        <ul 
          tabIndex={0} 
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2 z-[45]" // z-index harus lebih rendah dari sticky wrapper jika ada
        >
          <li><a>Profile</a></li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  );
}

export default AdminTopBar;