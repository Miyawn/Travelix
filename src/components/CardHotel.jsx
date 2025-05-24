import { BedDouble, MapPin } from "lucide-react";

export default function CardHotel({ image, name, beds, location, onBook }) {
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
          onClick={onBook}
          className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
        >
          Book Sekarang
        </button>
      </div>
    </div>
  );
}
