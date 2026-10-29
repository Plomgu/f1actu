import type { Metadata } from "next";
import Link from "next/link";

import HubPageShell from "../components/HubPageShell";
import JsonLd, { breadcrumb, itemList } from "../components/JsonLd";
import { SITE_NAME, SITE_URL } from "../lib/seo";
import { teamPages, type TeamPageData } from "./team-data";
import { driverPages } from "../pilotes/driver-data";

const activeTeams = Object.values(teamPages).filter((team) => team.active !== false);

const title = "Écuries F1 2026 : les équipes et leurs pilotes";
const description = `Les ${activeTeams.length} écuries de Formule 1 en 2026 : Ferrari, McLaren, Mercedes, Red Bull, Audi, Cadillac… Pilotes, motoristes, titres et histoire de chaque équipe.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/ecuries` },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/ecuries`,
  },
};

function stat(team: TeamPageData, label: string) {
  return Number(team.stats.find((s) => s.label === label)?.value ?? 0);
}

const newTeams = activeTeams.filter((team) => team.founded === "2026");
const engineMakers = new Set(activeTeams.map((team) => team.powerUnit));
const mostTitled = [...activeTeams].sort(
  (a, b) => stat(b, "Titres constructeurs") - stat(a, "Titres constructeurs"),
)[0];

function TeamCard({ team }: { team: TeamPageData }) {
  const teamDrivers = Object.values(driverPages).filter((d) => d.teamSlug === team.slug);
  const constructorTitles = stat(team, "Titres constructeurs");
  const wins = stat(team, "Victoires");

  return (
    <article className="flex flex-col overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white/90 shadow-xl">
      <div className="h-1.5" style={{ background: team.gradient }} />

      <div className="flex items-center gap-4 p-4 sm:p-5">
        <Link
          href={`/ecuries/${team.slug}`}
          className="flex h-16 w-24 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md"
        >
          <img src={team.logo} alt={`Logo ${team.navName}`} loading="lazy" className="max-h-10 max-w-[76px] object-contain" />
        </Link>
        <div className="min-w-0">
          <h2 className="text-xl font-black text-gray-900">
            <Link href={`/ecuries/${team.slug}`} className="hover:text-[#C41230] transition">
              {team.navName}
            </Link>
          </h2>
          <div className="text-xs text-gray-500">
            {team.base} · depuis {team.founded}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-[1.5fr_1fr_1fr] gap-2 px-4 sm:px-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-100/80 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Moteur</dt>
          <dd className="mt-0.5 text-sm font-bold leading-tight text-gray-900">{team.powerUnit.replace(" Powertrains", "")}</dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-100/80 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Titres</dt>
          <dd className="mt-0.5 text-sm font-bold text-gray-900">{constructorTitles}</dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-100/80 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Victoires</dt>
          <dd className="mt-0.5 text-sm font-bold text-gray-900">{wins}</dd>
        </div>
      </dl>

      <div className="px-4 pt-3 text-xs text-gray-500 sm:px-5">
        Directeur d&apos;équipe : <span className="font-semibold text-gray-700">{team.teamPrincipal}</span>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2 px-4 sm:px-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Pilotes 2026</div>
        <div className="grid grid-cols-2 gap-2">
          {teamDrivers.map((driver) => (
            <Link
              key={driver.slug}
              href={`/pilotes/${driver.slug}`}
              className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-1.5 transition hover:border-gray-300 hover:shadow-md"
            >
              <img
                src={driver.profileImage ?? driver.image}
                alt={driver.name}
                loading="lazy"
                className="h-8 w-8 shrink-0 rounded-full object-cover"
                style={{ background: driver.accentColor }}
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-gray-900">{driver.name}</span>
                <span className="block text-[11px] text-gray-500">N°{driver.number}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <Link
          href={`/ecuries/${team.slug}`}
          className="inline-flex items-center rounded-full bg-[#0F172A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#C41230]"
        >
          Histoire et palmarès de {team.navName}
        </Link>
      </div>
    </article>
  );
}

export default function EcuriesPage() {
  return (
    <HubPageShell
      eyebrow="Saison 2026"
      title="Toutes les écuries de Formule 1 en 2026"
      breadcrumbLabel="Écuries"
      intro={[
        `${activeTeams.length} équipes s'alignent au départ du championnat 2026, une de plus que la saison précédente avec l'arrivée de Cadillac. Audi fait aussi ses débuts comme constructeur à part entière, en reprenant la structure Sauber basée à Hinwil.`,
        `De ${mostTitled.navName}, l'écurie la plus titrée de l'histoire, aux nouveaux venus américains et allemands, retrouvez pour chaque équipe ses pilotes, son motoriste, son directeur et son palmarès.`,
      ]}
      stats={[
        { label: "Écuries", value: String(activeTeams.length) },
        { label: "Nouvelles en 2026", value: String(newTeams.length) },
        { label: "Motoristes", value: String(engineMakers.size) },
        { label: "La plus titrée", value: mostTitled.navName },
      ]}
    >
      <JsonLd
        data={[
          itemList(
            "Écuries de Formule 1 en 2026",
            activeTeams.map((team) => ({ name: team.navName, path: `/ecuries/${team.slug}` })),
          ),
          breadcrumb([{ name: "Écuries F1 2026", path: "/ecuries" }]),
        ]}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {activeTeams.map((team) => (
          <TeamCard key={team.slug} team={team} />
        ))}
      </div>
    </HubPageShell>
  );
}
