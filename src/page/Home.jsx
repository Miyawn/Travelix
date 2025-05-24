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
        className="relative flex-1 bg-cover bg-center text-white flex items-center justify-left text-left px-32 py-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay blur gelap yang menutupi seluruh segmen hero */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0" />

        {/* Konten hero */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-7xl font-bold mb-4 text-white pt-16">
            TRAVELIX
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-6">
            Travelix Menyediakan kemudahan untuk memesan kamar hotel 
            dan tiket pesawat secara <br /> online, memberikan pengalaman
            yang nyaman dan efisien kapanpun dan dimanapun!
          </p>
          <div className="flex gap-4 justify-left w-full flex-wrap">
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
