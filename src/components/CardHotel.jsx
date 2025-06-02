import { BedDouble, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Impor useNavigate

export default function CardHotel({ image, name, beds, location, onBook }) {
  const navigate = useNavigate(); // 2. Inisialisasi hook useNavigate

  const handleBookClick = () => {
    // 3. Jika ada prop onBook, panggil terlebih dahulu (opsional)
    if (onBook) {
      onBook();
    }
    // 4. Arahkan ke /hoteldetails
    navigate("/hoteldetails");
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col">
      <img
        className="w-full h-[380px] object-cover"
        src={image}
        alt={name}
      />
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="space-y-3">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <BedDouble className="w-4 h-4 mr-2" /> {beds}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" /> {location}
          </div>
        </div>
        <button
          onClick={handleBookClick} // 5. Gunakan handler baru
          className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
        >
          Book Sekarang
        </button>
      </div>
    </div>
  );
}