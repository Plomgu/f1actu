"use client";

import Link from "next/link";
import { useState } from "react";

import SiteHeader from "../../components/SiteHeader";
import AdBanner from "../../components/AdBanner";
import WeatherCard from "../../components/WeatherCard";
import { teams } from "../../ecuries/team-data";
import { type DriverPageData } from "../driver-data";
import { calendar2026 } from "../../calendrier/calendar-data";

function formatCountdown(nowTimestamp: number, targetIso: string) {
  const diff = new Date(targetIso).getTime() - nowTimestamp;
  if (diff <= 0) return "En cours ou passé";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days} j ${hours} h`;
}

export default function PilotePageClient({ driver }: { driver: DriverPageData }) {
  const [currentTimestamp] = useState(() => Date.now());
  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ?? calendar2026[calendar2026.length - 1];

  const hasHighlights = driver.highlights.length > 0;
  const timelineMinWidth = Math.max(420, driver.highlights.length * 180);

  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40">
        <SiteHeader />

        <div className="px-4 py-4">
          <AdBanner variant="horizontal" />
        </div>

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
            className="w-full lg:w-2/3 text-white rounded-2xl shadow-xl px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-2"
            style={{ background: driver.gradient }}
          >
            <div className="flex items-center gap-4">
              <img src={driver.image} alt={driver.name} className="h-14 w-14 rounded-full object-cover border border-white/30" />

              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-wide">{driver.name}</span>
                <span className="text-xs text-white/80">{driver.subtitle}</span>
              </div>
            </div>

            <div className="text-right text-sm">
              <div className="font-semibold">#{driver.number}</div>
              <div className="font-semibold">{driver.teamName}</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-4 sm:p-10 shadow-2xl rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold mt-4 sm:mt-10 mb-6" style={{ color: driver.accentColor }}>
              Parcours et faits marquants
            </h2>

            <div className="overflow-x-auto pb-8">
              {hasHighlights ? (
                <div className="relative mx-auto" style={{ minWidth: `${timelineMinWidth}px` }}>
                  <div className="absolute top-10 left-0 w-full h-1" style={{ background: driver.accentColor }} />

                  <div className="flex justify-between gap-6">
                    {driver.highlights.map((item) => (
                      <div key={`${item.year}-${item.title}`} className="flex flex-col items-center text-center group min-w-[160px]">
                        <div className="text-xs font-bold text-gray-700 mb-3">{item.year}</div>
                        <div
                          className="w-5 h-5 rounded-full border-4 border-white shadow-lg z-10"
                          style={{ background: driver.accentColor }}
                        />
                        <div className="text-lg mt-2">🏎</div>
                        <div className="text-sm font-semibold text-gray-800 mt-2">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-2">{item.description}</div>
                      </div>
                    ))}
                  </div>
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

            <h2 className="text-xl font-bold mt-6 sm:mt-10 mb-6" style={{ color: driver.accentColor }}>
              Biographie
            </h2>

            {driver.bio.map((paragraph) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}

            <h2 className="text-xl font-bold mt-6 sm:mt-10 mb-6" style={{ color: driver.accentColor }}>
              Chiffres cles
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
              {driver.stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-extrabold" style={{ color: driver.accentColor }}>
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:-mt-24">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <div className="font-bold text-[#C41230] mb-4 text-sm tracking-wider">FICHE PILOTE</div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <img src={driver.teamLogo} alt={driver.teamName} className="h-8 w-8 object-contain" />
                  <Link href={`/ecuries/${driver.teamSlug}`} className="font-semibold hover:text-[#C41230] transition">
                    {driver.teamName}
                  </Link>
                </div>
                <div>Nationalite: {driver.nationality}</div>
                <div>Age: {driver.age}</div>
                <div>Numero: #{driver.number}</div>
              </div>
            </div>

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

            <div className="sticky top-6 bg-gray-100 p-8 shadow-xl flex items-center justify-center min-h-[500px] border border-gray-200 rounded-3xl">
              ESPACE PUBLICITE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
