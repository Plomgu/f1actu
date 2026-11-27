import Link from "next/link";
import { ArrowRight, ArrowUpRight, PenLine } from "lucide-react";

import { articles, formatArticleDate, readingTime, type Article } from "../articles/article-data";

/** Carte d'article verticale (photo 16:9, catégorie, titre, date). */
export function ArticleCard({ article, showLead = false }: { article: Article; showLead?: boolean }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0A0F1E]">
        <img
          src={article.cover.src}
          alt={article.cover.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C41230]">{article.category}</div>
        <h3 className="mt-1.5 font-bold leading-snug text-[#0A0F1E] transition group-hover:text-[#C41230]">{article.title}</h3>
        {showLead && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{article.lead}</p>}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-gray-500">
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-[#C41230]" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Bandeau « La rédaction » de la page d'accueil : le dernier article en grand,
 * les deux suivants à côté.
 */
export function RedactionBand() {
  const [first, ...rest] = articles;
  if (!first) return null;
  const others = rest.slice(0, 2);

  return (
    <section aria-labelledby="redaction-title" className="px-4 pt-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-6 w-1.5 shrink-0 rounded-full bg-[#C41230]" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C41230]">Exclusif</div>
            <h2 id="redaction-title" className="text-lg font-black tracking-tight text-[#0A0F1E] sm:text-xl">
              Les articles de la rédaction
            </h2>
          </div>
        </div>
        <Link
          href="/articles"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[#0A0F1E] transition hover:text-[#C41230]"
        >
          Tous les articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className={`grid gap-5 ${others.length > 0 ? "lg:grid-cols-[1.6fr_1fr]" : ""}`}>
        {/* Article principal, en format horizontal */}
        <Link
          href={`/articles/${first.slug}`}
          className="group grid overflow-hidden rounded-3xl bg-[#0A0F1E] text-white shadow-xl transition hover:shadow-2xl md:grid-cols-[1.25fr_1fr]"
        >
          <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-[260px]">
            <img
              src={first.cover.src}
              alt={first.cover.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative flex flex-col justify-center gap-3 overflow-hidden p-5 sm:p-7">
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C41230]/25 blur-3xl" />
            <span className="relative w-fit rounded-full bg-[#C41230] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
              {first.category}
            </span>
            <h3 className="relative text-xl font-black leading-tight sm:text-2xl">{first.title}</h3>
            <p className="relative line-clamp-3 text-sm leading-relaxed text-white/70">{first.lead}</p>
            <div className="relative mt-1 flex items-center justify-between gap-3 text-xs text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <PenLine className="h-3.5 w-3.5" />
                {formatArticleDate(first.publishedAt)} · {readingTime(first)} min
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-bold text-[#0A0F1E] transition group-hover:bg-[#C41230] group-hover:text-white">
                Lire <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {others.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {others.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group flex gap-4 overflow-hidden rounded-2xl bg-white p-3 shadow-md transition hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl bg-[#0A0F1E] sm:w-36">
                  <img src={a.cover.src} alt={a.cover.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="min-w-0 py-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C41230]">{a.category}</div>
                  <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-[#0A0F1E] transition group-hover:text-[#C41230]">
                    {a.title}
                  </h3>
                  <time dateTime={a.publishedAt} className="mt-1.5 block text-xs text-gray-500">
                    {formatArticleDate(a.publishedAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Encadré « Nos articles » pour la colonne de droite des fiches pilote,
 * écurie et circuit. N'affiche rien si aucun article n'est lié.
 */
export function RelatedArticlesBox({ items, title }: { items: Article[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
        <span aria-hidden="true" className="h-4 w-1 rounded-full bg-[#C41230]" />
        <div className="text-sm font-bold tracking-wider text-[#C41230]">{title}</div>
      </div>
      <div className="divide-y divide-gray-100">
        {items.slice(0, 3).map((a) => (
          <Link key={a.slug} href={`/articles/${a.slug}`} className="group block p-4 transition hover:bg-gray-50">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#0A0F1E]">
              <img
                src={a.cover.src}
                alt={a.cover.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-2 top-2 rounded-full bg-[#C41230] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                {a.category}
              </span>
            </div>
            <div className="mt-2.5 text-sm font-bold leading-snug text-gray-900 transition group-hover:text-[#C41230]">{a.title}</div>
            <time dateTime={a.publishedAt} className="mt-1 block text-xs text-gray-500">
              {formatArticleDate(a.publishedAt)}
            </time>
          </Link>
        ))}
      </div>
    </div>
  );
}
