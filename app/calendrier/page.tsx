"use client";

import Link from "next/link";
import { useState } from "react";

import SiteHeader from "../components/SiteHeader";
import AdBanner from "../components/AdBanner";
import { teams } from "../ecuries/team-data";
import { calendar2026, cancelledRaces2026 } from "./calendar-data";

const monthAccent: Record<string, string> = {
  mars: "from-sky-500 to-blue-600",
  mai: "from-emerald-500 to-teal-600",
  juin: "from-slate-500 to-slate-700",
  juillet: "from-indigo-500 to-blue-600",
  aout: "from-teal-500 to-cyan-600",
  septembre: "from-orange-500 to-rose-600",
  octobre: "from-amber-500 to-orange-600",
  novembre: "from-rose-500 to-red-700",
  decembre: "from-slate-500 to-slate-700",
};

function getMonthLabel(dateLabel: string) {
  return dateLabel.split(" ")[1] ?? "";
}

function formatCountdown(nowTimestamp: number, targetIso: string) {
  const target = new Date(targetIso);
  const diff = target.getTime() - nowTimestamp;

  if (diff <= 0) {
    return "En cours ou deja dispute";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days} j ${hours} h`;
}

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

export default function CalendrierPage() {
  const [currentTimestamp] = useState(() => Date.now());
  const nextRace =
    calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ??
    calendar2026[calendar2026.length - 1];
  const groupedByMonth = calendar2026.reduce<Record<string, typeof calendar2026>>((acc, race) => {
    const month = getMonthLabel(race.raceDateLabel);
    if (!acc[month]) acc[month] = [];
    acc[month].push(race);
    return acc;
  }, {});

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

        <div className="max-w-7xl mx-auto px-4 pt-5">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0A0F1E] via-[#0F172A] to-[#1C2438] p-5 text-white shadow-2xl">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-1/3 bottom-0 h-36 w-36 rounded-full bg-fuchsia-300/10 blur-3xl" />

            <div className="relative grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">Calendrier F1 2026</div>
                <h1 className="mt-2 max-w-3xl text-2xl font-black tracking-tight md:text-[2rem]">
                  Toutes les dates et horaires des Grands Prix 2026.
                </h1>
              </div>

              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm shadow-xl">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">Prochain Grand Prix</div>
                <div className="mt-2 text-xl font-black leading-tight">{nextRace.grandPrix}</div>
                <div className="mt-1 text-sm text-white/75">
                  {nextRace.location} • {nextRace.raceDateLabel}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/10 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">Depart</div>
                    <div className="mt-1 text-lg font-extrabold">{nextRace.raceTime}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">Compte a rebours</div>
                    <div className="mt-1 text-lg font-extrabold">{formatCountdown(currentTimestamp, nextRace.raceDateIso)}</div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-white/12 bg-[#0B1120]/30 px-3 py-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">Format</div>
                    <div className="mt-1 text-sm font-semibold">
                      {nextRace.format === "sprint" ? "Week-end sprint" : "Week-end classique"}
                    </div>
                  </div>
                  <Link
                    href={`/circuits/${nextRace.circuitSlug}`}
                    className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#0F172A] transition hover:bg-red-50"
                  >
                    Voir le circuit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="animate-redNeonBorderPulse rounded-3xl border border-red-400/60 bg-white/90 p-3.5">
            <div>
              <div className="inline-flex items-center rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-extrabold tracking-[0.2em] text-red-600">
                MISE A JOUR IMPORTANTE
              </div>
              <div className="mt-2.5 grid gap-2 md:grid-cols-2">
                {cancelledRaces2026.map((race) => (
                  <div
                    key={race.grandPrix}
                    className="rounded-2xl border border-red-100 bg-red-50/70 px-3 py-2.5"
                  >
                    <div className="text-sm font-bold leading-tight text-gray-900">{race.grandPrix}</div>
                    <div className="mt-1 text-xs text-gray-500">Date initiale: {race.plannedDate}</div>
                    <div className="mt-1 text-xs text-red-600">
                      {race.note
                        .replace("Annule", "Annulé")
                        .replace("mise a jour", "mise à jour")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.45fr_0.75fr] gap-5 px-4 pb-6">
          <div className="space-y-5">
            {Object.entries(groupedByMonth).map(([month, races]) => (
              <section key={month} className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C41230]">Mois</div>
                    <h2 className="mt-1 text-xl font-black capitalize text-gray-900">{month}</h2>
                  </div>
                  <div className={`rounded-full bg-gradient-to-r px-4 py-2 text-xs font-bold text-white ${monthAccent[month] ?? "from-violet-500 to-indigo-600"}`}>
                    {races.length} week-end{races.length > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {races.map((race) => (
                    <article key={race.round} className="overflow-hidden rounded-[1.5rem] border border-gray-200 bg-gradient-to-r from-[#f3f4f8] to-[#eceef5] shadow-sm">
                      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="border-b border-gray-200 p-4 lg:border-b-0 lg:border-r">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">Round {race.round}</div>
                              <h3 className="mt-1.5 text-lg font-black text-gray-900">{race.grandPrix}</h3>
                              <div className="mt-1 text-sm text-gray-500">{race.location}</div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${race.format === "sprint" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                              {race.format === "sprint" ? "Sprint" : "Standard"}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2.5">
                            <div className="rounded-2xl border border-slate-200 bg-slate-100/80 px-3 py-2.5">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Week-end</div>
                              <div className="mt-1 text-sm font-bold text-gray-900">{race.dateRange}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-100/80 px-3 py-2.5">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Course</div>
                              <div className="mt-1 text-sm font-bold text-gray-900">
                                {race.raceDateLabel} • {race.raceTime}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <Link
                              href={`/circuits/${race.circuitSlug}`}
                              className="inline-flex items-center rounded-full bg-[#0F172A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#C41230]"
                            >
                              Ouvrir la fiche circuit
                            </Link>
                          </div>
                        </div>

                        <div className="bg-white/25 p-4">
                          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">Sessions</div>
                          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                            {race.sessions.map((session) => (
                              <div key={`${race.round}-${session.label}`} className="rounded-2xl border border-gray-200 bg-white/85 px-3 py-2.5 shadow-sm">
                                <div className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">{session.label}</div>
                                <div className="mt-1 text-xs text-gray-500">
                                  {formatSessionDate(race.raceDateIso, session.label, race.format)}
                                </div>
                                <div className="mt-1 text-sm font-semibold text-gray-900">{session.time}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C41230]">Sprint 2026</div>
              <div className="mt-3 space-y-2">
                {calendar2026
                  .filter((race) => race.format === "sprint")
                  .map((race) => (
                    <div key={race.round} className="rounded-2xl border border-red-100 bg-red-50/60 px-3 py-2.5">
                      <div className="text-sm font-bold text-gray-900">{race.grandPrix}</div>
                      <div className="mt-1 text-xs text-gray-500">{race.raceDateLabel}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="sticky top-6 rounded-[1.75rem] border border-gray-200 bg-gray-100 p-6 shadow-xl min-h-[280px] flex items-center justify-center">
              ESPACE PUBLICITE
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
