"use client";

import { useState } from "react";
import Link from "next/link";

import { teams } from "../ecuries/team-data";
import { driverMenu } from "../pilotes/driver-data";
import { circuitMenu } from "../circuits/circuit-data";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  function toggleSection(name: string) {
    setOpenSection((prev) => (prev === name ? null : name));
  }

  function closeAll() {
    setMenuOpen(false);
    setOpenSection(null);
  }

  return (
    <header className="w-full bg-gradient-to-r from-black via-[#1E293B] to-[#94A3B8] border-b border-white/10">

      {/* ── Barre principale ── */}
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 lg:h-28 px-4">

        {/* Logo */}
        <Link href="/" onClick={closeAll} className="flex items-center shrink-0">
          <img
            src="/logos/f1actu.png"
            alt="F1 Actu"
            className="h-16 lg:h-24 w-auto object-contain drop-shadow-2xl"
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex flex-1 ml-6">
          <div
            className="flex items-center gap-8 text-base font-bold text-white px-8 py-4 rounded-r-2xl shadow-xl w-full"
            style={{ background: "linear-gradient(90deg,#0A0F1E 0%,#131E30 40%,#131E30 60%,#0A0F1E 100%)" }}
          >
            <Link href="/" className="hover:text-red-200 transition whitespace-nowrap">Actu</Link>

            {/* Écuries */}
            <div className="relative group cursor-pointer">
              <span className="hover:text-red-200 transition whitespace-nowrap">Ecuries ▾</span>
              <div className="absolute left-0 top-full mt-0 hidden group-hover:block bg-black text-white rounded-2xl shadow-2xl p-2 min-w-[180px] z-50">
                {teams.map((team) => (
                  <Link key={team.link} href={team.link} className="block px-2.5 py-1.5 rounded-lg text-sm hover:bg-red-600/20 transition">
                    {team.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pilotes */}
            <div className="relative group cursor-pointer">
              <span className="hover:text-red-200 transition whitespace-nowrap">Pilotes ▾</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-black text-white rounded-2xl shadow-2xl p-3 min-w-[340px] z-50">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {driverMenu.map((driver) => (
                    <Link
                      key={driver.slug}
                      href={`/pilotes/${driver.slug}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-[#C41230]/20 transition"
                    >
                      <img src={driver.img} alt={driver.name} className="w-6 h-6 rounded-full object-cover" />
                      <span>{driver.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/classement" className="hover:text-red-200 transition whitespace-nowrap">Classement</Link>
            <Link href="/calendrier" className="hover:text-red-200 transition whitespace-nowrap">Calendrier</Link>

            {/* Circuits */}
            <div className="relative group cursor-pointer">
              <span className="hover:text-red-200 transition whitespace-nowrap">Circuit ▾</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-black text-white rounded-2xl shadow-2xl p-4 min-w-[340px] max-h-[460px] overflow-y-auto z-50">
                {circuitMenu.map((circuit) => (
                  <Link key={circuit.slug} href={`/circuits/${circuit.slug}`} className="block px-3 py-2 rounded-xl hover:bg-red-600/20 transition">
                    <div className="text-sm font-semibold">{circuit.grandPrix}</div>
                    <div className="text-xs text-white/60">{circuit.circuitName}</div>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/programme-tv" className="hover:text-red-200 transition whitespace-nowrap">Programme TV</Link>
          </div>
        </nav>

        {/* Bouton hamburger mobile */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] shrink-0"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* ── Menu mobile déroulant ── */}
      {menuOpen && (
        <nav className="lg:hidden bg-[#0A0F1E] border-t border-white/10 divide-y divide-white/5">

          <Link href="/" onClick={closeAll} className="flex items-center text-white font-bold py-4 px-5 hover:bg-white/5 transition">
            Actu
          </Link>

          {/* Écuries mobile */}
          <div>
            <button
              onClick={() => toggleSection("ecuries")}
              className="w-full flex items-center justify-between text-white font-bold py-4 px-5 hover:bg-white/5 transition"
            >
              Ecuries
              <span className={`text-xs transition-transform duration-200 ${openSection === "ecuries" ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSection === "ecuries" && (
              <div className="bg-[#0F172A] px-4 pb-3 space-y-0.5">
                {teams.map((team) => (
                  <Link key={team.link} href={team.link} onClick={closeAll}
                    className="block text-white/75 py-2.5 px-3 rounded-lg hover:bg-white/10 hover:text-white transition text-sm">
                    {team.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pilotes mobile */}
          <div>
            <button
              onClick={() => toggleSection("pilotes")}
              className="w-full flex items-center justify-between text-white font-bold py-4 px-5 hover:bg-white/5 transition"
            >
              Pilotes
              <span className={`text-xs transition-transform duration-200 ${openSection === "pilotes" ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSection === "pilotes" && (
              <div className="bg-[#0F172A] px-4 pb-3 grid grid-cols-2 gap-1">
                {driverMenu.map((driver) => (
                  <Link key={driver.slug} href={`/pilotes/${driver.slug}`} onClick={closeAll}
                    className="flex items-center gap-2 text-white/75 py-2 px-2 rounded-lg hover:bg-white/10 hover:text-white transition">
                    <img src={driver.img} alt={driver.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <span className="text-xs truncate">{driver.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/classement" onClick={closeAll} className="flex items-center text-white font-bold py-4 px-5 hover:bg-white/5 transition">
            Classement
          </Link>

          <Link href="/calendrier" onClick={closeAll} className="flex items-center text-white font-bold py-4 px-5 hover:bg-white/5 transition">
            Calendrier
          </Link>

          {/* Circuits mobile */}
          <div>
            <button
              onClick={() => toggleSection("circuits")}
              className="w-full flex items-center justify-between text-white font-bold py-4 px-5 hover:bg-white/5 transition"
            >
              Circuit
              <span className={`text-xs transition-transform duration-200 ${openSection === "circuits" ? "rotate-180" : ""}`}>▾</span>
            </button>
            {openSection === "circuits" && (
              <div className="bg-[#0F172A] px-4 pb-3 max-h-64 overflow-y-auto space-y-0.5">
                {circuitMenu.map((circuit) => (
                  <Link key={circuit.slug} href={`/circuits/${circuit.slug}`} onClick={closeAll}
                    className="block text-white/75 py-2.5 px-3 rounded-lg hover:bg-white/10 hover:text-white transition text-sm">
                    {circuit.grandPrix}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/programme-tv" onClick={closeAll} className="flex items-center text-white font-bold py-4 px-5 hover:bg-white/5 transition">
            Programme TV
          </Link>

        </nav>
      )}
    </header>
  );
}
