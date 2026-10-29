import type { Metadata } from "next";
import Link from "next/link";

import HubPageShell from "../components/HubPageShell";
import JsonLd, { breadcrumb, itemList } from "../components/JsonLd";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import { driverPages, type DriverPageData } from "./driver-data";
import { teamPages } from "../ecuries/team-data";

const activeTeams = Object.values(teamPages).filter((team) => team.active !== false);
const drivers = Object.values(driverPages);

const title = "Pilotes F1 2026 : la grille complète";
const description = `Les ${drivers.length} pilotes de Formule 1 en 2026, écurie par écurie : Norris, Verstappen, Leclerc, Hamilton, Hadjar… Numéros, nationalités et fiches détaillées.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/pilotes` },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/pilotes`,
  },
};

const teamsWithDrivers = activeTeams
  .map((team) => ({ team, drivers: drivers.filter((d) => d.teamSlug === team.slug) }))
  .filter((group) => group.drivers.length > 0);

function titlesOf(driver: DriverPageData) {
  return Number(driver.stats.find((s) => s.label === "Titres mondiaux")?.value ?? 0);
}

const champions = drivers.filter((d) => titlesOf(d) > 0);
const frenchDrivers = drivers.filter((d) => d.nationality === "France");

function DriverCard({ driver }: { driver: DriverPageData }) {
  const titles = titlesOf(driver);

  return (
    <Link
      href={`/pilotes/${driver.slug}`}
      className="group flex overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div
        className="relative flex w-28 shrink-0 items-end justify-center overflow-hidden sm:w-32"
        style={{ background: driver.gradient }}
      >
        <span className="absolute left-2 top-1 text-3xl font-black italic text-white/30">{driver.number}</span>
        <img
          src={driver.image}
          alt={`${driver.name}, pilote ${driver.teamName}`}
          loading="lazy"
          className="relative h-28 w-auto object-contain object-bottom transition group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3.5">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: driver.accentColor }}>
          N°{driver.number}
        </div>
        <h3 className="truncate text-base font-black text-gray-900 group-hover:text-[#C41230] transition">{driver.name}</h3>
        <div className="text-xs text-gray-500">
          {driver.nationality} · {driver.age}
        </div>
        {titles > 0 && (
          <div className="mt-0.5 inline-flex w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
            {titles === 1 ? "Champion du monde" : `${titles} titres mondiaux`}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function PilotesPage() {
  return (
    <HubPageShell
      eyebrow="Saison 2026"
      title="Tous les pilotes de Formule 1 en 2026"
      breadcrumbLabel="Pilotes"
      intro={[
        `La grille 2026 réunit ${drivers.length} pilotes répartis dans ${teamsWithDrivers.length} écuries, avec l'arrivée de Cadillac et d'Audi comme équipes d'usine. Lando Norris défend le numéro 1 après son titre 2025, face à des champions confirmés comme Max Verstappen, Lewis Hamilton et Fernando Alonso.`,
        "La nouvelle génération pousse fort, de Kimi Antonelli à Isack Hadjar en passant par Arvid Lindblad. Cliquez sur un pilote pour découvrir sa biographie, son palmarès et ses résultats de la saison.",
      ]}
      stats={[
        { label: "Pilotes", value: String(drivers.length) },
        { label: "Écuries", value: String(teamsWithDrivers.length) },
        { label: "Champions du monde", value: String(champions.length) },
        { label: "Pilotes français", value: String(frenchDrivers.length) },
      ]}
    >
      <JsonLd
        data={[
          itemList(
            "Pilotes de Formule 1 en 2026",
            drivers.map((d) => ({ name: d.name, path: `/pilotes/${d.slug}` })),
          ),
          breadcrumb([{ name: "Pilotes F1 2026", path: "/pilotes" }]),
        ]}
      />

      <div className="space-y-5">
        {teamsWithDrivers.map(({ team, drivers: teamDrivers }) => (
          <section
            key={team.slug}
            className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-4 sm:p-5 shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full" style={{ background: team.accentColor }} />
                <h2 className="text-xl font-black text-gray-900">{team.navName}</h2>
              </div>
              <Link
                href={`/ecuries/${team.slug}`}
                className="rounded-full bg-[#0F172A] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#C41230]"
              >
                Voir l&apos;écurie
              </Link>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {teamDrivers.map((driver) => (
                <DriverCard key={driver.slug} driver={driver} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </HubPageShell>
  );
}
