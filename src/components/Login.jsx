import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Import auth dari file konfigurasi Firebase Anda
import { auth } from "../firebaseConfig"; // Sesuaikan path jika berbeda
import { signInWithEmailAndPassword } from "firebase/auth"; // Import fungsi yang diperlukan

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenLupaPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading button
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => { // Tambahkan async di sini
    e.preventDefault();
    setLoading(true); // Set loading ke true saat submit

    // Validasi input
    if (!email.trim()) {
      setLoading(false);
      return toast.error("Email tidak boleh kosong", {
        duration: 4000,
        position: "top-center",
      });
    }

    if (!password.trim()) {
      setLoading(false);
      return toast.error("Password tidak boleh kosong", {
        duration: 4000,
        position: "top-center",
      });
    }

    try {
      // Menggunakan Firebase Authentication untuk login pengguna
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("Pengguna berhasil login:", user);

      toast.success("Berhasil login!", {
        position: "top-center",
      });

      // Panggil callback onLoginSuccess yang diberikan oleh parent
      onLoginSuccess();
      onClose(); // Tutup modal setelah login berhasil
    } catch (error) {
      console.error("Error saat login:", error);
      let errorMessage = "Terjadi kesalahan saat login!";

      // Menangani error dari Firebase
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Format email tidak valid!";
          break;
        case "auth/user-disabled":
          errorMessage = "Akun Anda telah dinonaktifkan.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password": // Firebase menggabungkan ini untuk keamanan
          errorMessage = "Email atau password salah!";
          break;
        case "auth/invalid-credential": // Untuk versi Firebase SDK yang lebih baru
          errorMessage = "Email atau password salah!";
          break;
        default:
          errorMessage = error.message; // Tampilkan pesan error umum dari Firebase
      }

      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setLoading(false); // Selalu matikan loading setelah proses selesai
    }
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
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded w-full transition duration-200 flex items-center justify-center gap-2"
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 mr-2 border-b-2 border-black rounded-full" viewBox="0 0 24 24"></svg>
            ) : null}
            {loading ? "Masuk..." : "Masuk"}
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