import Link from "next/link";

import SiteHeader from "./SiteHeader";
import AdBanner from "./AdBanner";

type HubStat = { label: string; value: string };

type HubPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string[];
  stats: HubStat[];
  breadcrumbLabel: string;
  children: React.ReactNode;
};

/**
 * Gabarit commun des pages récapitulatives (pilotes, écuries, circuits).
 * Rendu côté serveur : tout le texte et tous les liens sont dans le HTML
 * que lit Google.
 */
export default function HubPageShell({
  eyebrow,
  title,
  intro,
  stats,
  breadcrumbLabel,
  children,
}: HubPageShellProps) {
  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <AdBanner variant="horizontal" bare />

        <SiteHeader />

        <nav aria-label="Fil d'Ariane" className="max-w-7xl mx-auto px-4 pt-4 text-xs text-gray-500">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-[#C41230] transition">Accueil</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="font-semibold text-gray-700" aria-current="page">{breadcrumbLabel}</li>
          </ol>
        </nav>

        <div className="max-w-7xl mx-auto px-4 pt-3">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0A0F1E] via-[#0F172A] to-[#1C2438] p-5 sm:p-7 text-white shadow-2xl">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-1/3 bottom-0 h-36 w-36 rounded-full bg-[#C41230]/20 blur-3xl" />

            <div className="relative grid gap-5 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">{eyebrow}</div>
                <h1 className="mt-2 max-w-3xl text-2xl font-black tracking-tight md:text-[2rem]">{title}</h1>
                <div className="mt-3 max-w-3xl space-y-2 text-sm leading-relaxed text-white/75">
                  {intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/12 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-white/50">{stat.label}</dt>
                    <dd className="mt-1 text-xl font-extrabold">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-5 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
