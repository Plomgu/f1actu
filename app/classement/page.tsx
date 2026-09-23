"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import SiteHeader from "../components/SiteHeader";
import AdBanner from "../components/AdBanner";
import WeatherCard from "../components/WeatherCard";
import { LeaderCardSkeleton, StandingsRowsSkeleton, Skeleton } from "../components/Skeleton";
import { teams } from "../ecuries/team-data";
import { calendar2026 } from "../calendrier/calendar-data";

function formatCountdown(nowTimestamp: number, targetIso: string) {
  const diff = new Date(targetIso).getTime() - nowTimestamp;
  if (diff <= 0) return "En cours ou passé";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days} j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

function getPodiumClass(position: number) {
  if (position === 1) return "bg-yellow-100 text-yellow-700";
  if (position === 2) return "bg-gray-200 text-gray-700";
  if (position === 3) return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
}

type DriverEntry = { position: number; driverId: string; name: string; points: number };
type ConstructorEntry = { position: number; teamId: string; name: string; points: number };

const driverVisuals: Record<string, { team: string; color: string; logo: string; photo: string }> = {
  russell:       { team: "Mercedes",        color: "#00D2BE", logo: "/logos/mercedes.png",    photo: "/drivers/russell.png" },
  antonelli:     { team: "Mercedes",        color: "#00D2BE", logo: "/logos/mercedes.png",    photo: "/drivers/antonelli.png" },
  leclerc:       { team: "Ferrari",         color: "#DC0000", logo: "/logos/ferrari.png",     photo: "/drivers/leclerc.png" },
  hamilton:      { team: "Ferrari",         color: "#DC0000", logo: "/logos/ferrari.png",     photo: "/drivers/hamilton.png" },
  bearman:       { team: "Haas",            color: "#E6002B", logo: "/logos/haas.png",        photo: "/drivers/bearman.png" },
  norris:        { team: "McLaren",         color: "#FF8700", logo: "/logos/mclaren.png",     photo: "/drivers/norris.png" },
  gasly:         { team: "Alpine",          color: "#0090FF", logo: "/logos/alpine.png",      photo: "/drivers/gasly.png" },
  max_verstappen:{ team: "Red Bull Racing", color: "#0600EF", logo: "/logos/redbull.png",     photo: "/drivers/verstappen.png" },
  lawson:        { team: "Racing Bulls",    color: "#1E41FF", logo: "/logos/rb.png",          photo: "/drivers/lawson.png" },
  lindblad:      { team: "Racing Bulls",    color: "#1E41FF", logo: "/logos/rb.png",          photo: "/drivers/lindblad.png" },
  hadjar:        { team: "Red Bull Racing", color: "#0600EF", logo: "/logos/redbull.png",     photo: "/drivers/hadjar.png" },
  piastri:       { team: "McLaren",         color: "#FF8700", logo: "/logos/mclaren.png",     photo: "/drivers/piastri.png" },
  sainz:         { team: "Williams",        color: "#005AFF", logo: "/logos/williams.png",    photo: "/drivers/sainz.png" },
  bortoleto:     { team: "Audi",            color: "#BB0A30", logo: "/logos/audi.png",        photo: "/drivers/bortoleto.png" },
  colapinto:     { team: "Alpine",          color: "#0090FF", logo: "/logos/alpine.png",      photo: "/drivers/colapinto.png" },
  ocon:          { team: "Haas",            color: "#E6002B", logo: "/logos/haas.png",        photo: "/drivers/ocon.png" },
  hulkenberg:    { team: "Audi",            color: "#BB0A30", logo: "/logos/audi.png",        photo: "/drivers/hulkenberg.png" },
  albon:         { team: "Williams",        color: "#005AFF", logo: "/logos/williams.png",    photo: "/drivers/albon.png" },
  bottas:        { team: "Cadillac",        color: "#003A8F", logo: "/logos/cadillac.png",    photo: "/drivers/bottas.png" },
  perez:         { team: "Cadillac",        color: "#003A8F", logo: "/logos/cadillac.png",    photo: "/logos/f1.png" },
  alonso:        { team: "Aston Martin",    color: "#006F62", logo: "/logos/astonmartin.png", photo: "/drivers/alonso.png" },
  stroll:        { team: "Aston Martin",    color: "#006F62", logo: "/logos/astonmartin.png", photo: "/drivers/stroll.png" },
};

