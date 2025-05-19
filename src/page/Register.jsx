// src/pages/Register.jsx
import { Eye } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Tambahkan ini
import Login from "./Login";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Daftar</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Nama</label>
          <input
            type="text"
            placeholder="Nama"
            className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            placeholder="Email@gmail.com"
            className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">No. Telp</label>
          <input
            type="text"
            placeholder="0816494839"
            className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full px-4 py-2 border rounded bg-gray-100 pr-10 focus:outline-none"
            />
            <Eye className="absolute right-3 top-2.5 w-5 h-5 text-gray-600" />
          </div>
        </div>

        <button className="bg-yellow-500 text-white font-semibold py-2 w-full rounded hover:bg-yellow-600 flex justify-center items-center gap-2">
          🛏 Daftar
        </button>

        <div className="mt-4 text-sm text-yellow-700">
          {/* ✅ Gunakan Link ke halaman login */}
          <Link to="/">Masuk?</Link>
        </div>
      </div>
    </div>
  );
}
