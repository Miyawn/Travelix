// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import Navbar from '../../components/Navbar';            // Tetap butuh navbar

// Firebase imports
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'; // Import deleteDoc, updateDoc

// Modals (akan diimplementasikan di Bagian 2)
// import AddUserModal from '../components/AddUserModal';
// import EditUserModal from '../components/EditUserModal';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk highlight sidebar
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // State untuk fungsi tabel: search, sort, pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Sesuai gambar

  // State untuk modals (akan diimplementasikan di Bagian 2)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // --- Otorisasi Admin: Cek role pengguna saat memuat halaman ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            setIsAdmin(true);
            fetchAllUsers(); // Jika admin, ambil semua pengguna
          } else {
            toast.error("Anda tidak memiliki akses admin.", { position: "top-center" });
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          toast.error("Terjadi kesalahan saat otorisasi.", { position: "top-center" });
          navigate("/");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("Anda harus login untuk mengakses halaman ini.", { position: "top-center" });
        navigate("/");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // --- Ambil semua pengguna dari Firestore ---
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        balance: doc.data().balance || 0, // Default ke 0 jika tidak ada
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error("Gagal memuat data pengguna.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // --- Logika Tabel: Filter, Sort, Pagination ---

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // Gunakan optional chaining
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle null/undefined values for comparison gracefully
    if (aValue === undefined || aValue === null) return sortOrder === 'asc' ? 1 : -1;
    if (bValue === undefined || bValue === null) return sortOrder === 'asc' ? -1 : 1;


    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    // For numbers (like balance or ID if numeric)
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  useEffect(() => {
    // Reset page to 1 when search term or sort changes
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);


  // --- Fungsi CRUD (Placeholder untuk Bagian 2) ---

  const handleAddUserClick = () => {
    setIsAddModalOpen(true); // Buka modal Add User
    toast.info("Fungsi 'Tambah Pengguna' akan diimplementasikan di Bagian 2.");
  };

  const handleEditUserClick = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true); // Buka modal Edit User
    toast.info(`Fungsi 'Edit Pengguna' untuk ${user.name} akan diimplementasikan di Bagian 2.`);
  };

  const handleDeleteUserClick = async (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Ini tidak dapat dibatalkan!")) {
      try {
        setLoading(true);
        // Hapus dari Firestore
        await deleteDoc(doc(db, "users", userId));
        
        // Catatan: Menghapus user dari Firebase Authentication dari frontend
        // hanya bisa dilakukan untuk user yang sedang login.
        // Untuk menghapus user lain, Anda perlu menggunakan Firebase Cloud Functions
        // dengan Firebase Admin SDK.
        // Contoh placeholder untuk Cloud Function call:
        // await fetch('YOUR_CLOUD_FUNCTION_ENDPOINT_TO_DELETE_AUTH_USER', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ uid: userId })
        // });

        toast.success("Pengguna berhasil dihapus!");
        fetchAllUsers(); // Refresh daftar pengguna
      } catch (error) {
        console.error("Error menghapus pengguna:", error);
        toast.error("Gagal menghapus pengguna. Periksa konsol untuk detail.");
      } finally {
        setLoading(false);
      }
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Memuat Dashboard Admin...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Pengguna akan diredirect oleh useEffect jika bukan admin
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <AdminSidebar />
      
      <div className="flex-1 ml-64 p-8 pt-20"> {/* ml-64 untuk memberi ruang sidebar */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome! admin</h1>
        
        {/* Konten Tabel Pengguna (yang sebelumnya di UserTable.jsx) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
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
            <button onClick={handleAddUserClick} className="btn btn-primary bg-yellow-500 hover:bg-yellow-600 text-black">
              + Add User
            </button>
          </div>

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
                    <tr key={user.id || index}>
                      <td>{user.id ? user.id.substring(0, 5) + '...' : ''}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.telp}</td>
                      <td>{user.balance ? `Rp. ${user.balance.toLocaleString('id-ID')}` : 'Rp. 0'}</td>
                      <td className="capitalize">{user.role}</td>
                      <td>
                        <button onClick={() => handleEditUserClick(user)} className="btn btn-sm btn-info text-white mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteUserClick(user.id)} className="btn btn-sm btn-error text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Rows per page:
              <select
                className="select select-bordered select-sm ml-2 text-black"
                value={rowsPerPage}
                onChange={(e) => { /* Logic to change rowsPerPage */ }}
                disabled /* Disabled for now as rowsPerPage is fixed */
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="mr-4">
                {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
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

      {/* Modals (akan diimplementasikan di Bagian 2) */}
      {/* {isAddModalOpen && <AddUserModal onClose={() => setIsAddModalOpen(false)} onUserAdded={fetchAllUsers} />} */}
      {/* {isEditModalOpen && <EditUserModal user={userToEdit} onClose={() => setIsEditModalOpen(false)} onUserUpdated={fetchAllUsers} />} */}
    </div>
  );
}

export default AdminDashboard;