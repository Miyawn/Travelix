import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CardPenerbangan from "../components/CardPenerbangan";
import bgImage from "../assets/sayappesawat.jpg";

// Import fungsi Firebase
import { db } from "../firebaseConfig"; // Pastikan path ini benar
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Flights() {
  const navigate = useNavigate();
  
  // State untuk menampung data dari Firestore dan status loading
  const [allPenerbangan, setAllPenerbangan] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk pagination, tidak berubah
  const cardsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // Mengambil semua data penerbangan dari Firestore saat komponen dimuat
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        // Membuat query untuk mengambil data dari koleksi 'flights'
        // dan mengurutkannya berdasarkan waktu keberangkatan
        const q = query(collection(db, "flights"), orderBy("departureTime", "asc"));
        const querySnapshot = await getDocs(q);

        const flightsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Kalkulasi sisa kursi (contoh: total kursi adalah 45)
          const totalSeats = 45; // Asumsi total kursi, bisa juga disimpan di dokumen
          const bookedCount = data.bookedSeats?.length || 0;
          const sisaKursi = totalSeats - bookedCount;

          return {
            id: doc.id, // Menyimpan ID dokumen, sangat penting untuk navigasi
            ...data,
            // Mengubah format data agar sesuai dengan yang dibutuhkan CardPenerbangan
            asal: data.departureCity,
            tujuan: data.arrivalCity,
            tanggal: data.departureTime.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
            berangkat: data.departureTime.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            tiba: data.arrivalTime.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            harga: `Rp ${data.price.toLocaleString('id-ID')}`,
            sisaKursi: `${sisaKursi} kursi`,
          };
        });

        setAllPenerbangan(flightsData);
      } catch (error) {
        console.error("Error fetching flights: ", error);
        alert("Gagal memuat data penerbangan.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  // Logika pagination sekarang menggunakan state allPenerbangan
  const totalPages = Math.ceil(allPenerbangan.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentPenerbangan = allPenerbangan.slice(startIndex, startIndex + cardsPerPage);

  // Tampilan loading
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data penerbangan...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar />

      {/* Hero Section */}
      <div
        className="bg-cover bg-center h-[370px] text-white flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="h-[370px] w-full bg-black/60 backdrop-blur-[3px] z-0">
          <div className="text-center pt-28 z-10 relative">
            <h1 className="text-7xl font-bold">Penerbangan</h1>
            <p className="text-lg mt-2 max-w-2xl mx-auto">
              Temukan dan pesan tiket pesawat favoritmu hanya di Travelix!
            </p>
          </div>
        </div>
      </div>

      {/* Daftar Penerbangan */}
      <div className="py-10 px-5 md:px-32 flex-1">
        <h2 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center text-black">
          Daftar Penerbangan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-16 text-black">
          {currentPenerbangan.length > 0 ? (
            currentPenerbangan.map((item) => (
              <CardPenerbangan key={item.id} {...item} />
            ))
          ) : (
            <p className="col-span-3 text-center">Tidak ada penerbangan yang tersedia saat ini.</p>
          )}
        </div>

        {/* Pagination */}
        {allPenerbangan.length > cardsPerPage && (
          <div className="flex justify-center mt-8">
            <div className="join">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
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

export default Flights;