// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate digunakan di useEffect
import { toast } from 'react-hot-toast';

import AdminSidebar from '../../components/Admin/AdminSidebar'; // Pastikan path ini sesuai dengan struktur folder Anda
import AdminTopBar from '../../components/Admin/AdminTopBar';   // Sesuaikan path jika perlu

// Firebase imports
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';

// Lucide React Icons untuk tabel pengguna
import {
  SlidersHorizontal,
  Search,
  UserPlus,
  Eye,
  FileEdit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

// Sample data jika fetchAllUsers belum mengembalikan data atau untuk dev
const initialSampleUsers = [
  { uid: '1', id: '1', name: 'M. Taufiqurrahman', email: 'taufiq@example.com', telp: '081649036295', balance: 10000000, role: 'admin' },
  { uid: '2', id: '2', name: 'Tengku Rayhan Asemble', email: 'rayhan@example.com', telp: '0811221044', balance: 10000000, role: 'user' },
  { uid: '3', id: '3', name: 'Izzi Albasith', email: 'izzi@example.com', telp: '0811221044', balance: 10000000, role: 'partner' },
  { uid: '4', id: '4', name: 'User Keempat', email: 'user4@example.com', telp: '08123456789', balance: 5000000, role: 'user' },
];


function AdminDashboard() {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [users, setUsers] = useState([]); // Ini akan menjadi data untuk tabel pengguna
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("admin"); // Untuk ditampilkan di TopBar

  // State untuk fungsi tabel: search, sort, pagination (tetap di sini jika tabel pengguna adalah konten utama dashboard ini)
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State untuk modals (tetap di sini)
  // eslint-disable-next-line no-unused-vars
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
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
              setAdminName(userData.name || "Admin"); // Ambil nama admin jika ada
              fetchAllUsers(); // Memuat data pengguna karena ini halaman utama admin
            } else {
              toast.error("Anda tidak memiliki akses admin.", { position: "top-center" });
              navigate("/");
            }
          } else {
            // User auth ada tapi tidak ada dokumen di Firestore collection 'users'
            toast.error("Data pengguna tidak ditemukan. Silakan hubungi support.", { position: "top-center" });
            navigate("/login"); // Atau logout user: auth.signOut(); navigate("/login");
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
    // Tidak perlu setPageLoading(true) di sini karena sudah dihandle oleh useEffect utama
    try {
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const fetchedUsers = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        uid: docSnap.id,
        ...docSnap.data(),
        balance: docSnap.data().balance || 0,
      }));
      setUsers(fetchedUsers.length > 0 ? fetchedUsers : initialSampleUsers); // Fallback jika fetch kosong
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error("Gagal memuat data pengguna.", { position: "top-center" });
      setUsers(initialSampleUsers); // Fallback jika error
    } finally {
      setPageLoading(false); // Set loading false setelah selesai fetch atau error
    }
  };

  // --- Logika Tabel: Filter, Sort, Pagination (tetap sama) ---
   const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.telp || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy];
    const bValue = b[sortBy];
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
  const handleDeleteUserClick = async (userIdToDelete) => { /* ... (logika hapus) ... */ 
      if (window.confirm("Yakin hapus user?")) {
        console.log("Hapus user:", userIdToDelete);
        toast.success("Fungsi hapus belum diimplementasikan sepenuhnya.");
      }
  };

  // Tampilan loading utama jika data belum siap atau belum terotentikasi sebagai admin
  if (pageLoading) {
    return (
      <div className="flex h-screen bg-base-200 items-center justify-center">
        {/* Bisa tambahkan AdminSidebar di sini jika diinginkan tampil saat loading */}
        {/* <AdminSidebar /> */}
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  // Jika sudah tidak loading dan bukan admin (seharusnya sudah diredirect oleh useEffect)
  if (!isAdmin) {
    return null; 
  }

  // Jika admin dan data sudah dimuat (atau fallback ke sample)
  return (
    <div className="flex h-screen bg-base-200 font-montserrat"> {/* Gunakan font dari gambar jika perlu */}
      <AdminSidebar /> {/* Sidebar di sisi kiri */}
      
      <div className="flex-1 flex flex-col overflow-hidden"> {/* Konten utama di kanan */}
        {/* 2. Panggil AdminTopBar di sini */}
        <div className="sticky top-0 z-40"> {/* Wrapper untuk membuat top bar sticky */}
            <AdminTopBar adminName={adminName} welcomeText="Welcome!" />
        </div>
        
        {/* Konten spesifik halaman (Tabel Pengguna, dll.) */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Baris Aksi: Sort, Search, Add User */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="btn btn-outline btn-sm normal-case font-normal text-base-content border-base-300">
                <SlidersHorizontal size={16} className="mr-2" /> Sort
              </button>
              <div className="relative w-full max-w-xs sm:max-w-sm flex-1"> {/* Atau sesuaikan lebar jika perlu */}
  
                {/* Wrapper untuk ikon, diposisikan absolut di dalam input */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="opacity-100 text-black" />
                </div>

                {/* Input field dengan padding kiri untuk memberi ruang bagi ikon */}
                <input
                  type="text"
                  placeholder="Search anything..."
                  // Kelas DaisyUI input tetap digunakan, tambahkan pl-10 untuk padding kiri
                  className="input input-bordered input-sm w-full pl-10 pr-4 focus:border-primary focus:ring-0" 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                />
              </div>
            </div>
            <button onClick={handleAddUserClick} className="btn btn-neutral btn-sm normal-case font-medium w-full sm:w-auto">
              <UserPlus size={16} className="mr-2" /> Add User
            </button>
          </div>

          {/* Tabel Pengguna */}
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
            <table className="table w-full text-sm">
              <thead>
                <tr className="text-xs text-base-content/70 uppercase">
                  {['id', 'name', 'email', 'telp', 'balance', 'role'].map((col) => (
                    <th key={col} className="cursor-pointer select-none whitespace-nowrap hover:bg-base-200/60" onClick={() => handleSort(col)}>
                      {col} {getSortIndicator(col)}
                    </th>
                  ))}
                  <th className="text-center select-none whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((user, index) => (
                  <tr key={user.uid || index} className="hover">
                    <td className="text-base-content/80">{(startIndex + index + 1).toString().padStart(users.length.toString().length, '0')}</td>
                    <td className="font-medium text-base-content">{user.name}</td>
                    <td className="text-base-content/80">{user.email}</td>
                    <td className="text-base-content/80">{user.telp}</td>
                    <td className="text-base-content/80">{user.balance ? `Rp. ${Number(user.balance).toLocaleString('id-ID')}` : 'Rp. 0'}</td>
                    <td>
                      <span className={`badge badge-sm ${
                        user.role === 'admin' ? 'badge-primary' :
                        user.role === 'user' ? 'badge-info badge-outline' :
                        'badge-warning badge-outline'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center whitespace-nowrap">
                      <button title="View" className="btn btn-ghost btn-xs text-info"> <Eye size={16} /> </button>
                      <button title="Edit" onClick={() => handleEditUserClick(user)} className="btn btn-ghost btn-xs text-warning"> <FileEdit size={16} /> </button>
                      <button title="Delete" onClick={() => handleDeleteUserClick(user.uid)} className="btn btn-ghost btn-xs text-error"> <Trash2 size={16} /> </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {currentRows.length === 0 && !pageLoading && (
             <p className="text-center text-base-content/70 mt-6">
               {searchTerm ? "Tidak ada pengguna yang cocok." : "Tidak ada data pengguna."}
             </p>
          )}

          {/* Kontrol Pagination */}
          {/* <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-base-content/80">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span>Rows per page</span>
              <select 
                className="select select-bordered select-xs"
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value={10}>10</option><option value={3}>3</option><option value={5}>5</option><option value={20}>20</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>{`${filteredUsers.length > 0 ? startIndex + 1 : 0}-${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length}`}</span>
              <div className="join">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="join-item btn btn-sm btn-outline" disabled={currentPage === 1}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="join-item btn btn-sm btn-outline" disabled={currentPage === totalPages || totalPages === 0}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div> */}
        </main>
      </div>
      {/* Modals di sini jika perlu */}
    </div>
  );
}

export default AdminDashboard;