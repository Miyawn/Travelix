import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg1.jpg";
// import kamar1 from "../assets/kamar1.jpg"; // Tidak lagi diperlukan jika gambar dari Firestore
import CardHotel from "../components/CardHotel";

// Import db (Firestore) dan fungsi yang diperlukan
import { db } from "../firebaseConfig"; // Sesuaikan path jika berbeda
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast"; // Untuk notifikasi

export default function KamarHotel() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]); // State untuk menyimpan data hotel dari Firestore
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // --- Ambil Data Hotel dari Firestore ---
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true); // Mulai loading
        setError(null); // Reset error
        const hotelsCollectionRef = collection(db, "hotels"); // Referensi ke koleksi 'hotels'
        const querySnapshot = await getDocs(hotelsCollectionRef); // Ambil semua dokumen

        const fetchedHotels = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Ambil ID dokumen
          ...doc.data(), // Ambil data dokumen (name, beds, location, imageUrl)
        }));
        setHotels(fetchedHotels); // Set data ke state hotels
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Gagal memuat daftar hotel. Silakan coba lagi.");
        toast.error("Gagal memuat hotel. Coba lagi nanti.", { position: "top-center" });
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchHotels();
  }, []); // Array dependensi kosong agar efek ini hanya berjalan sekali saat komponen dimuat

  // Logika Pagination
  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = hotels.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar />

      {/* Hero */}
      <div
        className="bg-cover bg-center h-[370px] text-white flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="h-[370px] w-full bg-black/60 backdrop-blur-[3px] z-0">
          <div className="text-center pt-20 z-10 relative">
            <h1 className="text-7xl font-bold">Hotel</h1>
            <p className="text-lg mt-2 max-w-2xl mx-auto">
              Rencanakan perjalanan Anda dengan percaya diri! Travelix berkomitmen untuk memberikan pengalaman pemesanan hotel yang mulus dan bebas stress.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-10 px-5 md:px-32 flex-1">
        <h2 className="text-2xl font-semibold text-center mb-8 text-black">Daftar Hotel</h2>

        {loading && (
          <div className="text-center text-gray-700 text-lg">
            Memuat hotel...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-lg">
            {error}
          </div>
        )}

        {!loading && !error && hotels.length === 0 && (
          <div className="text-center text-gray-700 text-lg">
            Tidak ada hotel yang tersedia saat ini.
          </div>
        )}

        {!loading && !error && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 mx-16 gap-10 text-black">
            {paginatedHotels.map((hotel) => ( // Tidak perlu index lagi jika sudah ada hotel.id
              <CardHotel
                key={hotel.id} // Gunakan ID dokumen dari Firestore sebagai key
                image={hotel.imageUrl} // <-- Gunakan imageUrl dari Firestore
                name={hotel.name}
                beds={hotel.beds}
                location={hotel.location}
                onBook={() => alert(`Booking ${hotel.name} diklik!`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && hotels.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            <div className="join">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`join-item btn border-none outline-none ring-0 focus:outline-none focus:ring-0 ${
                    currentPage === i + 1
                      ? "bg-yellow-400 text-black font-semibold"
                      : "bg-gray-200 text-black hover:bg-yellow-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}