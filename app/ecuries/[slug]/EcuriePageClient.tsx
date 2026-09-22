"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import SiteHeader from "../../components/SiteHeader";
import AdBanner from "../../components/AdBanner";
import WeatherCard from "../../components/WeatherCard";
import { teams, type TeamPageData } from "../team-data";
import { calendar2026 } from "../../calendrier/calendar-data";

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

export default function EcuriePageClient({ team }: { team: TeamPageData }) {
  const [currentTimestamp] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ?? calendar2026[calendar2026.length - 1];

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const hasChampions = team.champions.length > 0;
  const minWidthClass = team.champions.length > 8 ? "min-w-[1100px]" : "w-[300px] mx-auto";

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

        <div className="max-w-7xl mx-auto px-4">
          <div
            className="w-full lg:w-2/3 text-white rounded-2xl shadow-xl px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-2"
            style={{ background: team.gradient }}
          >
            <div className="flex items-center gap-4">
              <img src={team.logo} alt={team.navName} className="h-10 w-auto object-contain drop-shadow-md" />

              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-wide">{team.displayName}</span>
                <span className={`text-xs ${team.subtitleClassName ?? "font-extrabold tracking-wide"}`}>
                  {team.subtitle}
                </span>
              </div>
            </div>

            <div className="text-right text-sm">
              {team.drivers.map((driver) => (
                <div key={driver} className="font-semibold">
                  {driver}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-4 sm:p-10 shadow-2xl rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold mt-4 sm:mt-10 mb-6" style={{ color: team.accentColor }}>
              {team.titlesHeading}
            </h2>

            <div className="overflow-x-auto pb-8">
              {hasChampions ? (
                <div className={`relative ${minWidthClass}`}>
                  <div
                    className="absolute top-10 left-0 w-full h-1"
                    style={{ background: team.accentColor }}
                  />

                  <div className="flex justify-between">
                    {team.champions.map((item) => (
                      <div key={`${item.year}-${item.driver}`} className="flex flex-col items-center text-center group">
                        <div className="text-xs font-bold text-gray-700 mb-3">{item.year}</div>

                        <div
                          className="w-5 h-5 rounded-full border-4 border-white shadow-lg z-10"
                          style={{ background: team.accentColor }}
                        />

                        <div className="text-lg mt-2">🏆</div>

                        {item.img ? (
                          <img
                            src={item.img}
                            alt={item.driver}
                            className="h-10 w-10 rounded-full object-cover mt-2 border border-gray-200 shadow-sm group-hover:scale-110 transition"
                          />
                        ) : (
                          <div className="h-10 w-10 mt-2 rounded-full border border-gray-200 shadow-sm bg-gray-100 text-[10px] font-bold text-gray-600 flex items-center justify-center px-1">
                            {item.driver
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 3)}
                          </div>
                        )}

                        <div className="text-xs text-gray-500 mt-2">{item.driver}</div>
                      </div>
                    ))}
                  </div>
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

            <h2 className="text-xl font-bold mt-6 sm:mt-10 mb-6" style={{ color: team.accentColor }}>
              {team.historyHeading}
            </h2>

            {team.history.map((paragraph) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}

            <h2 className="text-xl font-bold mt-6 sm:mt-10 mb-6" style={{ color: team.accentColor }}>
              Palmares en Formule 1
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
              {team.stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-extrabold" style={{ color: team.accentColor }}>
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:-mt-24">
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
