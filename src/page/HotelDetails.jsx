import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, User, Search, Activity as LoadingIcon } from "lucide-react";
import { toast } from 'react-hot-toast';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Import fungsi Firebase
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// --- KONFIGURASI ---
const HOTEL_ID = "hotelGunungBakaran"; // Ganti dengan ID hotel yang ada di Firestore Anda

// Fungsi helper untuk format tanggal ke YYYY-MM-DD
const formatDateToYYYYMMDD = (date) => date.toISOString().split('T')[0];

export default function HotelDetails() {
  const navigate = useNavigate();

  // State untuk data dari Firebase
  const [hotelData, setHotelData] = useState(null);
  const [displayedRooms, setDisplayedRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // State untuk interaksi UI
  const [checkInDate, setCheckInDate] = useState(formatDateToYYYYMMDD(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateToYYYYMMDD(tomorrow);
  });
  const [roomType, setRoomType] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // -- Mengambil Data Hotel dan Kamar Awal --
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      // 1. Ambil data detail hotel
      try {
        const hotelDocRef = doc(db, "hotels", HOTEL_ID);
        const hotelDocSnap = await getDoc(hotelDocRef);
        if (hotelDocSnap.exists()) {
          setHotelData(hotelDocSnap.data());
        } else {
          toast.error("Data hotel tidak ditemukan!");
        }
      } catch (error) {
        toast.error("Gagal memuat data hotel.");
        console.error("Error fetching hotel data:", error);
      }
      
      // 2. Lakukan pencarian kamar awal
      await fetchAvailableRooms(checkInDate, checkOutDate, roomType, true);
      setIsLoading(false);
    };

    fetchInitialData();
  }, []); // Hanya berjalan sekali saat komponen dimuat

  // -- Memeriksa Status Login Pengguna --
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  // -- FUNGSI UTAMA: MENCARI KAMAR TERSEDIA --
  const fetchAvailableRooms = async (ciDate, coDate, rType, isInitialLoad = false) => {
    // Validasi input
    if (new Date(ciDate) >= new Date(coDate)) {
      if (!isInitialLoad) toast.error("Tanggal check-out harus setelah tanggal check-in.");
      return;
    }

    setIsLoading(true);
    setSearchAttempted(true);

    try {
      // 1. Dapatkan daftar ID kamar yang sudah dibooking pada rentang tanggal yang dipilih
      const requestedCheckInTS = Timestamp.fromDate(new Date(ciDate));
      const requestedCheckOutTS = Timestamp.fromDate(new Date(coDate));

      const bookingsQuery = query(
        collection(db, `hotels/${HOTEL_ID}/bookings`), // Asumsi ada sub-koleksi bookings di level hotel
        where("checkIn", "<", requestedCheckOutTS),
        where("checkOut", ">", requestedCheckInTS)
      );
      
      const overlappingBookingsSnap = await getDocs(bookingsQuery);
      const unavailableRoomIds = overlappingBookingsSnap.docs.map(doc => doc.data().roomId);
      
      // 2. Dapatkan semua kamar sesuai tipe yang dipilih
      let roomsQuery = query(collection(db, `hotels/${HOTEL_ID}/rooms`));
      if (rType !== "semua") {
        roomsQuery = query(roomsQuery, where("type", "==", rType));
      }
      const allRoomsSnap = await getDocs(roomsQuery);
      
      // 3. Filter kamar yang tersedia
      const availableRoomsList = [];
      allRoomsSnap.forEach(doc => {
        if (!unavailableRoomIds.includes(doc.id)) {
          availableRoomsList.push({ id: doc.id, ...doc.data() });
        }
      });
      
      setDisplayedRooms(availableRoomsList);

    } catch (error) {
      console.error("Error mencari ketersediaan kamar:", error);
      toast.error("Terjadi kesalahan. Mungkin Anda perlu membuat Indeks di Firestore. Cek konsol (F12) untuk link.");
    } finally {
      setIsLoading(false);
    }
  };


  // -- FUNGSI UTAMA: MEMESAN KAMAR --
  const handleBookRoom = async (room) => {
    if (!currentUser) {
      toast.error("Anda harus login untuk memesan kamar.");
      navigate("/login");
      return;
    }
    
    if (window.confirm(`Anda akan memesan kamar: ${room.name}\nDari: ${checkInDate}\nSampai: ${checkOutDate}\nLanjutkan?`)) {
        try {
            // Kita bisa menambahkan booking ke sub-koleksi di level hotel
            // untuk mempermudah query ketersediaan
            const bookingsRef = collection(db, `hotels/${HOTEL_ID}/bookings`);
            await addDoc(bookingsRef, {
                hotelId: HOTEL_ID,
                roomId: room.id,
                userId: currentUser.uid,
                checkIn: Timestamp.fromDate(new Date(checkInDate)),
                checkOut: Timestamp.fromDate(new Date(checkOutDate)),
                totalPrice: room.price,
                bookingDate: serverTimestamp(),
                status: "confirmed"
            });

            toast.success("Kamar berhasil dipesan!");
            // Refresh daftar kamar tersedia
            fetchAvailableRooms(checkInDate, checkOutDate, roomType);

        } catch (error) {
            console.error("Error saat memesan kamar:", error);
            toast.error("Gagal memesan kamar. Silakan coba lagi.");
        }
    }
  };

  if (!hotelData) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data hotel...</div>;
  }
  
  // Carousel logic
  const carouselImages = hotelData.carouselImages || [];
  const prevSlide = () => setActiveSlide((p) => (p === 0 ? carouselImages.length - 1 : p - 1));
  const nextSlide = () => setActiveSlide((p) => (p === carouselImages.length - 1 ? 0 : p + 1));

  return (
    <div className="pt-16 bg-gray-50 text-black min-h-screen">
      <Navbar />
      {/* ... (bagian header dan carousel menggunakan data dari hotelData) ... */}
       {/* Filter Section */}
       <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cari Ketersediaan Kamar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {/* Check-in */}
          <div className="flex flex-col">
            <label htmlFor="checkin" className="text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input type="date" id="checkin" value={checkInDate} min={formatDateToYYYYMMDD(new Date())} onChange={(e) => setCheckInDate(e.target.value)} className="input input-bordered w-full"/>
          </div>
          {/* Check-out */}
          <div className="flex flex-col">
            <label htmlFor="checkout" className="text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input type="date" id="checkout" value={checkOutDate} min={checkInDate} onChange={(e) => setCheckOutDate(e.target.value)} className="input input-bordered w-full"/>
          </div>
          {/* Room Type */}
          <div className="flex flex-col">
            <label htmlFor="roomtype" className="text-sm font-medium text-gray-700 mb-1">Tipe Ruangan</label>
            <select id="roomtype" value={roomType} onChange={(e) => setRoomType(e.target.value)} className="select select-bordered w-full">
              <option value="semua">Semua Tipe</option>
              <option value="biasa">Biasa</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          {/* Search Button */}
          <button onClick={() => fetchAvailableRooms(checkInDae, checkOutDate, roomType)} disabled={isLoading}
            className="btn bg-yellow-500 hover:bg-yellow-600 text-black w-full">
            {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : <Search className="w-5 h-5" />}
            {isLoading ? "Mencari..." : "Cari Ketersediaan"}
          </button>
        </div>
      </div>
      
      {/* Room List Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 mt-10 text-gray-800">Kamar yang Tersedia</h2>
        {/* ... (logika tampilan loading dan hasil pencarian) ... */}
        {isLoading ? (
            <div className="text-center py-10">...</div>
        ) : searchAttempted && displayedRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedRooms.map((room) => (
                    <div key={room.id} className="bg-white ...">
                        {/* ... (detail kamar) ... */}
                        <button onClick={() => handleBookRoom(room)} className="btn ...">
                            Book Sekarang
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            // ... (pesan jika tidak ada kamar atau belum mencari) ...
            <p>Silakan gunakan filter di atas untuk mencari kamar.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}