function Footer() {
  return (
    <footer className="bg-[#1c1c1c] text-white text-center pt-8">
      <div className="text-2xl font-bold mb-8">T</div>
      <div className="flex justify-center gap-8 mb-8">
        <a href="#" className="hover:underline" style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 16, fontFamily: '', fontWeight: '100', wordWrap: 'break-word'}}>Home</a>
        <a href="#" className="hover:underline" style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 16, fontFamily: '', fontWeight: '100', wordWrap: 'break-word'}}>Hotel</a>
        <a href="#" className="hover:underline" style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 16, fontFamily: '', fontWeight: '100', wordWrap: 'break-word'}}>Pesawat</a>
        <a href="#" className="hover:underline" style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 16, fontFamily: '', fontWeight: '100', wordWrap: 'break-word'}}>About</a>
        <a href="#" className="hover:underline" style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 16, fontFamily: '', fontWeight: '100', wordWrap: 'break-word'}}>Contact</a>
      </div>
      <div style={{width: '100%', height: '100%', paddingLeft: 109, paddingRight: 109, paddingTop: 8, paddingBottom: 8, background: 'var(--t--colors-base-black, black)', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>Copyright 2025; Designed by Travelix</div>
    </footer>
  );
}

export default Footer;
