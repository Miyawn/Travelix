// src/components/BookingConfirmationCard.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react'; // Menggunakan ikon dari lucide-react

// Data contoh untuk ditampilkan, idealnya ini dari props atau state
const bookingDetails = {
  orderId: "081649036295", // Contoh, ganti dengan data dinamis
  hotelName: "Hotel Gunung Bakaran",
  roomName: "Deluxe Room",
  roomType: "Premium",
  startDate: "2 Juni 2025",
  endDate: "4 Juni 2025",
  description: "Kamar dengan pemandangan kota, termasuk sarapan.",
  price: "Rp. 1.600.000",
};

export default function BookingConfirmationCard() {
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
          Selamat! Pesanan Reservasi Kamar Hotel Sukses!
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Terima kasih telah memesan kamar melalui Travelix.
        </p>
      </div>

      <div className="space-y-3 border-t border-b border-gray-200 py-6 mb-8">
        {detailsToDisplay.map((item) => (
          <div key={item.label} className="flex flex-col sm:flex-row justify-between text-sm">
            <span className="font-medium text-gray-600 min-w-[120px] mb-1 sm:mb-0">{item.label}</span>
            <span className={`${item.isPrice ? 'font-bold text-lg text-yellow-600' : 'text-gray-800'} text-left sm:text-right`}>
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