"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Ruler, Weight, Flag } from "lucide-react";

import SiteHeader from "../../components/SiteHeader";
import AdBanner from "../../components/AdBanner";
import WeatherCard from "../../components/WeatherCard";
import { FactCell, StatPanel } from "../../components/HeroPanels";
import { teams } from "../../ecuries/team-data";
import { type DriverPageData } from "../driver-data";
import { calendar2026 } from "../../calendrier/calendar-data";
import { formatCountdown } from "../../lib/countdown";

function statValue(stats: DriverPageData["stats"], label: string) {
  return stats.find((s) => s.label === label)?.value ?? "0";
}

export default function PilotePageClient({ driver }: { driver: DriverPageData }) {
  const [currentTimestamp] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ?? calendar2026[calendar2026.length - 1];

  const [seasonStanding, setSeasonStanding] = useState<{ position: number; points: number } | null>(null);
  const [seasonSummary, setSeasonSummary] = useState<{ wins: number; podiums: number; poles: number } | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStanding() {
      try {
        const res = await fetch("/api/standings", { cache: "no-store" });
        const data = await res.json();
        const entry = (data.drivers ?? []).find((d: { driverId: string }) => d.driverId === driver.standingsId);
        if (!cancelled && entry) setSeasonStanding({ position: entry.position, points: entry.points });
      } catch (e) {
        console.error(e);
      }
    }

    async function loadSeasonSummary() {
      try {
        const res = await fetch("/api/season-stats", { cache: "no-store" });
        const data = await res.json();
        const entry = data.drivers?.[driver.standingsId];
        if (!cancelled) setSeasonSummary(entry ?? { wins: 0, podiums: 0, poles: 0 });
      } catch (e) {
        console.error(e);
      }
    }

    loadStanding();
    loadSeasonSummary();
    return () => {
      cancelled = true;
    };
  }, [driver.standingsId]);

  const hasHighlights = driver.highlights.length > 0;

  const palmares = [
    { label: "Titre mondial", value: statValue(driver.stats, "Titres mondiaux") },
    { label: "Victoires", value: statValue(driver.stats, "Victoires") },
    { label: "Podiums", value: statValue(driver.stats, "Podiums") },
    { label: "Poles", value: driver.poles },
    { label: "Meilleurs tours", value: driver.fastestLaps },
  ];

  const seasonRows = [
    { label: "Position au championnat", value: seasonStanding ? `${seasonStanding.position}e` : "…" },
    { label: "Points", value: seasonStanding ? String(seasonStanding.points) : "…" },
    { label: "Victoires", value: seasonSummary ? String(seasonSummary.wins) : "…" },
    { label: "Podiums", value: seasonSummary ? String(seasonSummary.podiums) : "…" },
    { label: "Poles", value: seasonSummary ? String(seasonSummary.poles) : "…" },
  ];

  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <AdBanner variant="horizontal" bare />

        <SiteHeader />

        <div className="bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 overflow-hidden">
            <div className="flex gap-6 w-max animate-marquee">
              {[...teams, ...teams].map((team, i) => (
                <Link
                  key={`${team.link}-${i}`}
                  href={team.link}
                  className="flex items-center justify-center bg-white shadow-md hover:shadow-xl rounded-2xl w-[140px] h-[80px] transition-all shrink-0"
                >
                  <img src={team.logo} alt={team.name} className="max-h-[40px] max-w-[100px] object-contain" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
          <div className="lg:col-span-2 space-y-6">

            <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ background: "#0A0F1E" }}>
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-48 sm:h-60 w-full sm:w-2/3 opacity-70"
                style={{ background: `linear-gradient(115deg, ${driver.accentColor} 0%, ${driver.accentColor}99 30%, transparent 55%)` }}
              />
              <div className="pointer-events-none absolute -left-2 -top-6 select-none text-[7rem] sm:text-[9rem] font-black italic leading-none text-white/10">
                {driver.number}
              </div>

              <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 px-5 sm:px-8 pt-6 sm:pt-8">
                <img
                  src={driver.profileImage ?? driver.image}
                  alt={driver.name}
                  className="h-32 w-32 sm:h-44 sm:w-44 rounded-2xl object-cover object-top shadow-xl ring-1 ring-white/10"
                />

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="truncate text-2xl sm:text-4xl font-black italic tracking-tight text-white leading-none">
                    {driver.name}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                    {driver.nationality}
                  </div>
                </div>

                <Link href={`/ecuries/${driver.teamSlug}`} className="flex shrink-0 items-center gap-3 group">
                  <img src={driver.teamLogo} alt={driver.teamName} className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
                  <div className="text-right">
                    <div className="text-sm font-bold text-white group-hover:underline">{driver.teamName}</div>
                    <div className="text-xs text-gray-300">N°{driver.number}</div>
                  </div>
                </Link>
              </div>

              <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/10 border-t border-white/10 bg-black/30">
                <FactCell icon={Calendar} label="Date de naissance" value={driver.birthDate} sub={driver.age} />
                <FactCell icon={MapPin} label="Lieu de naissance" value={driver.birthPlace} />
                <FactCell icon={Ruler} label="Taille" value={driver.height} />
                <FactCell icon={Weight} label="Poids" value={driver.weight} />
              </div>

              <div className="relative flex items-center gap-2.5 border-t border-white/10 px-3 sm:px-4 py-3 text-xs text-gray-300">
                <Flag className="h-4 w-4 shrink-0" />
                Débuts en F1 : <span className="font-semibold text-white">{driver.debutYear}</span> avec{" "}
                <span className="font-semibold text-white">{driver.debutTeam}</span>
              </div>

              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 p-5 sm:p-6">
                <StatPanel title="Palmarès" rows={palmares} />
                <StatPanel title="Cette saison" live rows={seasonRows} />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 shadow-2xl rounded-3xl border border-gray-100">

              <h2 className="text-xl font-bold mb-4" style={{ color: driver.accentColor }}>
                Biographie
              </h2>

              <div className="space-y-3 border-l-2 pl-4 mb-8 sm:mb-10" style={{ borderColor: `${driver.accentColor}55` }}>
                {driver.bio.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-6" style={{ color: driver.accentColor }}>
                Parcours et faits marquants
              </h2>

              {hasHighlights ? (
                <div>
                  {driver.highlights.map((item, i) => (
                    <div key={`${item.year}-${item.title}`} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < driver.highlights.length - 1 && (
                        <span className="absolute left-[7px] top-4 bottom-0 w-px bg-gray-200" />
                      )}
                      <span
                        className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow"
                        style={{ background: driver.accentColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold" style={{ color: driver.accentColor }}>{item.year}</div>
                        <div className="mt-0.5 text-sm font-semibold text-gray-900">{item.title}</div>
                        <div className="mt-1 text-xs text-gray-500 leading-relaxed">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative w-[300px] mx-auto text-center">
                  <img
                    src={driver.emptyState?.image ?? "/images/chargement.png"}
                    alt={driver.emptyState?.title ?? "Aucun fait marquant"}
                    className="h-24 mb-4 opacity-80 mx-auto"
                  />
                  <p className="text-sm text-gray-700 font-semibold">
                    {driver.emptyState?.title ?? "Chargement du palmares..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {driver.emptyState?.description ?? "Les prochains resultats arriveront bientot."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C41230]" />
                <div className="font-bold text-gray-900 text-sm tracking-wide">Prochain Grand Prix</div>
              </div>
              <div className="space-y-2">
                <div className="text-base font-black text-gray-900 leading-tight">{nextRace.grandPrix}</div>
                <div className="text-sm text-gray-500">{nextRace.location}</div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Date de course</div>
                  <div className="mt-1 text-sm font-bold text-gray-900">{nextRace.raceDateLabel} · {nextRace.raceTime}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
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

            <div className="sticky top-6 bg-gray-100 p-8 shadow-xl flex items-center justify-center min-h-[500px] border border-gray-200 rounded-3xl">
              ESPACE PUBLICITE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
