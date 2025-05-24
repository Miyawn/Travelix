import { useState } from "react";
import { Calendar, MapPin, User } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import bgImage from "../assets/bg1.jpg";

export default function HotelDetails() {
  const [rooms] = useState([
    { name: "Ruangan Terbaik", price: "Rp. 800.000" },
    { name: "Ruangan Terbaik", price: "Rp. 800.000" },
    { name: "Ruangan Terbaik", price: "Rp. 800.000" },
  ]);

  return (
    <div className="pt-16 bg-white text-black min-h-screen">
      <Navbar />
      <div
              className="bg-cover bg-center h-[370px] text-white flex items-center justify-center"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <div className="h-[370px] w-full bg-black/60 backdrop-blur-[3px] z-0">
                <div className="text-center pt-24 z-10 relative">
                  <h1 className="text-7xl font-bold">Hotel</h1>
                  <p className="text-lg mt-2 max-w-2xl mx-auto">
                    Rencanakan perjalanan Anda dengan percaya diri! Travelix berkomitmen untuk memberikan pengalaman pemesanan hotel yang mulus dan bebas stress.
                  </p>
                </div>
              </div>
            </div>

        <div className="w-full max-w-7xl mx-auto mb-10 pt-20">
        <div className="carousel w-full h-[200px] rounded-lg shadow-md overflow-hidden">
            <div id="slide1" className="carousel-item relative w-full h-full">
            <img src="src/assets/kamar1.jpg" className="w-full h-full object-cover" />
            <a href="#slide3" className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2">❮</a>
            <a href="#slide2" className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2">❯</a>
            </div>
            <div id="slide2" className="carousel-item relative w-full h-full">
            <img src="src/assets/kamar1.jpg" className="w-full h-full object-cover" />
            <a href="#slide1" className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2">❮</a>
            <a href="#slide3" className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2">❯</a>
            </div>
            <div id="slide3" className="carousel-item relative w-full h-full">
            <img src="src/assets/kamar1.jpg" className="w-full h-full object-cover" />
            <a href="#slide2" className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2">❮</a>
            <a href="#slide1" className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2">❯</a>
            </div>
        </div>
        </div>


      <div className="container mx-auto px-4 md:px-16 py-10">
        {/* Judul dan Lokasi */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Hotel Gunung Bakaran</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>Jln. Marsma R. Iswahyudi RT 45</span>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue
            nisl massa, eget dignissim dolor sagittis vel. Integer laoreet
            sollicitudin quam et tempus...
          </p>
        </div>

        {/* Ketentuan */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Ketentuan Pemesanan Reservasi Hotel</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Abecede</li>
            <li>Efghijkl</li>
            <li>Mnopr</li>
          </ul>
        </div>

        {/* Filter Tanggal */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 border p-2 rounded shadow-sm">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <span>Mar 18, 2025</span>
            </div>
            <div className="flex items-center gap-2 border p-2 rounded shadow-sm">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <span>Mar 18, 2025</span>
            </div>
            <div className="flex items-center gap-2 border p-2 rounded shadow-sm">
              <User className="w-5 h-5 text-yellow-500" />
              <span>Ruangan Premium</span>
            </div>
          </div>
        </div>

        {/* List Kamar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl shadow-md p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                <p className="text-yellow-600 font-bold text-xl mb-4">{room.price}</p>
              </div>
              <button className="btn bg-yellow-400 hover:bg-yellow-500 text-black mt-4 border-none outline-none ring-0 focus:outline-none focus:ring-0">
                Book Sekarang
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
