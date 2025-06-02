import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState("Pengguna");
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        let name = user.displayName;
        if (!name && user.email) {
          name = user.email.split('@')[0];
        }
        if (!name) {
          name = "Pengguna";
        }
        setUserDisplayName(name);

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data().role);
          } else {
            console.warn("Dokumen pengguna tidak ditemukan di Firestore untuk UID:", user.uid);
            setUserRole("user"); 
          }
        } catch (error) {
          console.error("Error mengambil role pengguna dari Firestore:", error);
          setUserRole("user"); 
        }

      } else {
        setCurrentUser(null);
        setUserDisplayName("Pengguna");
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginSuccess = () => {
    // onAuthStateChanged akan otomatis memperbarui UI
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Berhasil keluar!", { position: "top-center" });
      navigate("/");
    } catch (error) {
      console.error("Error saat logout:", error);
      toast.error("Gagal keluar. Coba lagi.", { position: "top-center" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#1c1c1c]/50 backdrop-blur-md shadow-md"
            : "bg-[#1c1c1c]"
        }`}
      >
        <div className="max-w mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="select-none cursor-pointer">
              <img
                src={isLogoHovered ? "src/assets/3.svg" : "src/assets/2.svg"}
                alt="Logo"
                className="h-16 w-auto"
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center font-sans font-normal space-x-8">
              <Link
                to="/flights"
                className="text-white hover:text-yellow-400 transition font-normal"
              >
                Penerbangan
              </Link>
              <Link
                to="/hotel"
                className="text-white hover:text-yellow-400 transition font-normal"
              >
                Hotel
              </Link>

              {/* Logika Kondisional untuk Tombol Login / Nama Pengguna */}
              {currentUser ? (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-warning m-1">
                    Halo, {userDisplayName}
                    {userRole === 'admin' && <span className="font-bold ml-1">(Admin)</span>}!
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-black">
                    {userRole !== 'admin' && ( // <-- Kondisi untuk NON-ADMIN
                      <>
                        <li><Link to="/profiluser">Profil</Link></li>
                        <li><Link to="/orders">Pesanan Saya</Link></li>
                      </>
                    )}
                    {userRole === 'admin' && ( // <-- Kondisi untuk ADMIN
                      <li><Link to="/manageuser">Dashboard Admin</Link></li>
                    )}
                    <li><button onClick={handleLogout}>Keluar</button></li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="btn btn-warning"
                >
                  MASUK
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <button
                className="btn btn-square btn-ghost text-white"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isOpen && (
          <div className="md:hidden bg-[#1c1c1c] px-4 pb-4 space-y-2">
            <Link
              to="/flights"
              className="block text-white hover:text-yellow-400 transition py-2 font-small"
              onClick={() => setIsOpen(false)}
            >
              Penerbangan
            </Link>
            <Link
              to="/hotel"
              className="block text-white hover:text-yellow-400 transition py-2 font-small"
              onClick={() => setIsOpen(false)}
            >
              Hotel
            </Link>
            {currentUser ? (
              <>
                <div className="block text-white py-2 font-small">
                  Halo, {userDisplayName}
                  {userRole === 'admin' && <span className="font-bold ml-1">(Admin)</span>}!
                </div>
                {userRole !== 'admin' && ( // <-- Kondisi untuk NON-ADMIN
                  <>
                    <Link
                      to="/profile"
                      className="block text-white hover:text-yellow-400 transition py-2 font-small"
                      onClick={() => setIsOpen(false)}
                    >
                      Profil
                    </Link>
                    <Link
                      to="/orders"
                      className="block text-white hover:text-yellow-400 transition py-2 font-small"
                      onClick={() => setIsOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className="block text-white hover:text-yellow-400 transition py-2 font-small"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="btn btn-warning w-full"
                >
                  Keluar
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsOpen(false);
                }}
                className="btn btn-warning w-full"
              >
                Masuk
              </button>
            )}
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Navbar;