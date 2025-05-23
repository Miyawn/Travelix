import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Kalau nanti ingin buat menu responsive

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#1c1c1c] shadow-md" : "bg-[#1c1c1c]"
      } text-white`}
    >
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold mx-8">LOGO</div>
        <div className="flex gap-12 mx-8">
          <button
            className="hover:underline"
            style={{
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "var(--base-black,rgb(255, 255, 255))",
              fontSize: 16,
              fontFamily: "",
              fontWeight: "100",
              wordWrap: "break-word",
            }}
          >
            Button
          </button>
          <button
            className="hover:underline"
            style={{
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "var(--base-black,rgb(255, 255, 255))",
              fontSize: 16,
              fontFamily: "",
              fontWeight: "100",
              wordWrap: "break-word",
            }}
          >
            Button
          </button>
          <Link to="/login">
            <button
              className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300"
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "var(--base-black, #171717)",
                fontSize: 16,
                fontFamily: "",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
            >
              Masuk
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