const constructorVisuals: Record<string, { color: string; logo: string; drivers: string[] }> = {
  mercedes:     { color: "#00D2BE", logo: "/logos/mercedes.png",    drivers: ["George Russell", "Kimi Antonelli"] },
  ferrari:      { color: "#DC0000", logo: "/logos/ferrari.png",     drivers: ["Charles Leclerc", "Lewis Hamilton"] },
  mclaren:      { color: "#FF8700", logo: "/logos/mclaren.png",     drivers: ["Lando Norris", "Oscar Piastri"] },
  haas:         { color: "#E6002B", logo: "/logos/haas.png",        drivers: ["Oliver Bearman", "Esteban Ocon"] },
  red_bull:     { color: "#0600EF", logo: "/logos/redbull.png",     drivers: ["Max Verstappen", "Isack Hadjar"] },
  rb:           { color: "#1E41FF", logo: "/logos/rb.png",          drivers: ["Liam Lawson", "Arvid Lindblad"] },
  alpine:       { color: "#0090FF", logo: "/logos/alpine.png",      drivers: ["Pierre Gasly", "Franco Colapinto"] },
  audi:         { color: "#BB0A30", logo: "/logos/audi.png",        drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"] },
  williams:     { color: "#005AFF", logo: "/logos/williams.png",    drivers: ["Alexander Albon", "Carlos Sainz"] },
  cadillac:     { color: "#003A8F", logo: "/logos/cadillac.png",    drivers: ["Sergio Perez", "Valtteri Bottas"] },
  aston_martin: { color: "#006F62", logo: "/logos/astonmartin.png", drivers: ["Fernando Alonso", "Lance Stroll"] },
};

export default function ClassementPage() {
  const [currentTimestamp] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ?? calendar2026[calendar2026.length - 1];

  const [drivers, setDrivers] = useState<DriverEntry[]>([]);
  const [constructors, setConstructors] = useState<ConstructorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    async function loadStandings() {
      try {
        const res = await fetch("/api/standings", { cache: "no-store" });
        const data = await res.json();
        if (data.drivers) setDrivers(data.drivers);
        if (data.constructors) setConstructors(data.constructors);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadStandings();
    const interval = setInterval(loadStandings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const topDriver = drivers[0];
  const topConstructor = constructors[0];
  const topDriverVisual = topDriver ? driverVisuals[topDriver.driverId] : null;
  const topConstructorVisual = topConstructor ? constructorVisuals[topConstructor.teamId] : null;

  return (
    <div className="bg-[#F0F2F5] min-h-screen py-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <AdBanner variant="horizontal" bare />

        <SiteHeader />

        <div className="bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 overflow-hidden">
            <div className="flex gap-6 w-max animate-marquee">
              {[...teams, ...teams].map((team, i) => (
                <a key={i} href={team.link} className="flex items-center justify-center bg-white shadow-md hover:shadow-xl rounded-2xl w-[140px] h-[80px] transition-all shrink-0">
                  <img src={team.logo} alt={team.name} className="max-h-[40px] max-w-[100px] object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div
            className="w-full lg:w-2/3 text-white font-extrabold py-5 rounded-2xl tracking-widest text-lg flex items-center justify-center gap-3"
            style={{ background: "linear-gradient(90deg,#0A0F1E 0%,#C41230 30%,#C41230 70%,#0A0F1E 100%)" }}
          >
            🔥 CLASSEMENT PILOTES & ECURIES
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">

          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-5 shadow-2xl rounded-3xl border border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-[#C41230]">Classement pilotes</h2>

            {loading ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
                  <LeaderCardSkeleton />
                  <LeaderCardSkeleton />
                </div>
                <StandingsRowsSkeleton rows={10} />
                <Skeleton className="h-5 w-56 mt-8 mb-4" />
                <StandingsRowsSkeleton rows={10} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
                  {topDriver && topDriverVisual && (
                    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2.5">
                      <div className="text-[10px] font-bold tracking-wider text-yellow-700">LEADER PILOTES</div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-gray-900 truncate">{topDriver.name}</div>
                          <div className="text-[11px] text-gray-500 truncate">{topDriverVisual.team}</div>
                        </div>
                        <div className="text-sm font-semibold text-yellow-800 whitespace-nowrap">{topDriver.points} pts</div>
                      </div>
                    </div>
                  )}
                  {topConstructor && topConstructorVisual && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <div className="text-[10px] font-bold tracking-wider text-slate-700">LEADER CONSTRUCTEURS</div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-gray-900 truncate">{topConstructor.name}</div>
                          <div className="text-[11px] text-gray-500 truncate">{topConstructorVisual.drivers.join(" • ")}</div>
                        </div>
                        <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">{topConstructor.points} pts</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mb-1">
                  <span className="w-7 text-center">#</span>
                  <span className="flex-1">Pilote</span>
                  <span className="w-11 text-right">Pts</span>
                </div>

                {drivers.map((d, i) => {
                  const v = driverVisuals[d.driverId];
                  return (
                    <div key={i} className="flex items-center gap-2 border-b border-gray-100 py-1.5 text-sm hover:bg-gray-50/80 transition rounded-xl px-1.5">
                      <div className="w-1 h-8 rounded" style={{ background: v?.color ?? "#ccc" }} />
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-bold ${getPodiumClass(d.position)}`}>{d.position}</span>
                      <div className="flex items-center flex-1 gap-2 min-w-0">
                        <img src={v?.photo ?? "/logos/f1.png"} alt={d.name} className="h-8 w-8 rounded-full object-cover border border-gray-200" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold leading-none truncate text-[13px]">{d.name}</span>
                          <span className="text-gray-400 text-[11px] flex items-center gap-1 truncate">
                            {v && <img src={v.logo} alt={v.team} className="h-3" />}
                            {v?.team ?? ""}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#C41230] tabular-nums w-11 text-right text-[13px]">{d.points}</span>
                    </div>
                  );
                })}

                <h2 className="text-lg font-bold mt-8 mb-4 text-[#C41230]">Classement constructeurs</h2>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mb-1">
                  <span className="w-7 text-center">#</span>
                  <span className="flex-1">Ecurie</span>
                  <span className="w-11 text-right">Pts</span>
                </div>

                {constructors.map((c, i) => {
                  const v = constructorVisuals[c.teamId];
                  return (
                    <div key={i} className="flex items-center gap-2 border-b border-gray-100 py-1.5 text-sm hover:bg-gray-50/80 transition rounded-xl px-1.5">
                      <div className="w-1 h-8 rounded" style={{ background: v?.color ?? "#ccc" }} />
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-bold ${getPodiumClass(c.position)}`}>{c.position}</span>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate text-[13px]">{c.name}</span>
                          {v && <img src={v.logo} alt={c.name} className="h-3.5 opacity-80" />}
                        </div>
                        {v && <span className="text-gray-400 text-[11px] mt-0.5 truncate">{v.drivers.join(" • ")}</span>}
                      </div>
                      <span className="font-bold text-[#C41230] tabular-nums w-11 text-right text-[13px]">{c.points}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="space-y-6 lg:-mt-24">

            <div className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C41230]" />
                <div className="font-bold text-gray-900 text-sm tracking-wide">Prochain Grand Prix</div>
              </div>
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
                    {formatCountdown(now, nextRace.raceDateIso)}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <div className="text-xs font-bold text-gray-500 tracking-wide">Météo sur place</div>
                </div>
                <WeatherCard location={nextRace.location} bare />
              </div>

              <Link
                href={`/circuits/${nextRace.circuitSlug}`}
                className="mt-4 block text-center rounded-2xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#C41230]"
              >
                Voir le circuit
              </Link>
            </div>

            <AdBanner variant="vertical" />

          </div>

        </div>

      </div>
    </div>
  );
}
