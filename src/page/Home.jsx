import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg1.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div
        className="relative flex-1 bg-cover bg-center text-white flex items-center justify-center text-center px-4 py-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay blur gelap yang menutupi seluruh segmen hero */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0" />

        {/* Konten hero */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            WEBSITE BOOKING HOTEL<br />DAN PENERBANGAN 
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-6">
            Travelix Menyediakan kemudahan untuk <br />
            memesan kamar hotel dan tiket pesawat secara online.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/hotel")}
              className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300"
            >
              🏨 Kamar Hotel
            </button>
            <button 
              onClick={() => navigate("/flights")}
              className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300">
              ✈️ Tiket Pesawat
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
