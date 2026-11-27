"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Boutons de partage d'un article (liens de partage officiels, sans script tiers). */
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const networks = [
    { name: "X", href: `https://x.com/intent/post?url=${u}&text=${t}`, bg: "#000000", label: "𝕏" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, bg: "#1877F2", label: "f" },
    { name: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, bg: "#25D366", label: "WA" },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, bg: "#0A66C2", label: "in" },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible : on ne fait rien.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Partager</span>
      {networks.map((n) => (
        <a
          key={n.name}
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partager sur ${n.name}`}
          title={`Partager sur ${n.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={{ background: n.bg }}
        >
          {n.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 text-xs font-bold text-gray-700 transition hover:border-[#C41230] hover:text-[#C41230]"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Lien copié" : "Copier le lien"}
      </button>
    </div>
  );
}
