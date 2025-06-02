import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

function Flights() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
      
          <h1 className="text-2xl font-bold mb-4">Penerbangan</h1>
          <p className="text-gray-600 mb-6">
            Halaman ini akan menampilkan informasi penerbangan.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Flights;