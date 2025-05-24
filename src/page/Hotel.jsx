import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg1.jpg";
import kamar1 from "../assets/kamar1.jpg";
import CardHotel from "../components/CardHotel";

const hotels = [
  {
    name: "Hotel Gunung Bakaran",
    beds: "2 Ranjang",
    location: "Gunung Bakaran",
    image: kamar1,
  },
  {
    name: "Hotel Gunung Bakaran",
    beds: "2 Ranjang",
    location: "Gunung Bakaran",
    image: kamar1,
  },
  {
    name: "Hotel Gunung Bakaran",
    beds: "2 Ranjang",
    location: "Gunung Bakaran",
    image: kamar1,
  },
  {
    name: "Hotel Pegunungan Selatan",
    beds: "1 Ranjang",
    location: "Bukit Indah",
    image: kamar1,
  },
  {
    name: "Hotel Tropis",
    beds: "3 Ranjang",
    location: "Pantai Timur",
    image: kamar1,
  },
];

export default function KamarHotel() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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

        <div className="grid grid-cols-1 md:grid-cols-3 mx-16 gap-10 text-black">
          {paginatedHotels.map((hotel, index) => (
            <CardHotel
              key={index}
              image={hotel.image}
              name={hotel.name}
              beds={hotel.beds}
              location={hotel.location}
              onBook={() => alert("Booking diklik")}
            />
          ))}
        </div>

        {/* Pagination */}
        {hotels.length > itemsPerPage && (
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
