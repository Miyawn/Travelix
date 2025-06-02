import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./page/Home";
import Hotel from "./page/Hotel";
import Flights from "./page/Flights";
import HotelDetails from "./page/HotelDetails";
import FlightDetails from "./page/FlightsDetails"; 
import HotelReceipts from "./page/HotelReceipts";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/hoteldetails" element={<HotelDetails />} />
        <Route path="/flightsdetails" element={<FlightDetails />} />
        <Route path="/hotelreceipts" element={<HotelReceipts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
