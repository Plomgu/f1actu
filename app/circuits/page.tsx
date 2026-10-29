import type { Metadata } from "next";
import Link from "next/link";

import HubPageShell from "../components/HubPageShell";
import JsonLd, { breadcrumb, itemList } from "../components/JsonLd";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import { circuitPages, type CircuitPageData } from "./circuit-data";
import { calendar2026, cancelledRaces2026, type CalendarRace } from "../calendrier/calendar-data";

const races = calendar2026
  .map((race) => ({ race, circuit: circuitPages[race.circuitSlug] }))
  .filter((entry): entry is { race: CalendarRace; circuit: CircuitPageData } => Boolean(entry.circuit));

const scheduledSlugs = new Set(calendar2026.map((race) => race.circuitSlug));
const cancelledCircuits = Object.values(circuitPages).filter((circuit) => !scheduledSlugs.has(circuit.slug));
const sprintCount = calendar2026.filter((race) => race.format === "sprint").length;

/** « 8 mars 2026 » → « mars ». */
function monthOf(race: CalendarRace) {
  return race.raceDateLabel.split(" ")[1] ?? "";
}

const first = races[0];
const last = races[races.length - 1];

const title = "Circuits F1 2026 : les tracés de la saison";
const description = `Les ${races.length} circuits du championnat de Formule 1 2026, de ${first.circuit.circuitName} à ${last.circuit.circuitName} : dates, longueur, nombre de tours et caractéristiques de chaque tracé.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/circuits` },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/circuits`,
  },
};

function CircuitCard({ circuit, race }: { circuit: CircuitPageData; race?: CalendarRace }) {
  return (
    <Link
      href={`/circuits/${circuit.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="relative flex h-36 items-center justify-center p-3" style={{ background: circuit.gradient }}>
        <img
          src={circuit.image}
          alt={`Tracé du circuit ${circuit.circuitName}`}
          loading="lazy"
          className="max-h-full max-w-[85%] object-contain drop-shadow-lg transition group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
            {race ? `Manche ${race.round}` : "Annulé"}
          </span>
          {race?.format === "sprint" && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Sprint</span>
          )}
        </div>
        <h3 className="text-base font-black leading-tight text-gray-900 group-hover:text-[#C41230] transition">
          {circuit.grandPrix}
        </h3>
        <div className="mt-1 text-xs text-gray-500">
          {circuit.circuitName} · {circuit.location}
        </div>

        <dl className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-slate-100/80 px-2 py-1.5">
            <dt className="text-[9px] uppercase tracking-[0.14em] text-slate-500">Course</dt>
            <dd className="mt-0.5 text-xs font-bold text-gray-900">{race ? race.raceDateLabel.replace(" 2026", "") : "Annulée"}</dd>
          </div>
          <div className="rounded-xl bg-slate-100/80 px-2 py-1.5">
            <dt className="text-[9px] uppercase tracking-[0.14em] text-slate-500">Longueur</dt>
            <dd className="mt-0.5 text-xs font-bold text-gray-900">{circuit.length}</dd>
          </div>
          <div className="rounded-xl bg-slate-100/80 px-2 py-1.5">
            <dt className="text-[9px] uppercase tracking-[0.14em] text-slate-500">Tours</dt>
            <dd className="mt-0.5 text-xs font-bold text-gray-900">{circuit.laps}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

export default function CircuitsPage() {
  return (
    <HubPageShell
      eyebrow="Saison 2026"
      title="Tous les circuits de Formule 1 en 2026"
      breadcrumbLabel="Circuits"
      intro={[
        `Le championnat 2026 compte ${races.length} Grands Prix, du coup d'envoi à ${first.circuit.location} en ${monthOf(first.race)} jusqu'à la finale à ${last.circuit.location} en ${monthOf(last.race)}. Madrid y fait son entrée avec un nouveau circuit urbain, tandis que les manches de Bahreïn et d'Arabie saoudite ont été annulées.`,
        `Des rues de Monaco aux courbes rapides de Suzuka et Silverstone, chaque tracé a son caractère. Ouvrez une fiche pour connaître la longueur, le record du tour, les points clés du circuit et les horaires du week-end.`,
      ]}
      stats={[
        { label: "Grands Prix", value: String(races.length) },
        { label: "Week-ends sprint", value: String(sprintCount) },
        { label: "Nouveau circuit", value: "Madrid" },
        { label: "Courses annulées", value: String(cancelledRaces2026.length) },
      ]}
    >
      <JsonLd
        data={[
          itemList(
            "Circuits du championnat de Formule 1 2026",
            races.map(({ circuit }) => ({ name: `${circuit.grandPrix} — ${circuit.circuitName}`, path: `/circuits/${circuit.slug}` })),
          ),
          breadcrumb([{ name: "Circuits F1 2026", path: "/circuits" }]),
        ]}
      />

      <section className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-gray-900">Calendrier des circuits 2026</h2>
          <Link
            href="/calendrier"
            className="rounded-full bg-[#0F172A] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#C41230]"
          >
            Horaires des sessions
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {races.map(({ race, circuit }) => (
            <CircuitCard key={circuit.slug} circuit={circuit} race={race} />
          ))}
        </div>
      </section>

      {cancelledCircuits.length > 0 && (
        <section className="mt-5 rounded-[1.75rem] border border-red-100 bg-red-50/40 p-4 sm:p-5">
          <h2 className="text-lg font-black text-gray-900">Grands Prix annulés en 2026</h2>
          <p className="mt-1 text-sm text-gray-600">
            Ces manches figuraient au calendrier initial mais ont été retirées de la saison.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cancelledCircuits.map((circuit) => (
              <CircuitCard key={circuit.slug} circuit={circuit} />
            ))}
          </div>
        </section>
      )}
    </HubPageShell>
  );
}
