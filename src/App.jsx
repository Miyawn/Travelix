import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home"; // import halaman baru
import KamarHotel from "./page/KamarHotel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kamarhotel" element={<KamarHotel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
