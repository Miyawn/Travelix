import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenLupaPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email tidak boleh kosong", {
        duration: 4000,
        position: "top-center",
      });
    }

    if (!password.trim()) {
      return toast.error("Password tidak boleh kosong", {
        duration: 4000,
        position: "top-center",
      });
    }

    toast.success("Berhasil login!", {
      position: "top-center",
    });
    onLoginSuccess();
    onClose();
  };

  const handleOpenRegister = () => {
    onClose();
    navigate("/register");
  };

  const handleOpenLupaPassword = () => {
    onClose();
    onOpenLupaPassword();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded border text-black bg-gray-100 focus:outline-none"
              placeholder="Email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded border text-black bg-gray-100 focus:outline-none"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4 text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={handleOpenLupaPassword}
            >
              Lupa password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded w-full transition duration-200"
          >
            Masuk
          </button>

          <div className="mt-4 text-center text-sm text-gray-700">
            Belum punya akun?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={handleOpenRegister}
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
