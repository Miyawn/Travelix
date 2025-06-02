// src/pages/HotelReceipts.jsx (atau path yang sesuai)
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import BookingConfirmationCard from "../components/BookingConfirmationCard"; // 1. Impor komponen baru

function HotelReceipts() {
  const navigate = useNavigate();

  // Data ini idealnya diambil dari state, context, atau parameter URL setelah booking sukses
  // Untuk contoh ini, kita akan gunakan data yang sama seperti di BookingConfirmationCard
  // Anda bisa menghapus ini jika data sudah diteruskan sebagai prop ke BookingConfirmationCard nantinya
  const bookingDataFromParent = {
    orderId: "081649036295",
    hotelName: "Hotel Gunung Bakaran",
    roomName: "Deluxe Room",
    roomType: "Premium",
    startDate: "2 Juni 2025",
    endDate: "4 Juni 2025",
    description: "Kamar dengan pemandangan kota, termasuk sarapan.",
    price: "Rp. 1.600.000",
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16"> {/* Ganti bg-white agar kontras dengan card */}
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8"> {/* Tambahkan padding dan flex-col */}
        
        {/* 2. Gunakan komponen BookingConfirmationCard di sini */}
        {/* Anda bisa meneruskan data booking sebagai props jika BookingConfirmationCard diubah untuk menerimanya */}
        <BookingConfirmationCard /> 
        {/* Contoh jika BookingConfirmationCard menerima props: */}
        {/* <BookingConfirmationCard details={bookingDataFromParent} /> */}
      </main>
      <Footer />
    </div>
  );
}

export default HotelReceipts;