import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./Login";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false); // <- Tambahan untuk logo hover

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginSuccess = () => {
    // Logic setelah login sukses bisa ditambahkan di sini
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
            {/* Logo sebagai image */}
            <Link to="/" className="select-none cursor-pointer">
              <img
                src={isLogoHovered ? "src/assets/3.svg" : "src/assets/2.svg"} // <- Ganti sesuai hover
                alt="Logo"
                className="h-16 w-auto"
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              />
            </Link>

            {/* Desktop menu */}
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
              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn btn-warning"
              >
                MASUK
              </button>
            </div>

            {/* Mobile hamburger */}
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

        {/* Mobile menu */}
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
            <button
              onClick={() => {
                setIsLoginOpen(true);
                setIsOpen(false);
              }}
              className="btn btn-warning w-full"
            >
              Masuk
            </button>
          </div>
        )}
      </nav>

      {/* Modal Login */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Navbar;
