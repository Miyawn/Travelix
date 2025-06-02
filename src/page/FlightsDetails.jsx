import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import bgImage from "../assets/sayappesawat.jpg";

// Import ikon dari lucide-react
import { MapPin, ArrowRight, PlaneTakeoff, PlaneLanding, Calendar, Users, Clock, Banknote, Armchair } from "lucide-react";

// Import fungsi Firebase
import { db, auth } from '../firebaseConfig'; // Pastikan path ini benar
import { doc, getDoc, runTransaction, arrayUnion, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Flights() {
  const navigate = useNavigate();
  const flightId = "BPN-SMD-20250524"; // ID dokumen yang akan kita ambil (bisa dibuat dinamis)

  // State untuk data dari Firebase
  const [flightData, setFlightData] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // State untuk interaksi pengguna
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Mengambil data penerbangan dari Firestore saat komponen dimuat
  useEffect(() => {
    const fetchFlightData = async () => {
      setLoading(true);
      const flightDocRef = doc(db, "flights", flightId);
      try {
        const docSnap = await getDoc(flightDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Format timestamp ke string yang mudah dibaca
          data.departureTimeStr = data.departureTime.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          data.arrivalTimeStr = data.arrivalTime.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          data.dateStr = data.departureTime.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
          
          setFlightData(data);
          setBookedSeats(data.bookedSeats || []);
        } else {
          toast.error("Detail penerbangan tidak ditemukan.");
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching flight data:", error);
        toast.error("Gagal memuat data penerbangan.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlightData();
  }, [flightId, navigate]);

  // Memeriksa status login pengguna
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // Cleanup listener saat komponen unmount
  }, []);


  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // Jangan biarkan memilih kursi yang sudah dipesan

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBookNow = async () => {
    if (!currentUser) {
      toast.error("Anda harus login untuk melakukan pemesanan.");
      navigate('/login');
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Silakan pilih minimal satu kursi.");
      return;
    }

    const flightDocRef = doc(db, "flights", flightId);
    
    try {
      // Gunakan transaksi untuk memastikan tidak ada double booking
      await runTransaction(db, async (transaction) => {
        const flightDoc = await transaction.get(flightDocRef);
        if (!flightDoc.exists()) {
          throw new Error("Penerbangan tidak ditemukan!");
        }

        const currentBookedSeats = flightDoc.data().bookedSeats || [];
        const isAlreadyBooked = selectedSeats.some(seat => currentBookedSeats.includes(seat));
        
        if (isAlreadyBooked) {
          throw new Error("Maaf, salah satu kursi yang Anda pilih baru saja dipesan orang lain. Silakan pilih kursi lain.");
        }

        // Update dokumen penerbangan dengan kursi baru yang dipesan
        transaction.update(flightDocRef, {
          bookedSeats: arrayUnion(...selectedSeats)
        });

        // Buat dokumen pemesanan baru di koleksi 'bookings'
        const bookingsCollectionRef = collection(db, "bookings");
        await addDoc(bookingsCollectionRef, {
          flightId: flightId,
          userId: currentUser.uid,
          seats: selectedSeats,
          totalPrice: flightData.price * selectedSeats.length,
          bookingDate: serverTimestamp(),
          status: "confirmed"
        });
      });
      
      toast.success(`Pemesanan untuk kursi ${selectedSeats.join(", ")} berhasil!`);
      navigate('/profiluser'); // Arahkan ke halaman profil/tiket saya
      
    } catch (error) {
      console.error("Error during booking transaction:", error);
      toast.error(error.message || "Terjadi kesalahan saat pemesanan.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!flightData) {
    return <div className="min-h-screen flex items-center justify-center">Data penerbangan tidak tersedia.</div>;
  }

  const seatRows = ["1", "2", "3", "4", "5"];
  const seatCols = ["A", "B", "C"]; 
  const allSeats = seatRows.flatMap((row) => seatCols.map((col) => `${row}${col}`));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16">
      <Navbar />
      {/* ... (bagian header dengan background tetap sama) ... */}

      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl lg:max-w-5xl">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">{flightData.title}</h1>
            <h2 className="text-xl text-gray-800 font-semibold mb-1">Overview</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{flightData.overview}</p>
            <h2 className="text-xl text-gray-800 font-semibold mb-1">Ketentuan</h2>
            <ul className="list-disc list-inside text-gray-600 text-sm mb-6 space-y-1">
              {flightData.terms.map((term, index) => <li key={index}>{term}</li>)}
            </ul>
            
            <hr className="border-gray-200 my-6" />

            <div className="my-6">
              <h2 className="text-xl text-gray-800 font-semibold mb-4">Pilih Kursi Anda</h2>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3">
                {allSeats.map((seat) => {
                  const isBooked = bookedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);
                  return (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      title={isBooked ? `Kursi ${seat} (Dipesan)` : `Kursi ${seat}`}
                      disabled={isBooked}
                      className={`flex flex-col items-center p-2 rounded-md transition-colors duration-150 aspect-square justify-center ${
                        isSelected ? "bg-yellow-500 text-white" :
                        isBooked ? "bg-red-400 text-white cursor-not-allowed" :
                        "bg-gray-200 text-gray-700 hover:bg-yellow-300"
                      }`}
                    >
                      <Armchair size={24} className="w-5 h-5 md:w-6 md:h-6 mb-0.5" />
                      <span className="text-xs md:text-sm">{seat}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-gray-600">Kursi dipilih: {selectedSeats.join(', ') || 'Belum ada'}</p>
            </div>

            <hr className="border-gray-200 my-6" />
          </div>

          <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-200 rounded-b-xl">
            <div className="space-y-3 mb-6">
              {/* Rute, Waktu, Harga sekarang menggunakan data dari flightData */}
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <MapPin className="w-5 h-5" />
                <div className="font-medium">{flightData.departureCity}</div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="font-medium">{flightData.arrivalCity}</div>
              </div>
              {/* ... (info lainnya disesuaikan dengan field dari flightData) ... */}
               <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Banknote className="w-5 h-5 text-black" />
                <div className="font-regular text-sm text-black">Rp. {flightData.price.toLocaleString('id-ID')}</div>
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