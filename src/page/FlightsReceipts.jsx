// src/pages/FlightReceipts.jsx (atau nama file yang Anda gunakan)
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import FlightReceiptCard from "../components/BookingFlightConfirmationCard"; // 1. Impor komponen baru

function FlightReceipts() { // Ganti nama fungsi agar sesuai
  const navigate = useNavigate();

  // Data ini idealnya datang dari proses booking sebelumnya (misalnya via state, context, atau URL params)
  // Anda bisa meneruskannya sebagai prop 'details' ke FlightReceiptCard jika perlu.
  const flightBookingDataFromParent = {
    orderId: "PSWT-ABCDE12345",
    airlineName: "Lion Air",
    departureAirport: "Soekarno-Hatta (CGK), Jakarta",
    departureTime: "Rabu, 4 Juni 2025, 08:00 WIB",
    arrivalAirport: "SAMS Sepinggan (BPN), Balikpapan",
    arrivalTime: "Rabu, 4 Juni 2025, 11:10 WITA",
    seatNumber: "25C",
    price: "Rp. 980.000",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16"> {/* Latar abu-abu untuk kontras */}
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        
        {/* 2. Gunakan komponen FlightReceiptCard di sini */}
        {/* Jika FlightReceiptCard menerima props: */}
        <FlightReceiptCard details={flightBookingDataFromParent} /> 
        {/* Jika tidak, dan FlightReceiptCard menggunakan data default internalnya: */}
        {/* <FlightReceiptCard /> */}
      </main>
      <Footer />
    </div>
  );
}

export default FlightReceipts; // Ganti nama export default