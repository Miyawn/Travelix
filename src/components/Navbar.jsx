import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#1c1c1c] text-white">
      <div className="text-xl font-bold">LOGO</div>
      <div className="flex gap-4">
        <button className="hover:underline">Button</button>
        <button className="hover:underline">Button</button>
        <Link to="/login">
          <button className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300">
            Masuk
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
