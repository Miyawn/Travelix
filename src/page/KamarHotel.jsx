import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Card, CardContent } from "..//components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, BedDouble } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="bg-cover bg-center h-[300px] text-white flex items-center justify-center" style={{ backgroundImage: `url('/banner.jpg')` }}>
        <h1 className="text-5xl font-bold">Hotel</h1>
      </div>

      <div className="py-10 px-5 md:px-20 flex-1">
        <h2 className="text-2xl font-semibold text-center mb-8">Hotel List</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => (
            <Card key={index} className="shadow-xl">
              <img
                src={hotel.image}
                alt="hotel"
                className="h-48 w-full object-cover rounded-t-2xl"
              />
              <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-bold">{hotel.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <BedDouble size={16} className="mr-2" /> {hotel.beds}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" /> {hotel.location}
                </div>
                <Button
                className="mt-4 px-3 py-1 text-sm hover:brightness-90"
                style={{ backgroundColor: '#EAB308' }}
                onClick={() => alert("Booking diklik")}
                >
                Book Sekarang
                </Button>


              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          <Button variant="ghost">&#60;</Button>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">1</Button>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">2</Button>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">3</Button>
          <Button variant="ghost">&#62;</Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
