"use client";

import Link from "next/link";
import { useState } from "react";

import SiteHeader from "../../components/SiteHeader";
import AdBanner from "../../components/AdBanner";
import WeatherCard from "../../components/WeatherCard";
import { teams } from "../../ecuries/team-data";
import { circuitMenu, type CircuitPageData } from "../circuit-data";
import { calendar2026 } from "../../calendrier/calendar-data";

function formatCountdown(nowTimestamp: number, targetIso: string) {
  const diff = new Date(targetIso).getTime() - nowTimestamp;
  if (diff <= 0) return "En cours ou passé";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days} j ${hours} h`;
}

export default function CircuitPageClient({ circuit }: { circuit: CircuitPageData }) {
  const [currentTimestamp] = useState(() => Date.now());
  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ?? calendar2026[calendar2026.length - 1];
  const flagCodeByCountry: Record<string, string> = {
    Australie: "au",
    Chine: "cn",
    Japon: "jp",
    Bahrein: "bh",
    "Arabie saoudite": "sa",
    "Etats-Unis": "us",
    Canada: "ca",
    Monaco: "mc",
    Espagne: "es",
    Autriche: "at",
    "Royaume-Uni": "gb",
    Belgique: "be",
    Hongrie: "hu",
    "Pays-Bas": "nl",
    Italie: "it",
    Azerbaidjan: "az",
    Singapour: "sg",
    Mexique: "mx",
    Bresil: "br",
    Qatar: "qa",
    "Emirats arabes unis": "ae",
  };

  const flagCode = flagCodeByCountry[circuit.country] ?? "un";

  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <AdBanner variant="horizontal" bare />

        <SiteHeader />

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              {teams.map((team) => (
                <Link
                  key={team.link}
                  href={team.link}
                  className="flex items-center justify-center bg-white shadow-md hover:shadow-xl rounded-2xl w-[140px] h-[80px] transition-all"
                >
                  <img src={team.logo} alt={team.name} className="max-h-[40px] max-w-[100px] object-contain" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div
            className="w-full lg:w-2/3 text-white rounded-2xl shadow-xl px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3"
            style={{
              background: "linear-gradient(90deg,#0A0F1E 0%,#131E30 40%,#131E30 60%,#0A0F1E 100%)",
            }}
          >
            <div className="flex items-center gap-4">
              <img
                src={`https://flagcdn.com/w80/${flagCode}.png`}
                alt={circuit.country}
                className="h-12 w-12 object-cover rounded-full border border-white/20 bg-white/10"
              />

              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-wide">{circuit.grandPrix}</span>
                <span className="text-xs text-white/80">
                  {circuit.circuitName} • {circuit.location}
                </span>
              </div>
            </div>

            <div className="text-right text-sm">
              <div className="font-semibold">{circuit.roundDate}</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-4 sm:p-10 shadow-2xl rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold mt-4 sm:mt-10 mb-6 text-[#C41230]">
              Trace du circuit
            </h2>

            <div className="rounded-[2rem] border border-slate-700 bg-gradient-to-br from-[#0A0F1E] via-[#0F172A] to-[#1C2438] p-6 shadow-inner">
              <div className="rounded-[1.5rem] bg-white/8 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Circuit layout</div>
                    <div className="text-xl font-extrabold text-white">{circuit.circuitName}</div>
                  </div>
                  <div className="text-right text-xs text-white/70">
                    <div>{circuit.length}</div>
                    <div>{circuit.laps} tours</div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1120]/70 px-4 py-6 flex items-center justify-center">
                  <img
                    src={circuit.image}
                    alt={`Trace du ${circuit.circuitName}`}
                    className="mx-auto h-[260px] w-full max-w-[520px] object-contain"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  {circuit.highlights.map((item) => (
                    <div key={`${item.label}-${item.value}`} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">{item.label}</div>
                      <div className="mt-1 text-sm font-semibold text-white">{item.value}</div>
                      <div className="mt-1 text-xs leading-relaxed text-white/70">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mt-6 sm:mt-10 mb-6 text-[#C41230]">
              A propos du Grand Prix
            </h2>

            {circuit.summary.map((paragraph) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}

            <h2 className="text-xl font-bold mt-6 sm:mt-10 mb-6 text-[#C41230]">
              Chiffres cles
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
              {circuit.stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-extrabold text-[#C41230]">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:-mt-24">
            <div className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C41230] mb-3">Prochaine course</div>
              <div className="space-y-2">
                <div className="text-base font-black text-gray-900 leading-tight">{nextRace.grandPrix}</div>
                <div className="text-sm text-gray-500">{nextRace.location}</div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Date de course</div>
                  <div className="mt-1 text-sm font-bold text-gray-900">{nextRace.raceDateLabel} · {nextRace.raceTime}</div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Compte à rebours</div>
                  <div className="mt-1 text-lg font-extrabold text-[#C41230]">
                    {formatCountdown(currentTimestamp, nextRace.raceDateIso)}
                  </div>
                </div>
                <Link
                  href={`/circuits/${nextRace.circuitSlug}`}
                  className="mt-1 block text-center rounded-2xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#C41230]"
                >
                  Voir le circuit
                </Link>
              </div>
            </div>

            <WeatherCard location={nextRace.location} />

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <div className="font-bold text-[#C41230] mb-4 text-sm tracking-wider">AUTRES CIRCUITS 2026</div>

              <div className="space-y-2">
                {circuitMenu
                  .filter((item) => item.slug !== circuit.slug)
                  .slice(0, 6)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/circuits/${item.slug}`}
                      className="block rounded-xl border border-gray-100 px-3 py-2 hover:border-gray-200 hover:bg-gray-50 transition"
                    >
                      <div className="text-sm font-semibold text-gray-800">{item.grandPrix}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="sticky top-6 bg-gray-100 p-8 shadow-xl flex items-center justify-center min-h-[500px] border border-gray-200 rounded-3xl">
              ESPACE PUBLICITE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
