"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, UserRound, Cog } from "lucide-react";

import SiteHeader from "../../components/SiteHeader";
import AdBanner from "../../components/AdBanner";
import WeatherCard from "../../components/WeatherCard";
import { FactCell, StatPanel } from "../../components/HeroPanels";
import { teams, type TeamPageData } from "../team-data";
import { driverPages } from "../../pilotes/driver-data";
import { calendar2026 } from "../../calendrier/calendar-data";
import { formatCountdown } from "../../lib/countdown";

// team.drivers sometimes spells a name differently (e.g. "Andrea Kimi Antonelli")
// than the canonical driver page (e.g. "Kimi Antonelli"), so match on the surname.
function findDriverPage(name: string) {
  const surname = name.trim().split(/\s+/).pop()?.toLowerCase();
  if (!surname) return undefined;
  return Object.values(driverPages).find((d) => d.name.toLowerCase().includes(surname));
}

export default function EcuriePageClient({ team }: { team: TeamPageData }) {
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
        const entry = (data.constructors ?? []).find((c: { teamId: string }) => c.teamId === team.standingsId);
        if (!cancelled && entry) setSeasonStanding({ position: entry.position, points: entry.points });
      } catch (e) {
        console.error(e);
      }
    }

    async function loadSeasonSummary() {
      try {
        const res = await fetch("/api/season-stats", { cache: "no-store" });
        const data = await res.json();
        const entry = data.teams?.[team.standingsId];
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
  }, [team.standingsId]);

  const hasChampions = team.champions.length > 0;

  const palmares = team.stats.map((stat) => ({ label: stat.label, value: stat.value }));

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
              {[...teams, ...teams].map((item, i) => (
                <Link
                  key={`${item.link}-${i}`}
                  href={item.link}
                  className="flex items-center justify-center bg-white shadow-md hover:shadow-xl rounded-2xl w-[140px] h-[80px] transition-all shrink-0"
                >
                  <img src={item.logo} alt={item.name} className="max-h-[40px] max-w-[100px] object-contain" />
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
                style={{ background: `linear-gradient(115deg, ${team.accentColor} 0%, ${team.accentColor}99 30%, transparent 55%)` }}
              />

              <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 px-5 sm:px-8 pt-6 sm:pt-8">
                <div
                  className={`flex h-32 w-32 sm:h-44 sm:w-44 items-center justify-center ${
                    team.heroLogoNeedsBg ? "rounded-2xl bg-white/95 shadow-xl p-4" : ""
                  }`}
                >
                  <img
                    src={team.heroLogo ?? team.logo}
                    alt={team.navName}
                    className={`max-h-full max-w-full object-contain ${team.heroLogoNeedsBg ? "" : "drop-shadow-xl"}`}
                  />
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="truncate text-2xl sm:text-4xl font-black italic tracking-tight text-white leading-none">
                    {team.displayName}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                    {team.subtitle}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-center sm:items-end gap-2">
                  {team.drivers.map((name) => {
                    const driver = findDriverPage(name);
                    return (
                      <Link
                        key={name}
                        href={driver ? `/pilotes/${driver.slug}` : "/pilotes"}
                        className="flex items-center gap-2 group"
                      >
                        <div className="text-right">
                          <div className="text-sm font-bold text-white group-hover:underline">{driver?.name ?? name}</div>
                        </div>
                        <img
                          src={driver?.image ?? "/logos/f1.png"}
                          alt={driver?.name ?? name}
                          className="h-9 w-9 rounded-full object-cover border border-white/20"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/10 border-t border-white/10 bg-black/30">
                <FactCell icon={CalendarDays} label="En F1 depuis" value={team.founded} />
                <FactCell icon={MapPin} label="Siège" value={team.base} />
                <FactCell icon={UserRound} label="Directeur d'équipe" value={team.teamPrincipal} />
                <FactCell icon={Cog} label="Motorisation" value={team.powerUnit} />
              </div>

              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 p-5 sm:p-6">
                <StatPanel title="Palmarès" rows={palmares} />
                <StatPanel title="Cette saison" live rows={seasonRows} />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 shadow-2xl rounded-3xl border border-gray-100">

              <h2 className="text-xl font-bold mb-4" style={{ color: team.accentColor }}>
                {team.historyHeading}
              </h2>

              <div className="space-y-3 border-l-2 pl-4 mb-8 sm:mb-10" style={{ borderColor: `${team.accentColor}55` }}>
                {team.history.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-6" style={{ color: team.accentColor }}>
                {team.titlesHeading}
              </h2>

              {hasChampions ? (
                <div>
                  {team.champions.map((item, i) => (
                    <div key={`${item.year}-${item.driver}`} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < team.champions.length - 1 && (
                        <span className="absolute left-[7px] top-4 bottom-0 w-px bg-gray-200" />
                      )}
                      <span
                        className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow"
                        style={{ background: team.accentColor }}
                      />
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <div>
                          <div className="text-xs font-bold" style={{ color: team.accentColor }}>{item.year}</div>
                          <div className="mt-0.5 text-sm font-semibold text-gray-900">{item.driver}</div>
                        </div>
                        {item.img && (
                          <img src={item.img} alt={item.driver} className="h-9 w-9 rounded-full object-cover border border-gray-200 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative w-[300px] mx-auto text-center">
                  <img
                    src={team.emptyState?.image ?? "/images/chargement.png"}
                    alt={team.emptyState?.title ?? "Pas encore de titre"}
                    className="h-24 mb-4 opacity-80 mx-auto"
                  />
                  <p className="text-sm text-gray-700 font-semibold">
                    {team.emptyState?.title ?? "Chargement des trophees..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {team.emptyState?.description ?? "Veuillez patienter quelques saisons."}
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
