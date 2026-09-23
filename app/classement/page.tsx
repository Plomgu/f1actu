"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import SiteHeader from "../components/SiteHeader";
import AdBanner from "../components/AdBanner";
import WeatherCard from "../components/WeatherCard";
import { PodiumSkeleton, StandingsRowsSkeleton, Skeleton } from "../components/Skeleton";
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

type DriverEntry = { position: number; driverId: string; name: string; points: number };
type ConstructorEntry = { position: number; teamId: string; name: string; points: number };

type StandingRow = {
  position: number;
  name: string;
  subtitle: string;
  points: number;
  color: string;
  image: string;
  imageShape: "circle" | "logo";
};

function medalColor(position: number) {
  if (position === 1) return "#D4AF37";
  if (position === 2) return "#A7ADB4";
  return "#B5651D";
}

function PodiumImage({ row, size, color }: { row: StandingRow; size: "xs" | "sm" | "lg"; color?: string }) {
  const dimension = size === "lg" ? "h-16 w-16" : size === "sm" ? "h-12 w-12" : "h-7 w-7";
  const borderColor = color ?? row.color;
  if (row.imageShape === "circle") {
    return (
      <img
        src={row.image}
        alt={row.name}
        className={`${dimension} rounded-full object-cover border-2`}
        style={{ borderColor }}
      />
    );
  }
  return (
    <div
      className={`${dimension} flex items-center justify-center rounded-full border-2 bg-white ${size === "xs" ? "p-1" : "p-1.5"}`}
      style={{ borderColor }}
    >
      <img src={row.image} alt={row.name} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

function StandingsRow({ row }: { row: StandingRow }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-gray-50/80">
      <span className="w-4 shrink-0 text-center text-[11px] font-bold text-gray-400">{row.position}</span>
      <div className="h-6 w-1 shrink-0 rounded-full" style={{ background: row.color }} />
      <PodiumImage row={row} size="xs" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-semibold leading-tight text-gray-900">{row.name}</div>
        <div className="truncate text-[10.5px] leading-tight text-gray-400">{row.subtitle}</div>
      </div>
      <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-gray-900">
        {row.points}
      </span>
    </div>
  );
}

function StandingsSection({
  title,
  caption,
  rows,
}: {
  title: string;
  caption: string;
  rows: StandingRow[];
}) {
  const top3 = rows.slice(0, 3);
  const half = Math.ceil(rows.length / 2);
  const colLeft = rows.slice(0, half);
  const colRight = rows.slice(half);

  return (
    <div className="rounded-3xl border border-gray-100 bg-white/90 p-4 sm:p-5 shadow-lg">
      <div className="mb-4">
        <h2 className="text-base font-bold leading-tight text-gray-900">{title}</h2>
        <p className="text-[11px] text-gray-400">{caption}</p>
      </div>

      {top3.length === 3 && (
        <div className="relative mb-4 overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg,#0A0F1E 0%,#131E30 55%,#2a0a13 100%)" }}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: `${top3[0].color}33` }} />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
          <div className="relative grid grid-cols-3 divide-x divide-white/10 px-1 py-5 sm:py-6">
            {[top3[1], top3[0], top3[2]].map((row, i) => {
              const isLeader = i === 1;
              const medal = medalColor(row.position);
              return (
                <div key={row.position} className={`flex flex-col items-center px-1.5 text-center ${isLeader ? "" : "opacity-95"}`}>
                  <div className="flex h-16 items-end justify-center">
                    <div
                      className="rounded-full"
                      style={{ boxShadow: `0 0 0 2px ${medal}, 0 0 18px ${medal}66` }}
                    >
                      <PodiumImage row={row} size={isLeader ? "lg" : "sm"} color={medal} />
                    </div>
                  </div>
                  <div className="mt-2.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: medal }}>
                    {row.position === 1 ? "Leader" : row.position === 2 ? "2e place" : "3e place"}
                  </div>
                  <div className="mt-0.5 w-full truncate text-sm sm:text-base font-bold text-white">{row.name}</div>
                  <div className="w-full truncate text-[10px] sm:text-[11px] text-gray-300">{row.subtitle}</div>
                  <div className="mt-1.5 text-lg sm:text-xl font-extrabold text-white">
                    {row.points}
                    <span className="ml-1 text-[10px] font-semibold text-white/70">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div>
          {colLeft.map((row) => <StandingsRow key={row.position} row={row} />)}
        </div>
        <div>
          {colRight.map((row) => <StandingsRow key={row.position} row={row} />)}
        </div>
      </div>
    </div>
  );
}

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

  const driverRows: StandingRow[] = drivers.map((d) => {
    const v = driverVisuals[d.driverId];
    return {
      position: d.position,
      name: d.name,
      subtitle: v?.team ?? "",
      points: d.points,
      color: v?.color ?? "#ccc",
      image: v?.photo ?? "/logos/f1.png",
      imageShape: "circle",
    };
  });

  const constructorRows: StandingRow[] = constructors.map((c) => {
    const v = constructorVisuals[c.teamId];
    return {
      position: c.position,
      name: c.name,
      subtitle: v?.drivers.join(" • ") ?? "",
      points: c.points,
      color: v?.color ?? "#ccc",
      image: v?.logo ?? "/logos/f1.png",
      imageShape: "logo",
    };
  });

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
            className="w-full lg:w-2/3 rounded-2xl py-5 text-center text-white shadow-lg"
            style={{ background: "linear-gradient(90deg,#0A0F1E 0%,#C41230 30%,#C41230 70%,#0A0F1E 100%)" }}
          >
            <div className="text-lg font-extrabold tracking-widest">CLASSEMENT PILOTES & ÉCURIES</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">

          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <>
                <div className="rounded-3xl border border-gray-100 bg-white/90 p-5 shadow-lg">
                  <Skeleton className="h-5 w-40 mb-5" />
                  <PodiumSkeleton />
                  <div className="mt-4">
                    <StandingsRowsSkeleton rows={8} />
                  </div>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-white/90 p-5 shadow-lg">
                  <Skeleton className="h-5 w-40 mb-5" />
                  <PodiumSkeleton />
                  <div className="mt-4">
                    <StandingsRowsSkeleton rows={7} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <StandingsSection
                  title="Classement pilotes"
                  caption="Points cumulés sur la saison"
                  rows={driverRows}
                />
                <StandingsSection
                  title="Classement constructeurs"
                  caption="Points cumulés par écurie"
                  rows={constructorRows}
                />
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
