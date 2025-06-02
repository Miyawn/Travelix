// src/components/BookingConfirmationCard.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react'; // Menggunakan ikon dari lucide-react

// Data contoh untuk ditampilkan, idealnya ini dari props atau state
// Saya akan menggunakan defaultBookingDetails jika props `details` tidak diberikan
const defaultBookingDetails = {
  orderId: "081649036295",
  hotelName: "Hotel Gunung Bakaran",
  roomName: "Deluxe Room",
  roomType: "Premium",
  startDate: "2 Juni 2025",
  endDate: "4 Juni 2025",
  description: "Kamar dengan pemandangan kota, termasuk sarapan.",
  price: "Rp. 1.600.000",
};

export default function BookingConfirmationCard({ details }) {
  const bookingDetails = details || defaultBookingDetails;

  const detailsToDisplay = [
    { label: "ID Pesanan:", value: bookingDetails.orderId },
    { label: "Nama Hotel:", value: bookingDetails.hotelName },
    { label: "Kamar:", value: bookingDetails.roomName },
    { label: "Tipe:", value: bookingDetails.roomType },
    { label: "Tanggal Mulai:", value: bookingDetails.startDate },
    { label: "Tanggal Selesai:", value: bookingDetails.endDate },
    { label: "Deskripsi:", value: bookingDetails.description },
    { label: "Harga:", value: bookingDetails.price, isPrice: true },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 w-full max-w-2xl my-8 animate-fadeIn">
      <div className="text-center mb-6 md:mb-8">
        <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4" strokeWidth={1.5} />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Selamat! <br /> Pesanan Reservasi Kamar Hotel Sukses!
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Terima kasih telah memesan kamar melalui Travelix!
        </p>
      </div>

      {/* Detail Pesanan dengan nilai di bawah label */}
      <div className="space-y-4 border-t border-b border-gray-200 py-6 mb-8"> {/* Sedikit menambah space-y */}
        {detailsToDisplay.map((item) => (
          <div key={item.label} className="text-sm"> {/* Hapus flex dan justify-between dari sini */}
            <span className="block font-medium text-gray-600">{item.label}</span> {/* `block` agar mengambil lebar penuh */}
            <span 
              className={`block mt-1 ${item.isPrice ? 'font-bold text-lg text-yellow-600' : 'text-gray-800'}`} // `block` dan `mt-1` untuk baris baru dan sedikit spasi
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="btn btn-primary bg-yellow-400 hover:bg-yellow-500 text-black border-none w-full sm:w-auto">
          Cetak PDF
        </button>
        <button className="btn btn-outline border-yellow-400 text-yellow-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 w-full sm:w-auto">
          Cetak Tiket
        </button>
      </div>
    </div>
  );
}