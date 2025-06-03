// src/pages/AdminDashboard.jsx (atau AdminUsersPage.jsx)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import AdminSidebar from '../../components/Admin/AdminSidebar'; // Pastikan path ini sesuai
import AdminTopBar from '../../components/Admin/AdminTopBar';   // Sesuaikan path

// Firebase imports
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';

// Lucide React Icons
import {
  // SlidersHorizontal, // Dihapus karena tombol Sort dihilangkan
  Search,
  UserPlus,
  Eye,
  FileEdit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

const initialSampleUsers = [
  { uid: '1', id: '1', name: 'M. Taufiqurrahman', email: 'taufiq@example.com', telp: '081649036295', balance: 10000000, role: 'admin' },
  { uid: '2', id: '2', name: 'Tengku Rayhan Asemble', email: 'rayhan@example.com', telp: '0811221044', balance: 10000000, role: 'user' },
  { uid: '3', id: '3', name: 'Izzi Albasith', email: 'izzi@example.com', telp: '0811221044', balance: 10000000, role: 'partner' },
  { uid: '4', id: '4', name: 'User Keempat', email: 'user4@example.com', telp: '08123456789', balance: 5000000, role: 'user' },
];


function AdminDashboard() {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("admin");

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // Default sort by name
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.role === 'admin') {
              setIsAdmin(true);
              setAdminName(userData.name || "Admin");
              fetchAllUsers();
            } else {
              toast.error("Anda tidak memiliki akses admin.", { position: "top-center" });
              navigate("/");
            }
          } else {
            toast.error("Data pengguna tidak ditemukan.", { position: "top-center" });
            navigate("/login");
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          toast.error("Terjadi kesalahan saat otorisasi.", { position: "top-center" });
          navigate("/");
        }
      } else {
        toast.error("Anda harus login untuk mengakses halaman ini.", { position: "top-center" });
        navigate("/login");
        setPageLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAllUsers = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const fetchedUsers = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id, uid: docSnap.id, ...docSnap.data(), balance: docSnap.data().balance || 0,
      }));
      setUsers(fetchedUsers.length > 0 ? fetchedUsers : initialSampleUsers);
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error("Gagal memuat data pengguna.", { position: "top-center" });
      setUsers(initialSampleUsers);
    } finally {
      setPageLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.telp || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy]; const bValue = b[sortBy];
    if (aValue === undefined || aValue === null) return sortOrder === 'asc' ? 1 : -1;
    if (bValue === undefined || bValue === null) return sortOrder === 'asc' ? -1 : 1;
    if (typeof aValue === 'number' && typeof bValue === 'number') return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    if (typeof aValue === 'string' && typeof bValue === 'string') return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedUsers.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(column); setSortOrder('asc'); }
    setCurrentPage(1);
  };

  const getSortIndicator = (column) => {
    if (sortBy === column) return sortOrder === 'asc' ? <ArrowUpDown size={14} className="inline ml-1 opacity-70 transform rotate-180" /> : <ArrowUpDown size={14} className="inline ml-1 opacity-70" />;
    return <ArrowUpDown size={14} className="inline ml-1 opacity-30" />;
  };
  
  const handleAddUserClick = () => { setIsAddModalOpen(true); /* Implementasi modal */ };
  const handleEditUserClick = (user) => { setUserToEdit(user); setIsEditModalOpen(true); /* Implementasi modal */ };
  const handleDeleteUserClick = async (userIdToDelete) => { 
    if (window.confirm("Yakin hapus user?")) { console.log("Hapus user:", userIdToDelete); toast.success("Fungsi hapus belum diimplementasikan sepenuhnya."); }
  };

  if (pageLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <span className="loading loading-lg loading-spinner text-blue-600"></span>
      </div>
    );
  }

  if (!isAdmin) return null; 

  return (
    <div className="flex h-screen bg-gray-100 font-montserrat">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-40">
            <AdminTopBar adminName={adminName} welcomeText="Welcome!" />
        </div>
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Baris Aksi: Search dan Add User (Tombol Sort dihilangkan) */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-4">
            {/* Search Input dipindahkan ke kiri penuh jika tombol Sort tidak ada */}
            <div className="relative w-full sm:w-auto sm:max-w-sm md:max-w-md flex-1 sm:flex-none"> {/* flex-1 di mobile, fixed di layar besar */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                className="input input-bordered input-sm w-full pl-10 pr-4 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-0"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <button onClick={handleAddUserClick} className="btn btn-sm normal-case font-medium bg-gray-800 hover:bg-gray-900 text-white w-full sm:w-auto">
              <UserPlus size={16} className="mr-2" /> Add User
            </button>
          </div>

          {/* Tabel Pengguna */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="table w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase bg-gray-50">
                  {/* Kolom ID, Nama, Email, Phone, Balance, Role */}
                  {['id', 'name', 'email', 'telp', 'balance', 'role'].map((col) => (
                    <th key={col} className="px-6 py-3 cursor-pointer select-none whitespace-nowrap hover:bg-gray-100" onClick={() => handleSort(col)}>
                      {col} {getSortIndicator(col)}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center select-none whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRows.map((user, index) => (
                  <tr key={user.uid || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{(startIndex + index + 1).toString().padStart(users.length.toString().length, '0')}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.telp}</td>
                    <td className="px-6 py-4 text-gray-600">{user.balance ? `Rp ${Number(user.balance).toLocaleString('id-ID')}` : 'Rp 0'}</td>
                    <td className="px-6 py-4">
                      <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-green-100 text-green-700' :
                        user.role === 'user' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button title="View" className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"> <Eye size={16} /> </button>
                      <button title="Edit" onClick={() => handleEditUserClick(user)} className="btn btn-ghost btn-xs text-yellow-600 hover:bg-yellow-50"> <FileEdit size={16} /> </button>
                      <button title="Delete" onClick={() => handleDeleteUserClick(user.uid)} className="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"> <Trash2 size={16} /> </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {currentRows.length === 0 && !pageLoading && (
             <p className="text-center text-gray-500 mt-6">
               {searchTerm ? "Tidak ada pengguna yang cocok." : "Tidak ada data pengguna."}
             </p>
          )}

          {/* Kontrol Pagination - Dibuat lebih sejajar */}
          <div className="mt-6 flex flex-wrap justify-between items-center text-sm text-gray-600 gap-4"> {/* Menggunakan flex-wrap dan gap */}
            <div className="flex items-center gap-2"> {/* Bagian "Rows per page" */}
              <span>Rows per page</span>
              <select 
                className="select select-bordered select-sm bg-white border-gray-300 text-gray-700 focus:border-blue-500"
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="flex items-center gap-2"> {/* Bagian Info halaman dan tombol Navigasi */}
              <span>{`${filteredUsers.length > 0 ? startIndex + 1 : 0} - ${Math.min(startIndex + rowsPerPage, filteredUsers.length)} of ${filteredUsers.length}`}</span>
              <div className="join">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="join-item btn btn-sm btn-outline bg-white border-gray-300 text-gray-700 hover:bg-gray-50" disabled={currentPage === 1}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="join-item btn btn-sm btn-outline bg-white border-gray-300 text-gray-700 hover:bg-gray-50" disabled={currentPage === totalPages || totalPages === 0}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;