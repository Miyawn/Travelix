function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-[#1c1c1c] text-white p-8">
      <aside className="items-center text-center">
        <img
          src="src/assets/logonavbar.png"
          alt="Travelix Logo"
          className="w-auto h-16 mx-auto mb-4"
        />
        <p className="font-bold text-lg">
          Menyediakan Layanan Perjalanan Aman & Terpercaya
        </p>
        <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/hotel" className="hover:underline">Hotel</a>
          <a href="/flights" className="hover:underline">Pesawat</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
