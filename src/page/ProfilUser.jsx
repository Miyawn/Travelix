// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/navbar"; // Pastikan path ini benar
import Footer from "../components/footer"; // Pastikan path ini benar

// Import Firebase Auth dan Firestore
import { auth, db } from "../firebaseConfig"; // Pastikan path ini benar
import { onAuthStateChanged, updateProfile } from "firebase/auth"; // updateProfile untuk Auth
import { doc, getDoc, updateDoc } from "firebase/firestore"; // getDoc dan updateDoc untuk Firestore

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // Untuk user dari Firebase Auth
  const [profileData, setProfileData] = useState({ // Untuk data profil dari Firestore
    nama: "",
    email: "",
    telp: "",
    role: "",
  });
  const [loading, setLoading] = useState(true); // State loading
  const [isEditing, setIsEditing] = useState(false); // State mode edit
  const [editForm, setEditForm] = useState({ // State untuk form edit
    nama: "",
    telp: "",
  });

  // --- Efek untuk mengambil data user saat komponen dimuat atau status auth berubah ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Jika user login, ambil data profil dari Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setProfileData({
              nama: data.nama || "",
              email: data.email || user.email, // Ambil dari Firestore, fallback ke Auth email
              telp: data.telp || "",
              role: data.role || "user",
            });
            setEditForm({ // Isi form edit dengan data yang ada
              nama: data.nama || "",
              telp: data.telp || "",
            });
          } else {
            // Jika dokumen di Firestore tidak ditemukan, mungkin user baru register
            // tapi belum ada dokumennya (walaupun harusnya ada setelah register)
            // Atau user ini sudah ada sebelum Firestore diimplementasikan
            setProfileData({
              nama: user.displayName || "",
              email: user.email || "",
              telp: "", // Tidak ada di Auth, jadi kosongkan
              role: "user", // Default ke user
            });
            setEditForm({
              nama: user.displayName || "",
              telp: "",
            });
            toast.error("Dokumen profil tidak ditemukan, mungkin data belum lengkap.", { position: "top-center" });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Gagal memuat profil. Coba lagi.", { position: "top-center" });
        } finally {
          setLoading(false);
        }
      } else {
        // Jika user tidak login, redirect ke halaman login
        navigate("/");
        toast.error("Anda harus login untuk melihat profil.", { position: "top-center" });
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [navigate]); // Dependency array: jalankan ulang jika navigate berubah

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true); // Aktifkan loading saat update

    if (!currentUser) {
      toast.error("Anda tidak login.", { position: "top-center" });
      setLoading(false);
      return;
    }

    if (!editForm.nama.trim() || !editForm.telp.trim()) {
      toast.error("Nama dan Nomor Telepon tidak boleh kosong.", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      // 1. Update displayName di Firebase Auth (opsional, jika nama juga berubah)
      if (editForm.nama !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: editForm.nama,
        });
      }

      // 2. Update data di Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        nama: editForm.nama,
        telp: editForm.telp,
        // Email dan Role biasanya tidak diizinkan diubah dari halaman profil
        // email: profileData.email, // Email tidak bisa diubah dari sini
        // role: profileData.role, // Role tidak bisa diubah dari sini
      });

      // Perbarui state profileData setelah sukses update
      setProfileData((prev) => ({
        ...prev,
        nama: editForm.nama,
        telp: editForm.telp,
      }));

      toast.success("Profil berhasil diperbarui!", { position: "top-center" });
      setIsEditing(false); // Keluar dari mode edit
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil. Coba lagi.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar />

      <div className="py-10 px-5 md:px-32 flex-1">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Profil Pengguna</h2>

        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={editForm.nama}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 rounded border text-black bg-gray-100 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profileData.email} // Email tidak bisa diedit
                  className="w-full px-4 py-2 rounded border text-gray-600 bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Nomor Telepon</label>
                <input
                  type="text"
                  name="telp"
                  value={editForm.telp}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 rounded border text-black bg-gray-100 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={profileData.role} // Role tidak bisa diedit
                  className="w-full px-4 py-2 rounded border text-gray-600 bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ // Reset form edit jika dibatalkan
                      nama: profileData.nama,
                      telp: profileData.telp,
                    });
                  }}
                  className="px-6 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-gray-500 text-sm">Nama Lengkap</p>
                <p className="text-lg font-semibold text-gray-800">{profileData.nama}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-lg font-semibold text-gray-800">{profileData.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-500 text-sm">Nomor Telepon</p>
                <p className="text-lg font-semibold text-gray-800">{profileData.telp}</p>
              </div>
              <div className="mb-6">
                <p className="text-gray-500 text-sm">Role</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">{profileData.role}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                >
                  Edit Profil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}