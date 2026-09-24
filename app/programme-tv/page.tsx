"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import SiteHeader from "../components/SiteHeader";
import AdBanner from "../components/AdBanner";
import { teams } from "../ecuries/team-data";
import { calendar2026 } from "../calendrier/calendar-data";

const channels = [
  {
    name: "Canal+",
    logo: "/logos/canalplus.svg",
    type: "Télévision",
    badge: "Diffuseur officiel",
    badgeColor: "bg-blue-600",
    description: "Toutes les sessions en direct et en exclusivité : essais libres, qualifications, sprint et course.",
    sessions: ["EL1", "EL2", "EL3", "Qualifs Sprint", "Sprint", "Qualifications", "Course"],
    accent: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
    headerBg: "bg-gradient-to-r from-[#0A0A6B] to-[#1a1a9b]",
  },
  {
    name: "F1 TV Pro",
    logo: "/logos/f1tv.svg",
    type: "Streaming",
    badge: "Officiel F1",
    badgeColor: "bg-red-600",
    description: "La plateforme de streaming officielle de la F1 avec toutes les sessions, les caméras embarquées et le son radio.",
    sessions: ["EL1", "EL2", "EL3", "Qualifs Sprint", "Sprint", "Qualifications", "Course"],
    accent: "border-red-200 bg-gradient-to-br from-red-50 to-rose-50",
    headerBg: "bg-gradient-to-r from-[#C41230] to-[#9B0F27]",
  },
];

function getSessionOffset(sessionLabel: string, format: "standard" | "sprint") {
  if (sessionLabel === "Course") return 0;
  if (format === "sprint") {
    if (sessionLabel === "EL1" || sessionLabel === "Qualifs Sprint") return -2;
    return -1;
  }
  if (sessionLabel === "EL1" || sessionLabel === "EL2") return -2;
  return -1;
}

