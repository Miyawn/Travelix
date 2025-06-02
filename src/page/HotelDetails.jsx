import { useState, useEffect } from "react";
import { Calendar, MapPin, User, Search, Activity as LoadingIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import bgImage from "../assets/bg1.jpg";

import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";

// Ganti dengan ID hotel yang sebenarnya dari Firestore Anda
const HOTEL_ID = "ID_HOTEL_ANDA_DI_FIRESTORE"; // CONTOH: "hotelGunungBakaran"

// Fungsi helper untuk format tanggal ke YYYY-MM-DD
const formatDateToYYYYMMDD = (date) => {
  return date.toISOString().split('T')[0];
};

export default function HotelDetails() {
  const [hotelData, setHotelData] = useState({ name: "Nama Hotel", location: "Lokasi Hotel" });

  // Inisialisasi state tanggal
  const [checkInDate, setCheckInDate] = useState(() => {
    return formatDateToYYYYMMDD(new Date());
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateToYYYYMMDD(tomorrow);
  });

  const [roomType, setRoomType] = useState("semua");
  const [displayedRooms, setDisplayedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Carousel state
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselImages = [
    { src: "/src/assets/kamar1.jpg", alt: "Kamar Hotel 1" },
    { src: "/src/assets/kamar1.jpg", alt: "Kamar Hotel 2" },
    { src: "/src/assets/kamar1.jpg", alt: "Kamar Hotel 3" },
  ];
  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  const nextSlide = () => setActiveSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));

  // Fungsi untuk mengambil/memfilter kamar
  const fetchAvailableRooms = async (ciDate, coDate, rType) => {
    const effectiveCheckIn = ciDate || checkInDate;
    const effectiveCheckOut = coDate || checkOutDate;
    const effectiveRoomType = rType || roomType;

    if (!effectiveCheckIn || !effectiveCheckOut) {
      if (!ciDate && !coDate) {
        alert("Silakan pilih tanggal check-in dan check-out.");
      }
      return;
    }
    if (new Date(effectiveCheckIn) >= new Date(effectiveCheckOut)) {
      if (!ciDate && !coDate) {
        alert("Tanggal check-out harus setelah tanggal check-in.");
      }
      return;
    }
    if (!HOTEL_ID) {
      alert("ID Hotel tidak valid. Silakan periksa konfigurasi.");
      return;
    }

    setIsLoading(true);
    setSearchAttempted(true);
    setDisplayedRooms([]);

    try {
      let roomsQuery = query(collection(db, "hotels", HOTEL_ID, "rooms"));
      if (effectiveRoomType !== "semua") {
        roomsQuery = query(roomsQuery, where("type", "==", effectiveRoomType));
      }

      const roomSnapshots = await getDocs(roomsQuery);
      const candidateRooms = [];
      roomSnapshots.forEach(doc => {
        candidateRooms.push({ id: doc.id, ...doc.data() });
      });

      const availableRoomsList = [];
      const requestedCheckInTS = Timestamp.fromDate(new Date(effectiveCheckIn));
      const requestedCheckOutTS = Timestamp.fromDate(new Date(effectiveCheckOut));

      for (const room of candidateRooms) {
        const bookingsQuery = query(
          collection(db, "hotels", HOTEL_ID, "rooms", room.id, "bookings"),
          where("checkIn", "<", requestedCheckOutTS)
          // Anda mungkin perlu indeks komposit untuk (checkIn asc, checkOut asc)
          // where("checkOut", ">", requestedCheckInTS) // Jika ada indeks, aktifkan ini
        );

        const bookingSnapshots = await getDocs(bookingsQuery);
        let isRoomAvailable = true;

        if (!bookingSnapshots.empty) {
          let hasOverlappingBooking = false;
          bookingSnapshots.forEach(bookingDoc => {
            const booking = bookingDoc.data();
            // Filter manual untuk kondisi kedua jika where("checkOut", ">", requestedCheckInTS) tidak digunakan
            if (booking.checkOut.toDate() > requestedCheckInTS.toDate()) {
              hasOverlappingBooking = true;
            }
          });
          if (hasOverlappingBooking) {
            isRoomAvailable = false;
          }
        }

        if (isRoomAvailable) {
          availableRoomsList.push(room);
        }
      }
      setDisplayedRooms(availableRoomsList);
    } catch (error) {
      console.error("Error mengambil ketersediaan kamar:", error);
      alert("Terjadi kesalahan saat mencari kamar. Silakan coba lagi.");
      setDisplayedRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect untuk memuat kamar tersedia saat komponen pertama kali dimuat
  useEffect(() => {
    fetchAvailableRooms(checkInDate, checkOutDate, roomType);
  }, []); // Dependency array kosong agar hanya berjalan sekali saat mount

  const handleBookRoom = (roomId) => {
    console.log(`Booking kamar dengan ID: ${roomId}, tanggal: ${checkInDate} - ${checkOutDate}`);
    if (!checkInDate || !checkOutDate) {
      alert("Pilih tanggal check-in dan check-out terlebih dahulu pada filter.");
      return;
    }
    alert(`Anda memilih untuk memesan kamar ID: ${roomId} dari ${checkInDate} sampai ${checkOutDate}.\nLanjutkan ke halaman pembayaran (simulasi).`);
  };

  const hotelName = "Hotel Gunung Bakaran";
  const hotelLocation = "Jln. Marsma R. Iswahyudi RT 45";

  return (
    <div className="pt-16 bg-gray-50 text-black min-h-screen">
      <Navbar />
      {/* Header Section */}
      <div
        className="bg-cover bg-center h-[370px] text-white flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="h-[370px] w-full bg-black/60 backdrop-blur-[3px] z-0">
          <div className="text-center pt-24 z-10 relative">
            <h1 className="text-7xl font-bold">Hotel</h1>
            <p className="text-lg mt-2 max-w-2xl mx-auto">
              Temukan ketenangan dan kemewahan di Hotel Gunung Bakaran, tempat di mana setiap momen menjadi istimewa.
            </p>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full max-w-7xl mx-auto mb-10 pt-20">
        <div className="carousel w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-lg shadow-md overflow-hidden relative">
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className={`carousel-item absolute w-full h-full transition-opacity duration-500 ${activeSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              style={{ pointerEvents: activeSlide === idx ? "auto" : "none" }}
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
          <button
            onClick={prevSlide}
            className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2 z-20"
            aria-label="Sebelumnya"
            type="button"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2 z-20"
            aria-label="Selanjutnya"
            type="button"
          >
            ❯
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 md:px-16 py-10">
        {/* Hotel Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{hotelName}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>{hotelLocation}</span>
          </div>
        </div>

        {/* Overview & Ketentuan */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700">Nikmati kenyamanan dan keindahan alam di Hotel Gunung Bakaran – destinasi sempurna untuk liburan dan perjalanan bisnis Anda.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Ketentuan Pemesanan</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Abecede</li>
            <li>Efghijkl</li>
            <li>Mnopr</li>
          </ul>
        </div>

        {/* Filter Section */}
        <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cari Ketersediaan Kamar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            {/* Check-in */}
            <div className="flex flex-col">
              <label htmlFor="checkin" className="text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-yellow-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="date" id="checkin" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 bg-gray-300"/>
              </div>
            </div>
            {/* Check-out */}
            <div className="flex flex-col">
              <label htmlFor="checkout" className="text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-yellow-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="date" id="checkout" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 bg-gray-300"/>
              </div>
            </div>
            {/* Room Type */}
            <div className="flex flex-col">
              <label htmlFor="roomtype" className="text-sm font-medium text-gray-700 mb-1">Tipe Ruangan</label>
              <div className="relative">
                <User className="w-5 h-5 text-yellow-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select id="roomtype" value={roomType} onChange={(e) => setRoomType(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 appearance-none bg-gray-300">
                  <option value="semua">Semua Tipe</option>
                  <option value="biasa">Biasa</option>
                  <option value="premium">Premium</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            {/* Search Button */}
            <button onClick={() => fetchAvailableRooms()} disabled={isLoading}
              className="btn bg-yellow-500 hover:bg-yellow-600 text-black border-none py-2 px-4 rounded-md flex items-center justify-center md:mt-7 lg:col-span-1 disabled:opacity-70">
              {isLoading ? <LoadingIcon className="animate-spin h-5 w-5 mr-2" /> : <Search className="w-5 h-5 mr-2" />}
              {isLoading ? "Mencari..." : "Cari"}
            </button>
          </div>
        </div>

        {/* Room List Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 mt-10 text-gray-800">Kamar yang Tersedia</h2>
          {isLoading ? (
            <div className="text-center py-10">
              <LoadingIcon className="animate-spin h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg text-gray-600">Memuat kamar...</p>
            </div>
          ) : searchAttempted && displayedRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedRooms.map((room) => (
                <div key={room.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 flex flex-col justify-between transition-all hover:shadow-xl">
                  <div>
                    <img src={room.imageUrl || "/src/assets/default-room.jpg"} alt={room.name} className="w-full h-48 object-cover rounded-md mb-4"/>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{room.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-3 inline-block ${room.type === 'premium' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                      {room.type === 'premium' ? 'Premium' : (room.type === 'biasa' ? 'Biasa' : room.type)}
                    </span>
                    <p className="text-yellow-600 font-bold text-2xl mb-4">{room.price} <span className="text-sm font-normal text-gray-500">/ malam</span></p>
                  </div>
                  <button onClick={() => handleBookRoom(room.id)}
                    className="btn bg-yellow-400 hover:bg-yellow-500 text-black w-full mt-4 border-none outline-none ring-0 focus:outline-none focus:ring-0">
                    Book Sekarang
                  </button>
                </div>
              ))}
            </div>
          ) : searchAttempted && displayedRooms.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow p-6">
              <p className="text-lg text-gray-600">Tidak ada kamar yang tersedia untuk kriteria Anda.</p>
              <p className="text-sm text-gray-500 mt-1">Silakan coba ubah tanggal atau tipe kamar.</p>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow p-6">
              <p className="text-lg text-gray-600">Silakan gunakan filter di atas untuk mencari kamar.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}