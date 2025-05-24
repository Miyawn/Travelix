function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-[#1c1c1c] text-white pb-8">
      <aside className="items-center text-center">
        <img
          src="src/assets/1.svg"
          alt="Travelix Logo"
          className="w-auto h-28 mx-auto mb-4 pt-4"
        />
        <p className="font-bold text-lg">
          Menyediakan Layanan Perjalanan Aman & Terpercaya
        </p>
        <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="/" className="transition hover:text-yellow-400">Home</a>
          <a href="/hotel" className="transition hover:text-yellow-400">Hotel</a>
          <a href="/flights" className="transition hover:text-yellow-400">Pesawat</a>
          <a href="/about" className="transition hover:text-yellow-400">About</a>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
