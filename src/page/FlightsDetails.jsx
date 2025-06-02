import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/sayappesawat.jpg"; // Pastikan path ini benar

// 1. Menggunakan ikon dari lucide-react sesuai permintaan Anda
import {
  MapPin,
  ArrowRight, // Menggantikan ChevronRight
  PlaneTakeoff, // Menggantikan AirplaneTakeoffIcon kustom
  PlaneLanding, // Menggantikan AirplaneLandingIcon kustom
  Calendar,     // Menggantikan CalendarDays
  Users,        // Menggantikan PhosphorSeat
  Clock,
  Banknote      // Menggantikan CreditCard
} from "lucide-react";
import { useState } from "react";

// Komponen ikon kustom tidak lagi diperlukan karena kita menggunakan dari lucide-react

function Flights() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const flightPageDetails = {
    title: "Pesawat Lmao",
    overview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nislmassa, eget dignissim dolor sagittis vel. Integer laoreet sollicitudin quam et tempus. Vivamus in quam ac tortor ultrices porttitor et ac purus. Aenean tristique, ante iaculis euismod sodales, erat nulla efficitur risus, nec feugiat dolor augue sed massa. Sed et lorem eget dolor dignissim scelerisque at in nulla.",
    terms: ["Abecede", "Efghijkl", "Mnopr"],
  };
  
  const flightBookingSummary = {
    departureCity: "Balikpapan",
    arrivalCity: "Samarinda",
    departureTime: "19:25",
    arrivalTime: "20:25",
    date: "24 Mei 2025",
    availableSeatsInfo: "15 Penumpang", // Sesuaikan teks jika ikonnya Users
    lastCheckIn: "19:20",
    price: "Rp. 1.000.000",
  };

  const seatRows = ["1", "2", "3", "4", "5"];
  const seatCols = ["A", "B", "C"]; 
  const allSeats = seatRows.flatMap((row) => seatCols.map((col) => `${row}${col}`));

  const toggleSeat = (seat) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  const handleBookNow = () => {
    if (selectedSeats.length === 0) {
      alert("Silakan pilih minimal satu kursi.");
      return;
    }
    console.log("Booking untuk kursi:", selectedSeats, "dengan detail:", flightBookingSummary);
    alert(`Booking untuk kursi ${selectedSeats.join(", ")} berhasil (simulasi).`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16">
      <Navbar />

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

      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl lg:max-w-5xl">
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">{flightPageDetails.title}</h1>
            <h2 className="text-xl text-gray-800 font-semibold mb-1">Overview</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {flightPageDetails.overview}
            </p>
            <h2 className="text-xl text-gray-800 font-semibold mb-1">Ketentuan Pemesanan Tiket</h2>
            <ul className="list-disc list-inside text-gray-600 text-sm mb-6 space-y-1">
              {flightPageDetails.terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
            
            <hr className="border-gray-200 my-6" />

            <div className="my-6 bg-white p-6 rounded-xl shadow-xl">
              <h2 className="text-xl text-gray-800 font-semibold mb-4">Pilih Kursi Anda</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-3">
              {allSeats.map((seat) => (
                  <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  title={`Kursi ${seat}`}
                  className={`flex flex-col items-center p-2 rounded-md transition-colors duration-150 aspect-square justify-center ${
                      selectedSeats.includes(seat)
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300"
                  }`}
                  >
                  {/* 2. Menggunakan ikon Users untuk representasi kursi di grid */}
                  {/* Catatan: Ikon 'Users' mungkin bukan representasi visual terbaik untuk kursi individu. */}
                  {/* Pertimbangkan ikon seperti 'Armchair' dari lucide-react jika lebih sesuai. */}
                  <Users size={24} className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 ${selectedSeats.includes(seat) ? "text-white" : "text-gray-500"}`} />
                  <span className="text-xs md:text-sm">{seat}</span>
                  </button>
              ))}
              </div>
              <p className="mt-4 text-sm text-gray-600">Kursi dipilih: {selectedSeats.join(', ') || 'Belum ada'}</p>
            </div>

            <hr className="border-gray-200 my-6" />
          </div>

          <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-200 rounded-b-xl">
            <div className="space-y-3 mb-6">
              {/* Baris 1: Rute */}
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <MapPin className="w-5 h-5" />
                <div className="font-medium">{flightBookingSummary.departureCity}</div>
                <ArrowRight className="w-4 h-4 text-gray-400" /> {/* Menggunakan ArrowRight */}
                <div className="font-medium">{flightBookingSummary.arrivalCity}</div>
              </div>
              {/* Baris 2: Waktu & Tanggal */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
                <div className="flex items-center space-x-2"><PlaneTakeoff size={20} className="transform"/><div>{flightBookingSummary.departureTime}</div></div> {/* Menggunakan PlaneTakeoff */}
                < br/><div className="flex items-center space-x-2"><PlaneLanding size={20} className="transform"/><div>{flightBookingSummary.arrivalTime}</div></div> {/* Menggunakan PlaneLanding */}
                <br /><div className="flex items-center space-x-2"><Calendar className="w-4 h-4 " /><div>{flightBookingSummary.date}</div></div> {/* Menggunakan Calendar */}
              </div>
              {/* Baris 3: Info Kursi & Check-in */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
                {/* 3. Menggunakan ikon Users untuk info ketersediaan kursi/penumpang */}
                <div className="flex items-center space-x-2"><Users size={20} className="text-black" /><div>{flightBookingSummary.availableSeatsInfo}</div></div>
                < br/><div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-black" /><div>Last check-in: {flightBookingSummary.lastCheckIn}</div></div>
              </div>
              {/* Baris 4: Harga */}
              <div className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-black" /> {/* Menggunakan Banknote */}
                <div className="font-regular text-sm text-black">{flightBookingSummary.price}</div>
              </div>
            </div>
            <button
              onClick={handleBookNow}
              disabled={selectedSeats.length === 0}
              className="w-full btn bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Sekarang
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Flights;