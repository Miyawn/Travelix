import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      toast.success("Berhasil login!");
      onLoginSuccess();
      onClose();
    } else {
      toast.error("Email dan password harus diisi", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-center mb-4 text-black">Login</h2>

          <div className="mb-4">
            <label className="block mb-1 text-black">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 text-black">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Lupa Password */}
          <div className="mb-4 text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => alert("Fitur lupa password diklik")}
            >
              Lupa password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400"
          >
            Masuk
          </button>

          {/* Belum punya akun */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-700">Belum punya akun? </span>
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => alert("Fitur daftar diklik")}
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
