import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/sayappesawat.jpg";
import CardPenerbangan from "../components/CardPenerbangan";
import { useState } from "react";

const allPenerbangan = [
  {
    title: "Garuda Indonesia",
    asal: "Jakarta",
    tujuan: "Bali",
    tanggal: "24 Mei 2025",
    berangkat: "08:00",
    tiba: "10:00",
    lastCheckin: "07:30",
    sisaKursi: "10 kursi",
    harga: "Rp 1.200.000",
  },
  {
    title: "Lion Air",
    asal: "Surabaya",
    tujuan: "Lombok",
    tanggal: "25 Mei 2025",
    berangkat: "09:30",
    tiba: "11:00",
    lastCheckin: "09:00",
    sisaKursi: "5 kursi",
    harga: "Rp 850.000",
  },
  {
    title: "Citilink",
    asal: "Yogyakarta",
    tujuan: "Medan",
    tanggal: "26 Mei 2025",
    berangkat: "13:00",
    tiba: "15:30",
    lastCheckin: "12:30",
    sisaKursi: "7 kursi",
    harga: "Rp 1.050.000",
  },
  {
    title: "Batik Air",
    asal: "Makassar",
    tujuan: "Papua",
    tanggal: "27 Mei 2025",
    berangkat: "07:00",
    tiba: "10:00",
    lastCheckin: "06:30",
    sisaKursi: "12 kursi",
    harga: "Rp 1.500.000",
  },
  {
    title: "Sriwijaya Air",
    asal: "Balikpapan",
    tujuan: "Pontianak",
    tanggal: "28 Mei 2025",
    berangkat: "10:00",
    tiba: "11:30",
    lastCheckin: "09:30",
    sisaKursi: "8 kursi",
    harga: "Rp 900.000",
  },
];

function Flights() {
  const navigate = useNavigate();
  const cardsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allPenerbangan.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentPenerbangan = allPenerbangan.slice(startIndex, startIndex + cardsPerPage);

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
          {currentPenerbangan.map((item, index) => (
            <CardPenerbangan key={index} {...item} />
          ))}
        </div>

        {/* Pagination muncul hanya jika data > 3 */}
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