function formatSessionDate(raceIso: string, sessionLabel: string, format: "standard" | "sprint") {
  const raceDate = new Date(raceIso);
  const offset = getSessionOffset(sessionLabel, format);
  const sessionDate = new Date(raceDate);
  sessionDate.setDate(raceDate.getDate() + offset);
  return sessionDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatCountdown(nowTimestamp: number, targetIso: string) {
  const diff = new Date(targetIso).getTime() - nowTimestamp;
  if (diff <= 0) return "En cours ou passé";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days}j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export default function ProgrammeTVPage() {
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTimestamp(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const nextRace =
    calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ??
    calendar2026[calendar2026.length - 1];

  const followingRaces = calendar2026
    .filter((r) => r.round > nextRace.round)
    .slice(0, 5);

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

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 pt-5">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0A0F1E] via-[#0F172A] to-[#1C2438] p-6 text-white shadow-2xl">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-1/3 bottom-0 h-36 w-36 rounded-full bg-red-400/10 blur-3xl" />

            <div className="relative grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Programme TV</div>
                <h1 className="mt-2 text-2xl font-black tracking-tight md:text-[2rem]">
                  Saison F1 2026 — Quand et où regarder ?
                </h1>
                <p className="mt-3 text-sm text-white/65 max-w-lg">
                  Retrouvez tous les horaires de diffusion des sessions F1 en France. Essais libres, qualifications, sprint et courses — rien ne vous échappe.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <img src="/logos/canalplus.svg" alt="Canal+" className="h-6 w-auto" />
                    <span className="text-xs text-white/80 font-medium">Toutes sessions</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <img src="/logos/f1tv.svg" alt="F1 TV Pro" className="h-6 w-auto" />
                    <span className="text-xs text-white/80 font-medium">Streaming</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm shadow-xl">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">Prochain Grand Prix</div>
                <div className="mt-2 text-xl font-black leading-tight">{nextRace.grandPrix}</div>
                <div className="mt-1 text-sm text-white/75">
                  {nextRace.location} · {nextRace.dateRange}
                </div>
                <div className="mt-3 grid grid-cols-[auto_1fr] gap-2">
                  <div className="rounded-2xl bg-white/10 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">Course</div>
                    <div className="mt-1 text-lg font-extrabold">{nextRace.raceTime}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">Compte à rebours</div>
                    <div className="mt-1 text-base sm:text-lg font-extrabold tabular-nums whitespace-nowrap" suppressHydrationWarning>{formatCountdown(currentTimestamp, nextRace.raceDateIso)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.45fr_0.75fr] gap-5 px-4 py-6">

          {/* Colonne principale */}
          <div className="space-y-5">

            {/* Ce week-end */}
            <section className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white/80 shadow-xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-[#0A0F1E] to-[#1C2438] px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">Ce week-end</div>
                  <div className="mt-1 text-lg font-black text-white">{nextRace.grandPrix}</div>
                  <div className="text-sm text-white/65">{nextRace.location} · {nextRace.dateRange}</div>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-xs font-bold text-white ${nextRace.format === "sprint" ? "bg-red-600" : "bg-slate-600"}`}>
                  {nextRace.format === "sprint" ? "Week-end Sprint" : "Week-end Standard"}
                </span>
              </div>

              <div className="p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400 mb-3">Sessions & diffusion</div>

                <div className="space-y-2">
                  {nextRace.sessions.map((session) => {
                    const isCourse = session.label === "Course";
                    return (
                      <div
                        key={session.label}
                        className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-4 rounded-2xl border px-4 py-3 ${
                          isCourse
                            ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
                            : "border-gray-100 bg-gray-50/60"
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold uppercase tracking-[0.16em] ${isCourse ? "text-red-600" : "text-gray-400"}`}>
                            {session.label}
                            {isCourse && <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white normal-case tracking-normal">Événement principal</span>}
                          </div>
                          <div className="mt-0.5 text-[11px] capitalize text-gray-500">
                            {formatSessionDate(nextRace.raceDateIso, session.label, nextRace.format)}
                          </div>
                        </div>

                        <div className={`text-base font-extrabold ${isCourse ? "text-red-700" : "text-gray-800"}`}>
                          {session.time}
                        </div>

                        <div className="hidden sm:flex flex-row gap-2 items-center justify-center">
                          <img src="/logos/canalplus.svg" alt="Canal+" className="h-6 w-auto rounded" />
                          <img src="/logos/f1tv.svg" alt="F1 TV Pro" className="h-6 w-auto rounded" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/circuits/${nextRace.circuitSlug}`}
                    className="inline-flex items-center rounded-full bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#C41230]"
                  >
                    Voir la fiche circuit
                  </Link>
                </div>
              </div>
            </section>

            {/* Prochaines diffusions */}
            {followingRaces.length > 0 && (
              <section className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C41230] mb-1">À venir</div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Prochaines diffusions</h2>

                <div className="space-y-2.5">
                  {followingRaces.map((race) => {
                    const raceSession = race.sessions.find((s) => s.label === "Course");
                    return (
                      <div
                        key={race.round}
                        className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-gray-100 bg-gradient-to-r from-[#f3f4f8] to-[#eceef5] px-4 py-3"
                      >
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Round {race.round}</div>
                          <div className="mt-0.5 text-sm font-bold text-gray-900">{race.grandPrix}</div>
                          <div className="text-xs text-gray-500">{race.location} · {race.raceDateLabel}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Course</div>
                          <div className="text-base font-extrabold text-gray-900">{raceSession?.time ?? race.raceTime}</div>
                          <div className="mt-1 flex gap-1 justify-end">
                            <img src="/logos/canalplus.svg" alt="Canal+" className="h-5 w-auto rounded" />
                            <img src="/logos/f1tv.svg" alt="F1 TV Pro" className="h-5 w-auto rounded" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <Link
                    href="/calendrier"
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Voir tout le calendrier
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* Où regarder la F1 */}
            <div className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C41230] mb-1">Diffusion</div>
              <h2 className="text-base font-black text-gray-900 mb-4">Où regarder la F1 ?</h2>

              <div className="space-y-3">
                {channels.map((channel) => (
                  <div key={channel.name} className={`overflow-hidden rounded-2xl border ${channel.accent}`}>
                    <div className={`${channel.headerBg} px-4 py-2.5 flex items-center justify-between`}>
                      <img src={channel.logo} alt={channel.name} className="h-7 w-auto" />
                      <span className={`rounded-full ${channel.badgeColor} px-2.5 py-0.5 text-[10px] font-bold text-white`}>
                        {channel.badge}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 mb-1">{channel.type}</div>
                      <p className="text-xs text-gray-600 leading-relaxed">{channel.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {channel.sessions.map((s) => (
                          <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prochaine course rapide */}
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
                  <div className="mt-1 text-lg font-extrabold tabular-nums whitespace-nowrap text-[#C41230]" suppressHydrationWarning>
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

            {/* Pub */}
            <AdBanner variant="vertical" />
          </aside>
        </div>
      </div>
    </div>
  );
}
