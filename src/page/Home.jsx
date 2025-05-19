import Navbar from "../components/navbar";
import Footer from "../components/footer";
import bgImage from "../assets/bg1.jpg"; // Ganti dengan path gambar kamu
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div
        className="flex-1 bg-cover bg-center text-white flex flex-col items-center justify-center text-center px-4 py-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          WEBSITE BOOKING HOTEL<br />DAN PENERBANGAN 
        </h1>
        <p className="text-sm md:text-base text-gray-200 mb-8">
          Lorem ipsum dolor sit amet si pasi baga niiga imi imi womomomomo wawa
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/kamarhotel")}
            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300"
          >
            🏨 Kamar Hotel
          </button>
          <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300">
            ✈️ Tiket Pesawat
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
