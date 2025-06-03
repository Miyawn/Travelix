import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

{/* PageImports */}
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./page/Home";
import Hotel from "./page/Hotel";
import Flights from "./page/Flights";
import HotelDetails from "./page/HotelDetails";
import FlightDetails from "./page/FlightsDetails"; 
import HotelReceipts from "./page/HotelReceipts";
import FlightReceipts from "./page/FlightsReceipts";
import Profile from "./page/ProfilUser";

{/* AdminSides */}
import AdminDashboard from "./page/DashboardAdmin/AdminDashboard";
import AdminAdd from "./page/DashboardAdmin/DashboardAdd";
import AdminEdit from "./page/DashboardAdmin/DashboardEdit";
import AdminTransactions from "./page/DashboardAdmin/Transactions";
import DbAirlineList from "./page/DashboardAdmin/dbAirlineList";
import DbHotelList from "./page/DashboardAdmin/dbHotelList";
import AdminTopup from "./page/DashboardAdmin/TopUp";

{/* MitraSides */}
import MitraDashboard from "./page/DashboardMitra/MitraDashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

        {/* Main Page */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/hotel" element={<Hotel />} />

        {/* Details & Receipts */}
        <Route path="/hoteldetails" element={<HotelDetails />} />
        <Route path="/hotelreceipts" element={<HotelReceipts />} />
        <Route path="/flightsdetails" element={<FlightDetails />} /> 
        <Route path="/flightsreceipts" element={<FlightReceipts />} />

        {/* Dashboard Admin */}
        <Route path="/profiluser" element={<Profile />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/add" element={<AdminAdd />} />
        <Route path="/dashboard/edit" element={<AdminEdit />} />
        <Route path="/dashboard/transactions" element={<AdminTransactions />} />
        <Route path="/dashboard/airlines" element={<DbAirlineList />} />
        <Route path="/dashboard/hotels" element={<DbHotelList />} />
        <Route path="/dashboard/topup" element={<AdminTopup />} />

        {/* Dashboard Mitra */}
        <Route path="/dashboard/mitra" element={<MitraDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
