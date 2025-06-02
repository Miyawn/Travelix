import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/sayappesawat.jpg";
import { Seat } from "@phosphor-icons/react";
import { useState } from "react";

function Flights() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Buat semua kursi 1A–5C
  const seatRows = ["1", "2", "3", "4", "5"];
  const seatCols = ["A", "B", "C"];
  const seats = seatRows.flatMap((row) => seatCols.map((col) => `${row}${col}`));

  // Toggle seat selection
  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      // Jika sudah dipilih, hapus dari array
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      // Jika belum dipilih, tambahkan ke array
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar />

      {/* Gambar latar + overlay */}
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

      {/* Konten utama */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-left p-8 w-full max-w-[1064px]">
          <h1 className="text-3xl font-bold mb-4 text-black">Pesawat Garuda</h1>
          <h2 className="text-xl text-[#171717] mb-1">Overview</h2>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nisl massa, eget
            dignissim dolor sagittis vel. Integer laoreet sollicitudin quam et tempus.
          </p>

          <h2 className="text-xl text-[#171717] mb-1">Ketentuan Pemesanan</h2>
          <p className="text-gray-600 mb-6">
            Vivamus in quam ac tortor ultrices porttitor et ac purus. Aenean tristique, ante iaculis
            euismod sodales, erat nulla efficitur risus, nec feugiat dolor augue sed massa.
          </p>

          <hr className="border-gray-300 border-t-2 w-full mb-6" />

          {/* Pilihan kursi grid */}
          <div className="grid grid-cols-12 gap-4 mb-6">
            {seats.map((seat) => (
              <button
                key={seat}
                onClick={() => toggleSeat(seat)}
                className={`flex flex-col items-center px-4 py-2 rounded transition ${
                  selectedSeats.includes(seat)
                    ? "bg-yellow-500 text-white"
                    : "bg-[#E5E5E5] text-black hover:bg-yellow-300"
                }`}
              >
                <Seat size={24} />
                <span className="text-sm mt-1">{seat}</span>
              </button>
            ))}
          </div>

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