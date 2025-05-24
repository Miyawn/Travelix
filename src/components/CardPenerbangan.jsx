import {
  MapPin,
  ArrowRight,
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Users,
  Clock,
  Banknote,
} from "lucide-react";
import pesawatImg from "../assets/pesawat.jpg"; // Pastikan path ini sesuai dengan struktur folder Anda

function CardPenerbangan({
  title,
  asal,
  tujuan,
  tanggal,
  berangkat,
  tiba,
  lastCheckin,
  sisaKursi,
  harga,
}) {
  return (
    <div className="card bg-white shadow-xl">
      <figure>
        <img src={pesawatImg} alt="Pesawat" className="w-full object-cover h-48" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>{asal}</span>
          <ArrowRight className="w-4 h-4" />
          <span>{tujuan}</span>
        </div>

        <div className="flex items-center gap-4">
          <PlaneTakeoff className="w-5 h-5" />
          <span>{berangkat}</span>
          <PlaneLanding className="w-5 h-5 ml-4" />
          <span>{tiba}</span>
          <Calendar className="w-5 h-5 ml-4" />
          <span>{tanggal}</span>
        </div>

        <div className="flex items-center gap-4">
          <Users className="w-5 h-5" />
          <span>{sisaKursi}</span>
          <Clock className="w-5 h-5 ml-4" />
          <span>Last check-in: {lastCheckin}</span>
        </div>

        <div className="flex items-center gap-2">
          <Banknote className="w-5 h-5" />
          <span className="text-lg font-semibold">{harga}</span>
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-warning w-full">Book Sekarang</button>
        </div>
      </div>
    </div>
  );
}

export default CardPenerbangan;
