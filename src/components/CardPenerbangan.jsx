import React from 'react';
import { useNavigate } from 'react-router-dom';

// Asumsi ikon sudah di-import di sini jika diperlukan

function CardPenerbangan({ id, title, asal, tujuan, tanggal, berangkat, tiba, harga, sisaKursi }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigasi ke halaman detail dengan ID penerbangan
    navigate(`/flights/${id}`);
  };

  return (
    // Bungkus seluruh kartu dalam button atau div dengan onClick
    <div 
      onClick={handleCardClick} 
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Asal</p>
            <p className="font-semibold">{asal}</p>
            <p className="text-lg font-bold">{berangkat}</p>
          </div>
          <div className="text-center text-gray-400">-</div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Tujuan</p>
            <p className="font-semibold">{tujuan}</p>
            <p className="text-lg font-bold">{tiba}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Tanggal: {tanggal}</p>
        <p className="text-sm text-gray-600">Sisa Kursi: {sisaKursi}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 text-right">
        <p className="text-lg font-bold text-yellow-600">{harga}</p>
      </div>
    </div>
  );
}

export default CardPenerbangan;