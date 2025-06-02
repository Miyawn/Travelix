// src/components/FlightReceiptCard.jsx
import React from 'react';
// Menggunakan CheckCircle seperti di BookingConfirmationCard, bukan Check saja
import { CheckCircle, Ticket, FileDown } from 'lucide-react';

// Data contoh untuk tiket pesawat
const defaultFlightBookingDetails = {
  orderId: "PSWT-XYZ789",
  airlineName: "Garuda Airways", // Maskapai berbeda untuk contoh
  departureAirport: "Bandara Internasional Kualanamu (KNO), Medan",
  departureTime: "Rabu, 4 Juni 2025, 10:00 WIB",
  arrivalAirport: "Bandara Internasional Soekarno-Hatta (CGK), Jakarta",
  arrivalTime: "Rabu, 4 Juni 2025, 12:15 WIB",
  seatNumber: "18A (Bisnis)",
  price: "Rp. 2.150.000",
  passengerName: "Ibu Siti Aminah", // Tambahan detail jika perlu
  bookingDate: "2 Juni 2025, 14:00 WIB",
};

export default function FlightReceiptCard({ details }) {
  const bookingDetails = details || defaultFlightBookingDetails;

  // Daftar detail yang akan ditampilkan, disesuaikan untuk penerbangan
  const detailsToDisplay = [
    { label: "ID Pesanan:", value: bookingDetails.orderId },
    { label: "Nama Penumpang:", value: bookingDetails.passengerName }, // Contoh tambahan detail
    { label: "Nama Maskapai:", value: bookingDetails.airlineName },
    { label: "Bandara Keberangkatan:", value: bookingDetails.departureAirport },
    { label: "Waktu Keberangkatan:", value: bookingDetails.departureTime },
    { label: "Bandara Kedatangan:", value: bookingDetails.arrivalAirport },
    { label: "Waktu Kedatangan:", value: bookingDetails.arrivalTime },
    { label: "Nomor Kursi:", value: bookingDetails.seatNumber },
    { label: "Tanggal Pemesanan:", value: bookingDetails.bookingDate }, // Contoh tambahan detail
    { label: "Harga:", value: bookingDetails.price, isPrice: true }, // isPrice untuk styling harga
  ];

  return (
    // Mengikuti styling utama dari BookingConfirmationCard
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 w-full max-w-2xl my-8 animate-fadeIn"> {/* max-w-2xl */}
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        {/* Ikon CheckCircle hijau seperti di BookingConfirmationCard */}
        <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4" strokeWidth={1.5} />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800"> {/* Teks judul abu-abu gelap */}
          Selamat! <br className="sm:hidden"/> Pesanan Tiket Pesawat Sukses!
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Terima kasih telah memesan tiket pesawat melalui Travelix!
        </p>
      </div>

      {/* Detail Pesanan */}
      {/* Mengikuti styling label di atas, nilai di bawah dari BookingConfirmationCard */}
      <div className="space-y-4 border-t border-b border-gray-200 py-6 mb-8">
        {detailsToDisplay.map((item) => (
          <div key={item.label} className="text-sm">
            <span className="block font-medium text-gray-600">{item.label}</span>
            <span 
              className={`block mt-1 ${ // mt-1 untuk jarak antara label dan nilai
                item.isPrice ? 'font-bold text-lg text-yellow-600' : 'text-gray-800' // Harga tetap kuning
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Tombol Aksi */}
      {/* Mengikuti styling tombol dari BookingConfirmationCard */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="btn btn-primary bg-yellow-400 hover:bg-yellow-500 text-black border-none w-full sm:w-auto">
          <FileDown size={18} className="mr-2"/> Cetak PDF
        </button>
        <button className="btn btn-outline border-yellow-400 text-yellow-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 w-full sm:w-auto">
          <Ticket size={18} className="mr-2"/> Unduh Tiket
        </button>
      </div>
       <div className="mt-8 text-center text-xs text-gray-500">
        <p>Harap tiba di bandara minimal 2 jam sebelum keberangkatan. Pastikan dokumen perjalanan Anda lengkap.</p>
        <p className="mt-1">Travelix - Your Journey, Our Priority.</p>
      </div>
    </div>
  );
}