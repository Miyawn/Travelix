import { useState } from "react";
import LoginModal from "./LoginModal";
import LupaPassword from "./LupaPassword";

export default function AuthPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isLupaPasswordOpen, setIsLupaPasswordOpen] = useState(false);

  return (
    <>
      {/* Modal Login SELALU TERBUKA */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => setIsLoginOpen(false)}
        onOpenLupaPassword={() => setIsLupaPasswordOpen(true)} // ⬅️ INI WAJIB
      />

      {/* Modal Lupa Password DITUMPUK */}
      <LupaPassword
        isOpen={isLupaPasswordOpen}
        onClose={() => setIsLupaPasswordOpen(false)}
      />
    </>
  );
}
