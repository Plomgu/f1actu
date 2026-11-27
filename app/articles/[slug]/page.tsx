import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CalendarDays, PenLine, ArrowLeft } from "lucide-react";

import SiteHeader from "../../components/SiteHeader";
import AdBanner from "../../components/AdBanner";
import JsonLd from "../../components/JsonLd";
import ShareButtons from "../../components/ShareButtons";
import { ArticleCard } from "../../components/ArticleCards";
import { SITE_URL } from "../../lib/seo";
import {
  articles,
  getArticle,
  formatArticleDate,
  readingTime,
  type ArticleBlock,
} from "../article-data";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.lead,
    alternates: { canonical: `${SITE_URL}/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.lead,
      publishedTime: article.publishedAt,
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
      authors: [article.author],
      tags: article.tags,
      url: `${SITE_URL}/articles/${article.slug}`,
      images: [{ url: article.cover.social ?? article.cover.src, width: 1600, height: 900, alt: article.cover.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.lead,
      images: [article.cover.social ?? article.cover.src],
    },
  };
}

function Block({ block, index }: { block: ArticleBlock; index: number }) {
  switch (block.type) {
    case "p":
      return (
        <p
          className={
            index === 0
              ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[3.6rem] first-letter:font-black first-letter:leading-[0.8] first-letter:text-[#C41230]"
              : undefined
          }
        >
          {block.text}
        </p>
      );

    case "h2":
      return (
        <h2 className="!mt-12 flex items-center gap-3 text-2xl font-black tracking-tight text-[#0A0F1E] sm:text-[1.7rem]">
          <span aria-hidden="true" className="h-7 w-1.5 shrink-0 rounded-full bg-[#C41230]" />
          {block.text}
        </h2>
      );

    case "quote":
      return (
        <figure className="!my-10 relative rounded-3xl bg-[#F0F2F5] px-6 py-7 sm:px-10 sm:py-9">
          <span aria-hidden="true" className="absolute -top-5 left-6 select-none text-7xl font-black leading-none text-[#C41230]">
            “
          </span>
          <blockquote className="text-xl font-semibold italic leading-relaxed text-[#0A0F1E] sm:text-[1.4rem]">
            {block.text}
          </blockquote>
          {block.author && (
            <figcaption className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
              — {block.author}
            </figcaption>
          )}
        </figure>
      );

    case "list":
      return (
        <ul className="space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7rem] h-2 w-2 shrink-0 rotate-45 bg-[#C41230]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <figure className="!my-10">
          <img src={block.src} alt={block.alt} className="w-full rounded-2xl shadow-lg" loading="lazy" />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-500">{block.caption}</figcaption>
          )}
        </figure>
      );

    case "standings": {
      const max = Math.max(...block.rows.map((r) => r.points));
      return (
        <aside className="!my-10 rounded-3xl border border-gray-200 bg-white p-5 shadow-lg sm:p-7">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#C41230]">{block.title}</div>
          <ol className="mt-5 space-y-3.5">
            {block.rows.map((row, i) => (
              <li key={row.name}>
                <div className="flex items-baseline justify-between gap-3 text-sm sm:text-base">
                  <span className="min-w-0 truncate">
                    <span className="mr-2 inline-block w-5 font-black text-gray-400">{row.position}</span>
                    <span className={row.highlight ? "font-black text-[#0A0F1E]" : "font-semibold text-gray-700"}>{row.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{row.team}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-black text-[#0A0F1E]">{row.points}</span>
                    <span className="ml-1 text-xs text-gray-400">pts</span>
                    {i > 0 && (
                      <span className="ml-2 inline-block w-10 text-right text-xs font-semibold text-gray-400">−{(block.gapFrom === "previous" ? block.rows[i - 1].points : block.rows[0].points) - row.points}</span>
                    )}
                    {i === 0 && <span className="ml-2 inline-block w-10" />}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#F0F2F5]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(row.points / max) * 100}%`, background: row.color, opacity: row.highlight ? 1 : 0.55 }}
                  />
                </div>
              </li>
            ))}
          </ol>
          {block.note && <p className="mt-5 text-xs leading-relaxed text-gray-500">{block.note}</p>}
        </aside>
      );
    }

    case "keyFigures":
      return (
        <aside className="!my-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A0F1E] via-[#0F172A] to-[#1C2438] p-6 text-white shadow-2xl sm:p-8">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-[#C41230]/25 blur-3xl" />
          <div className="relative">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/55">{block.title}</div>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {block.items.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <dd className="text-2xl font-black">{item.value}</dd>
                  <dt className="mt-1 text-xs leading-snug text-white/60">{item.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      );
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const minutes = readingTime(article);
  const articleUrl = `${SITE_URL}/articles/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.lead,
    image: [article.cover.src.startsWith("http") ? article.cover.src : `${SITE_URL}${article.cover.src}`],
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: articleUrl,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    inLanguage: "fr-FR",
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <JsonLd data={jsonLd} />
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <AdBanner variant="horizontal" bare />
        <SiteHeader />

        <article className="bg-white pb-16">
          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane" className="mx-auto max-w-5xl px-4 pt-5 text-xs text-gray-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-[#C41230] transition">Accueil</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/articles" className="hover:text-[#C41230] transition">Articles</Link></li>
              <li aria-hidden="true">›</li>
              <li className="truncate font-semibold text-gray-700" aria-current="page">{article.category}</li>
            </ol>
          </nav>

          {/* En-tête de l'article */}
          <header className="mx-auto max-w-3xl px-4 pt-8 text-center sm:pt-12">
            <span className="inline-block rounded-full bg-[#C41230] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              {article.category}
            </span>
            <h1 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-[#0A0F1E] sm:text-[2.75rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 sm:text-xl">{article.lead}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <PenLine className="h-4 w-4 text-[#C41230]" />
                <span className="font-semibold text-gray-700">{article.author}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-[#C41230]" />
                <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#C41230]" />
                {minutes} min de lecture
              </span>
            </div>
            <div className="mt-5 flex justify-center">
              <ShareButtons url={articleUrl} title={article.title} />
            </div>
          </header>

          {/* Illustration principale */}
          <figure className="mx-auto mt-10 max-w-5xl px-0 sm:px-4">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#0A0F1E] shadow-2xl sm:rounded-3xl">
              <img
                src={article.cover.src}
                alt={article.cover.alt}
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#C41230] via-[#C41230] to-transparent" />
            </div>
            {article.cover.credit && (
              <figcaption className="mt-3 px-4 text-right text-xs text-gray-400 sm:px-0">{article.cover.credit}</figcaption>
            )}
          </figure>

          {/* Corps de l'article */}
          <div className="mx-auto mt-10 max-w-[680px] space-y-6 px-5 text-[1.0625rem] leading-[1.85] text-gray-800 sm:mt-14 sm:text-lg">
            {article.body.map((block, i) => (
              <Block key={i} block={block} index={i} />
            ))}
          </div>

          {/* Tags + retour */}
          <div className="mx-auto mt-12 max-w-[680px] px-5">
            <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-6">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 bg-[#F0F2F5] px-3 py-1 text-xs font-semibold text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-[#F0F2F5] px-4 py-4 sm:px-5">
              <div className="mb-3 text-sm font-bold text-[#0A0F1E]">Cet article vous a plu ? Faites-le circuler.</div>
              <ShareButtons url={articleUrl} title={article.title} />
            </div>
            <Link
              href="/articles"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0A0F1E] hover:text-[#C41230] transition"
            >
              <ArrowLeft className="h-4 w-4" /> Tous les articles
            </Link>
          </div>
        </article>

        {/* À lire aussi */}
        {related.length > 0 && (
          <section className="bg-[#F0F2F5]/70 px-4 py-12">
            <div className="mx-auto max-w-5xl">
              <h2 className="flex items-center gap-3 text-xl font-black text-[#0A0F1E]">
                <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-[#C41230]" />
                À lire aussi
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
