import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminTopBar from '../../components/Admin/AdminTopBar';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { toast } from 'react-hot-toast';

function AdminEdit({ children, welcomeText = "Welcome!" }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const Auth = getAuth();
    const unsubscribe = onAuthStateChanged(Auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.role === 'admin' || userData.role === 'superadmin') {
              setIsAdmin(true);
              setAdminName(userData.name || "Admin");
              fetchAllUsers();
            } else {
              toast.error("Anda tidak memiliki akses admin.", { position: "top-center" });
              navigate("/");
              setPageLoading(false);
            }
          } else {
            toast.error("Data pengguna tidak ditemukan.", { position: "top-center" });
            navigate("/login");
            setPageLoading(false);
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          toast.error("Terjadi kesalahan saat otorisasi.", { position: "top-center" });
          navigate("/");
          setPageLoading(false);
        }
      } else {
        toast.error("Anda harus login untuk mengakses halaman ini.", { position: "top-center" });
        navigate("/login");
        setPageLoading(false);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [navigate]);

  // Contoh fungsi fetchAllUsers, bisa diisi sesuai kebutuhan page Add
  const fetchAllUsers = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const fetchedUsers = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id, uid: docSnap.id, ...docSnap.data(),
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching all users:", error);
      setUsers([]);
    } finally {
      setPageLoading(false);
    }
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
          <AdminTopBar adminName={adminName} welcomeText={welcomeText} />
        </div>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminEdit;