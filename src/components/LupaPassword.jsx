export default function LupaPassword({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop tipis supaya modal login tetap kelihatan */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-60 px-4">
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tombol Tutup */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-center mb-4 text-black">
            Reset Password
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            Masukkan email untuk mengatur ulang password.
          </p>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded mb-4"
          />

          <button className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400">
            Kirim Link Reset
          </button>
        </div>
      </div>
    </>
  );
}
LupaPassword.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};