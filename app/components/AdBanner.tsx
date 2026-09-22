import Link from "next/link";

interface AdBannerProps {
  variant?: "horizontal" | "vertical";
  bare?: boolean;
}

export default function AdBanner({ variant = "horizontal", bare = false }: AdBannerProps) {
  if (variant === "vertical") {
    return (
      <Link
        href="https://www.ecrindeberck.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="sticky top-6 block overflow-hidden rounded-3xl shadow-xl border border-[#C8A96E]/40 hover:shadow-2xl transition-all group"
      >
        <div className="relative min-h-[500px]">
          <img
            src="/images/ecrin-berck.jpg"
            alt="L'Écrin de Berck — appartement de charme"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.4) 50%, rgba(10,22,40,0.1) 100%)" }} />
          <div className="relative flex flex-col justify-end h-full min-h-[500px] p-6 gap-3 text-center items-center">
            <div className="text-[#C8A96E] font-extrabold text-lg tracking-widest uppercase drop-shadow">
              L'Écrin de Berck
            </div>
            <div className="w-10 h-0.5 bg-[#C8A96E]/60 rounded" />
            <div className="text-white/90 text-sm font-medium leading-relaxed drop-shadow">
              Appartement de charme à Berck-sur-Mer
            </div>
            <div className="text-white/70 text-xs leading-relaxed">
              À deux pas de la mer, profitez d'un séjour inoubliable sur la Côte d'Opale.
            </div>
            <div
              className="mt-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-[#0a1628]"
              style={{ background: "linear-gradient(90deg, #C8A96E, #e8c98e)" }}
            >
              Réserver maintenant →
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="https://www.ecrindeberck.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`block overflow-hidden transition-all group ${
        bare ? "" : "rounded-3xl shadow-xl border border-[#C8A96E]/40 hover:shadow-2xl"
      }`}
    >
      <div className="relative h-24">
        <img
          src="/images/ecrin-berck.jpg"
          alt="L'Écrin de Berck — appartement de charme"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.3) 100%)" }} />
        <div className="relative h-full flex items-center justify-between px-8 gap-6">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[#C8A96E] font-extrabold text-base tracking-widest uppercase drop-shadow">
                L'Écrin de Berck
              </div>
              <div className="text-white/80 text-xs mt-0.5 drop-shadow">
                Appartement de charme à Berck-sur-Mer — Côte d'Opale
              </div>
            </div>
          </div>
          <div
            className="shrink-0 px-5 py-2 rounded-full text-xs font-bold tracking-wider text-[#0a1628]"
            style={{ background: "linear-gradient(90deg, #C8A96E, #e8c98e)" }}
          >
            Découvrir →
          </div>
        </div>
      </div>
    </Link>
  );
}
