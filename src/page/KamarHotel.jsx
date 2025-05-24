import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { MapPin, BedDouble } from "lucide-react";
import bgImage from "../assets/bg1.jpg";

const hotels = [
  {
    name: "Hotel Gunung Bakaran",
    beds: "2 Ranjang",
    location: "Gunung Bakaran",
    image: "../src/assets/kamar1.jpg",
  },
  {
    name: "Hotel Gunung Bakaran",
    beds: "2 Ranjang",
    location: "Gunung Bakaran",
    image: "../src/assets/kamar1.jpg",
  },
  {
    name: "Hotel Gunung Bakaran",
    beds: "2 Ranjang",
    location: "Gunung Bakaran",
    image: "../src/assets/kamar1.jpg",
  },
];

export default function KamarHotel() {
  const navigate = useNavigate();

  // Card component langsung di file
  function Card({ children, className = "" }) {
    return (
      <div className={`bg-white rounded-2xl overflow-hidden shadow-xl ${className}`}>
        {children}
      </div>
    );
  }

  // CardContent component langsung di file
  function CardContent({ children, className = "" }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
  }

  // Button component menggunakan Tailwind
  function SimpleButton({ children, onClick, className = "", type = "button" }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar />

      {/* Hero Section */}
      <div
        className="bg-cover bg-center h-[370px] text-white flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="text-center">
          <h1 className="text-7xl font-bold">Hotel</h1>
          <p className="text-lg mt-2 max-w-2xl mx-auto">Lorem ipsum dolor sit amet</p>
        </div>
      </div>

      {/* Content */}
      <div className="py-10 px-5 md:px-32 flex-1">
        <h2 className="text-2xl font-semibold text-center mb-8 text-black">Hotel List</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 mx-16 gap-10 text-black">
          {hotels.map((hotel, index) => (
            <Card key={index}>
              <img
                src={hotel.image}
                alt="hotel"
                className="h-[510px] w-full object-cover rounded-t-2xl"
              />
              <CardContent className="space-y-2">
                <h3 className="text-lg font-bold">{hotel.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <BedDouble size={16} className="mr-2" /> {hotel.beds}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" /> {hotel.location}
                </div>
                <SimpleButton
                  className="mt-4 text-sm"
                  onClick={() => alert("Booking diklik")}
                >
                  Book Sekarang
                </SimpleButton>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <SimpleButton className="bg-transparent text-yellow-500 hover:bg-yellow-100">
            <span className="text-xl">&#60;</span>
          </SimpleButton>
          <SimpleButton>1</SimpleButton>
          <SimpleButton>2</SimpleButton>
          <SimpleButton>3</SimpleButton>
          <SimpleButton className="bg-transparent text-yellow-500 hover:bg-yellow-100">
            <span className="text-xl">&#62;</span>
          </SimpleButton>
        </div>
      </div>

      <Footer />
    </div>
  );
}
