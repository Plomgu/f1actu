import { NextResponse } from "next/server";

export const revalidate = 300; // refresh every 5 minutes

const FEEDS = [
  { url: "https://dwh.lequipe.fr/api/edito/rss?path=/Formule-1/", source: "L'Équipe" },
  { url: "https://fr.motorsport.com/rss/f1/news/", source: "Motorsport" },
  { url: "https://sports.auto-moto.com/rss/formule-1.html", source: "AutoMoto" },
  { url: "https://www.paddock-gp.com/feed/", source: "Paddock GP" },
  { url: "https://f1i.autojournal.fr/feed/", source: "F1i" },
  { url: "https://www.franceinfo.fr/sports/auto-moto/formule-1.rss", source: "France Info" },
];

const HTML_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  ndash: "–", mdash: "—", hellip: "…", eacute: "é",
  egrave: "è", ecirc: "ê", agrave: "à", ccedil: "ç",
  ocirc: "ô", ugrave: "ù", iuml: "ï",
};

function decodeEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => HTML_ENTITIES[name] ?? match);
}

function extractText(tag: string, xml: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (cdataMatch) return decodeEntities(cdataMatch[1].trim());
  const plainMatch = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return plainMatch ? decodeEntities(plainMatch[1].trim()) : "";
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function extractExcerpt(block: string): string {
  const raw = extractText("description", block);
  const text = stripHtml(raw);
  if (text.length <= 160) return text;
  return text.slice(0, 160).replace(/\s+\S*$/, "") + "…";
}

function extractImage(block: string): string | null {
  const enclosure = block.match(/<enclosure\b[^>]*\burl="([^"]+)"/i);
  if (enclosure) return enclosure[1];
  const mediaContent = block.match(/<media:content\b[^>]*\burl="([^"]+)"/i);
  if (mediaContent) return mediaContent[1];
  const img = block.match(/<img\b[^>]*\bsrc="([^"]+)"/i);
  if (img) return img[1];
  return null;
}

function parseItems(xml: string, source: string) {
  const items: { title: string; link: string; timestamp: number; time: string; source: string; excerpt: string; image: string | null }[] = [];

  const itemBlocks = xml.split(/<item[\s>]/);
  for (let i = 1; i < itemBlocks.length; i++) {
    const block = itemBlocks[i];
    const title = extractText("title", block);
    const link = extractText("link", block) || extractText("guid", block);
    const pubDate = extractText("pubDate", block);

    if (!title || !link || !pubDate) continue;

    const date = new Date(pubDate);
    if (isNaN(date.getTime())) continue;

    items.push({
      title,
      link,
      timestamp: date.getTime(),
      time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }),
      source,
      excerpt: extractExcerpt(block),
      image: extractImage(block),
    });
  }

  return items;
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      FEEDS.map(async ({ url, source }) => {
        const res = await fetch(url, {
          next: { revalidate },
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; LiveF1Bot/1.0)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
          },
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseItems(xml, source);
      })
    );

    const merged = results
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 80);

    return NextResponse.json(merged);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
