import type { Metadata } from "next";
import Link from "next/link";

import SiteHeader from "../components/SiteHeader";
import AdBanner from "../components/AdBanner";
import { ArticleCard } from "../components/ArticleCards";
import { SITE_URL } from "../lib/seo";
import { articles, formatArticleDate, readingTime } from "./article-data";

export const metadata: Metadata = {
  title: "Articles et analyses F1",
  description: "Analyses, dossiers et articles de la rédaction F1 Actu sur la saison de Formule 1.",
  alternates: { canonical: `${SITE_URL}/articles` },
};

export default function ArticlesPage() {
  const [featured, ...others] = articles;

  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <AdBanner variant="horizontal" bare />
        <SiteHeader />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#C41230]">La rédaction</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0A0F1E] sm:text-4xl">Articles</h1>

          {featured && (
            <Link
              href={`/articles/${featured.slug}`}
              className="group relative mt-8 block overflow-hidden rounded-3xl bg-[#0A0F1E] shadow-2xl"
            >
              <div className="relative aspect-[16/10] sm:aspect-[21/9]">
                <img
                  src={featured.cover.src}
                  alt={featured.cover.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/50 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-white">
                <span className="inline-block rounded-full bg-[#C41230] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {featured.category}
                </span>
                <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight sm:text-4xl">{featured.title}</h2>
                <p className="mt-2 hidden max-w-2xl text-white/75 sm:block">{featured.lead}</p>
                <div className="mt-3 text-xs text-white/60">
                  {formatArticleDate(featured.publishedAt)} · {readingTime(featured)} min de lecture
                </div>
              </div>
            </Link>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((a) => (
              <ArticleCard key={a.slug} article={a} showLead />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
