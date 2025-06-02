import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Komponen UI & Firebase
import Navbar from '../../components/Navbar';       // Sesuaikan path jika perlu
import AdminSidebar from '../../components/AdminSidebar'; // Sesuaikan path jika perlu
import { db } from '../../firebaseConfig';           // Sesuaikan path jika perlu
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function EditUser() {
  const { userId } = useParams(); // Mengambil 'userId' dari URL
  const navigate = useNavigate();

  // State untuk data form dan status loading
  const [formData, setFormData] = useState({ id: '', name: '', email: '', telp: '', role: 'user', balance: 0 });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Efek untuk mengambil data pengguna yang akan diedit
  useEffect(() => {
    if (!userId) {
      toast.error("User ID tidak valid.");
      navigate('/manageuser');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          // Data ID sudah diambil dan disimpan di sini
          setFormData({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Data pengguna tidak ditemukan.");
          navigate('/manageuser');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal memuat data pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handler untuk submit form (update data)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!window.confirm("Apakah Anda yakin ingin menyimpan perubahan ini?")) return;

    setIsUpdating(true);
    const userDocRef = doc(db, "users", userId);

    try {
      const dataToUpdate = {
        name: formData.name,
        telp: formData.telp,
        role: formData.role,
        balance: Number(formData.balance) || 0,
      };
      await updateDoc(userDocRef, dataToUpdate);
      toast.success("Data pengguna berhasil diperbarui!");
      navigate('/manageuser');
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Gagal memperbarui data.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Memuat data pengguna...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8 pt-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Pengguna</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleUpdate}>

            {/* --- BAGIAN YANG DITAMBAHKAN --- */}
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">User ID (Tidak dapat diubah)</span></label>
              <input 
                type="text" 
                name="id" 
                value={formData.id || ''} 
                className="input input-bordered w-full bg-gray-200 cursor-not-allowed" 
                readOnly 
              />
            </div>
            {/* ----------------------------- */}

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Nama Lengkap</span></label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="input input-bordered w-full text-black" required />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Email (Tidak dapat diubah)</span></label>
              <input type="email" name="email" value={formData.email || ''} className="input input-bordered w-full bg-gray-200 cursor-not-allowed" readOnly />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Nomor Telepon</span></label>
              <input type="tel" name="telp" value={formData.telp || ''} onChange={handleChange} className="input input-bordered w-full text-black" />
            </div>
            
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Saldo (Balance)</span></label>
              <input type="number" name="balance" value={formData.balance || 0} onChange={handleChange} className="input input-bordered w-full text-black" min="0" />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Role</span></label>
              <select name="role" value={formData.role || 'user'} onChange={handleChange} className="select select-bordered w-full text-black">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button type="button" onClick={() => navigate('/manageuser')} className="btn btn-ghost" disabled={isUpdating}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;