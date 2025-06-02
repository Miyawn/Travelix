import { useState } from "react";
import { Eye, EyeOff, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth, db } from "../firebaseConfig"; // Import auth DAN db
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import fungsi Firestore yang diperlukan

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    telp: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi dasar
    if (!form.nama || !form.email || !form.telp || !form.password) {
      setLoading(false);
      return toast.error("Semua field wajib diisi!", {
        position: "top-center",
      });
    }

    // Validasi password
    if (form.password.length < 6) {
      setLoading(false);
      return toast.error("Password minimal 6 karakter!", {
        position: "top-center",
      });
    }

    try {
      // 1. Buat pengguna baru dengan Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;
      console.log("Pengguna berhasil didaftarkan di Auth:", user);

      // 2. Simpan data pengguna tambahan ke Firestore
      // Gunakan user.uid sebagai ID dokumen agar mudah dihubungkan dengan Authentication
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Simpan UID juga di dokumen
        nama: form.nama,
        email: form.email,
        telp: form.telp,
        createdAt: new Date(), // Tambahkan timestamp
      });

      console.log("Data pengguna berhasil disimpan di Firestore.");

      toast.success("Berhasil daftar!", {
        position: "top-center",
      });

      // Redirect ke halaman home
      navigate("/");
    } catch (error) {
      console.error("Error saat daftar:", error);
      let errorMessage = "Terjadi kesalahan saat pendaftaran!";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email sudah terdaftar!";
          break;
        case "auth/invalid-email":
          errorMessage = "Format email tidak valid!";
          break;
        case "auth/weak-password":
          errorMessage = "Password terlalu lemah (minimal 6 karakter)!";
          break;
        default:
          errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-500 to-gray-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Daftar
        </h2>

        {/* Nama */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Nama</label>
          <input
            type="text"
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border text-black bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email@gmail.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border text-black bg-gray-100 focus:outline-none"
          />
        </div>

        {/* No. Telp */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            No. Telp
          </label>
          <input
            type="text"
            name="telp"
            placeholder="0816494839"
            value={form.telp}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border text-black bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 rounded border text-black bg-gray-100 focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Tombol Daftar */}
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded w-full transition duration-200 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <Activity size={15} className="animate-spin" />
          ) : (
            <Activity size={15} />
          )}
          {loading ? "Mendaftar..." : "Daftar"}
        </button>

        {/* Link ke Login */}
        <div className="mt-4 text-center text-sm text-gray-700">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Masuk
          </Link>
        </div>
      </form>
    </div>
  );
}