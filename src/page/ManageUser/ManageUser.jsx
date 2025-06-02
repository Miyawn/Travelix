
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar'; // Pastikan path ini benar
import Navbar from '../../components/Navbar';             // Pastikan path ini benar

// Firebase imports
import { auth, db } from '../../firebaseConfig'; // Pastikan path ini benar
import { onAuthStateChanged } from 'firebase/auth'; // Untuk otorisasi
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'; // Untuk CRUD Firestore

// Hapus import modal EditUserModal, karena sekarang menggunakan halaman terpisah
// import EditUserModal from '../components/EditUserModal'; 
// import AddUserModal from '../components/AddUserModal'; // Jika Anda akan mengimplementasikan modal AddUser nanti

function ManageUser() {
  const navigate = useNavigate();
  const location = useLocation(); // Digunakan oleh AdminSidebar untuk highlight
  
  const [loading, setLoading] = useState(true); // State untuk mengelola status loading data
  const [users, setUsers] = useState([]); // State untuk menyimpan daftar pengguna dari Firestore
  const [isAdmin, setIsAdmin] = useState(false); // State untuk otorisasi akses ke dashboard ini

  // State untuk fungsi tabel (search, sort, pagination)
  const [searchTerm, setSearchTerm] = useState(''); // State untuk input pencarian
  const [sortBy, setSortBy] = useState(null); // Kolom yang sedang disortir
  const [sortOrder, setSortOrder] = useState('asc'); // Urutan sorting ('asc' atau 'desc')
  const [currentPage, setCurrentPage] = useState(1); // Halaman pagination saat ini
  const rowsPerPage = 10; // Jumlah baris per halaman, sesuai gambar

  // State untuk modals (jika Anda akan mengimplementasikan AddUserModal)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // State untuk modal edit dihapus karena kita navigasi ke halaman terpisah
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [userToEdit, setUserToEdit] = useState(null);


  // --- Efek untuk Otorisasi Admin: Cek role pengguna saat memuat halaman ---
  useEffect(() => {
    // onAuthStateChanged akan memantau status autentikasi pengguna
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Jika ada pengguna yang login, cek rolenya dari Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          // Jika dokumen user ditemukan dan rolenya adalah 'admin'
          if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            setIsAdmin(true); // Set state isAdmin menjadi true
            fetchAllUsers(); // Jika admin, panggil fungsi untuk mengambil semua pengguna
          } else {
            // Jika bukan admin, tampilkan pesan error dan redirect ke halaman utama
            toast.error("Anda tidak memiliki akses admin.", { position: "top-center" });
            navigate("/"); 
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          toast.error("Terjadi kesalahan saat otorisasi.", { position: "top-center" });
          navigate("/");
        } finally {
          setLoading(false); // Matikan loading setelah proses otorisasi selesai
        }
      } else {
        // Jika pengguna tidak login, tampilkan pesan error dan redirect ke halaman utama
        toast.error("Anda harus login untuk mengakses halaman ini.", { position: "top-center" });
        navigate("/");
        setLoading(false);
      }
    });

    // Fungsi cleanup: Hentikan listener saat komponen di-unmount
    return () => unsubscribe();
  }, [navigate]); // Dependensi: navigate agar useEffect re-run jika navigate berubah

  // --- Fungsi untuk Mengambil Semua Pengguna dari Firestore ---
  const fetchAllUsers = async () => {
    try {
      setLoading(true); // Aktifkan loading saat mengambil data
      const usersCollectionRef = collection(db, "users"); // Referensi ke koleksi 'users'
      const querySnapshot = await getDocs(usersCollectionRef); // Ambil semua dokumen

      const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id, // Ambil ID dokumen dari Firestore
        ...doc.data(), // Ambil semua field data
        balance: doc.data().balance || 0, // Pastikan 'balance' ada, default 0 jika tidak
      }));
      setUsers(fetchedUsers); // Set data pengguna ke state
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error("Gagal memuat data pengguna.", { position: "top-center" });
    } finally {
      setLoading(false); // Matikan loading setelah selesai fetching
    }
  };

  // --- Logika Tabel: Filter, Sort, Pagination ---

  // Filter pengguna berdasarkan searchTerm
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // Gunakan optional chaining (?) untuk mencegah error jika field kosong
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort pengguna berdasarkan sortBy dan sortOrder
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0; // Jika tidak ada kolom sort, jangan lakukan apa-apa

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Tangani nilai null/undefined dengan baik saat perbandingan
    if (aValue === undefined || aValue === null) return sortOrder === 'asc' ? 1 : -1;
    if (bValue === undefined || bValue === null) return sortOrder === 'asc' ? -1 : 1;

    // Perbandingan untuk string
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    // Perbandingan untuk angka (misalnya 'balance')
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Logika Pagination
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleSort = (column) => {
    if (sortBy === column) {
      // Jika kolom yang sama diklik lagi, ubah urutan sort
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Jika kolom berbeda diklik, mulai sort baru dengan urutan 'asc'
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Mengembalikan indikator sort (panah atas/bawah)
  const getSortIndicator = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  // Reset halaman pagination ke 1 setiap kali search atau sort berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);


  // --- Fungsi CRUD: Tambah, Edit, Hapus Pengguna ---

  const handleAddUserClick = () => {
    // Ubah fungsi ini untuk navigasi ke halaman tambah pengguna
    navigate('/manageuser/add');
  };

  // Fungsi Edit: Navigasi ke halaman EditUser.jsx
const handleEditUserClick = (user) => {
  console.log("Navigating to edit user:", user);
  console.log("User ID:", user.id);
  if (!user.id) {
    console.error("User ID is missing!");
    toast.error("Tidak dapat mengedit: User ID tidak ditemukan.");
    return;
  }
  navigate(`/edituser/edit/${user.id}`);
};

  // Fungsi Hapus Pengguna
  const handleDeleteUserClick = async (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Ini tidak dapat dibatalkan!")) {
      try {
        setLoading(true); 
        await deleteDoc(doc(db, "users", userId));
        toast.success("Pengguna berhasil dihapus!");
        fetchAllUsers(); // Refresh daftar pengguna setelah penghapusan
      } catch (error) {
        console.error("Error menghapus pengguna:", error);
        toast.error("Gagal menghapus pengguna. Periksa konsol untuk detail.");
      } finally {
        setLoading(false); // Matikan loading
      }
    }
  };

  // --- Tampilan Loading ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Memuat Dashboard Admin...</p>
      </div>
    );
  }

  // --- Otorisasi Tampilan (Redirect akan terjadi di useEffect jika bukan admin) ---
  if (!isAdmin) {
    return null; // Tidak menampilkan apa-apa jika bukan admin (sudah diredirect)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar /> {/* Navbar utama aplikasi */}
      <AdminSidebar /> {/* Sidebar navigasi admin */}
      
      <div className="flex-1 ml-64 p-8 pt-20"> {/* margin-left 64px untuk memberi ruang sidebar */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome! admin</h1>
        
        {/* Bagian Konten Tabel Pengguna */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            {/* Input Pencarian & Tombol Sort */}
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search anything..."
                className="input input-bordered w-full max-w-xs text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => handleSort(sortBy || 'id')} className="btn btn-ghost ml-2 text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM4 10a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM4 16a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>
                Sort
              </button>
            </div>
            {/* Tombol Tambah Pengguna */}
            <button onClick={handleAddUserClick} className="btn btn-primary bg-yellow-500 hover:bg-yellow-600 text-black">
              + Add User
            </button>
          </div>

          {/* Tabel Pengguna */}
          <div className="overflow-x-auto">
            <table className="table w-full text-black">
              <thead>
                <tr>
                  <th className="cursor-pointer" onClick={() => handleSort('id')}>ID {getSortIndicator('id')}</th>
                  <th className="cursor-pointer" onClick={() => handleSort('name')}>NAME {getSortIndicator('name')}</th>
                  <th className="cursor-pointer" onClick={() => handleSort('email')}>EMAIL {getSortIndicator('email')}</th>
                  <th className="cursor-pointer" onClick={() => handleSort('telp')}>PHONE {getSortIndicator('telp')}</th>
                  <th className="cursor-pointer" onClick={() => handleSort('balance')}>BALANCE {getSortIndicator('balance')}</th>
                  <th className="cursor-pointer" onClick={() => handleSort('role')}>ROLE {getSortIndicator('role')}</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((user, index) => (
                    <tr key={user.id || index}> {/* Gunakan user.id sebagai key */}
                      <td>{user.id ? user.id.substring(0, 5) + '...' : ''}</td> {/* Menampilkan 5 karakter pertama dari ID */}
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.telp}</td>
                      <td>{user.balance ? `Rp. ${user.balance.toLocaleString('id-ID')}` : 'Rp. 0'}</td> {/* Format saldo */}
                      <td className="capitalize">{user.role}</td> {/* Huruf kapital di awal kata */}
                      <td>
                        {/* Tombol Edit */}
                        <button onClick={() => handleEditUserClick(user)} className="btn btn-sm btn-info text-white mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z" /></svg>
                        </button>
                        {/* Tombol Hapus */}
                        <button onClick={() => handleDeleteUserClick(user.id)} className="btn btn-sm btn-error text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">Tidak ada pengguna ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Kontrol Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Rows per page: {/* Bagian ini disabled karena rowsPerPage sudah fixed */}
              <select
                className="select select-bordered select-sm ml-2 text-black"
                value={rowsPerPage}
                onChange={(e) => { /* Tidak ada logika perubahan di sini */ }}
                disabled 
              >
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="mr-4">
                {/* Menampilkan X-Y dari Z total */}
                {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredUsers.length)} dari {filteredUsers.length}
              </span>
              {/* Tombol Previous Page */}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              {/* Tombol Next Page */}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modals (jika Anda akan mengimplementasikannya, misal AddUserModal) */}
      {/* {isAddModalOpen && <AddUserModal onClose={() => setIsAddModalOpen(false)} onUserAdded={fetchAllUsers} />} */}
    </div>
  );
}

export default ManageUser;