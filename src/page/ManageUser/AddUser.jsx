import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Komponen UI
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

// Firebase imports
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    telp: '',
    role: 'user',
    balance: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fungsi handleSubmit tidak perlu diubah, logikanya sudah benar
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password minimal harus 6 karakter.");
      return;
    }
    if (!window.confirm(`Anda akan membuat pengguna baru dengan email ${formData.email}. Lanjutkan?`)) {
      return;
    }

    setIsSubmitting(true);
    
    const appName = `secondary-app-${Date.now()}`;
    let secondaryApp;

    try {
      secondaryApp = initializeApp(firebaseConfig, appName);
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      const user = userCredential.user;

      const userDataForFirestore = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        telp: formData.telp,
        role: formData.role,
        balance: Number(formData.balance) || 0,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(getFirestore(), "users", user.uid), userDataForFirestore);

      toast.success("Pengguna baru berhasil dibuat!");
      navigate('/manageuser');

    } catch (error) {
      console.error("Error creating new user:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Gagal: Email ini sudah terdaftar.");
      } else {
        toast.error("Terjadi kesalahan saat membuat pengguna.");
      }
    } finally {
      if (secondaryApp) {
        await deleteApp(secondaryApp);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8 pt-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Tambah Pengguna Baru</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            
            {/* --- BAGIAN YANG DITAMBAHKAN --- */}
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">User ID</span></label>
              <input 
                type="text" 
                placeholder="(Akan dibuat otomatis setelah disimpan)"
                className="input input-bordered w-full bg-gray-200 cursor-not-allowed" 
                disabled // Gunakan disabled agar lebih jelas secara fungsional
              />
            </div>
            {/* ----------------------------- */}

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Nama Lengkap</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full text-black" required />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered w-full text-black" required />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input input-bordered w-full text-black" required minLength="6" />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Nomor Telepon</span></label>
              <input type="tel" name="telp" value={formData.telp} onChange={handleChange} className="input input-bordered w-full text-black" />
            </div>
            
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Saldo Awal (Balance)</span></label>
              <input type="number" name="balance" value={formData.balance} onChange={handleChange} className="input input-bordered w-full text-black" min="0" />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Role</span></label>
              <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered w-full text-black">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button type="button" onClick={() => navigate('/manageuser')} className="btn btn-ghost" disabled={isSubmitting}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;