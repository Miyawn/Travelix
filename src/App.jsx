import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./page/Home";
import Hotel from "./page/Hotel";
import Flights from "./page/Flights";
import HotelDetails from "./page/HotelDetails";
import FlightDetails from "./page/FlightsDetails";  // import FlightDetails yang benar
import { Toaster } from "react-hot-toast";
import Profile from "./page/ProfilUser";
import ManageUser from "./page/ManageUser/ManageUser";
import EditUser from "./page/ManageUser/EditUser";
import AddUser from "./page/ManageUser/AddUser";

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
        <Route path="/profiluser" element={<Profile />} /> 
        <Route path="/manageuser" element={<ManageUser />} /> 
        <Route path="/edituser/:userid/edit" element={<EditUser />} />
        <Route path="/manageuser/add" element={<AddUser />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
