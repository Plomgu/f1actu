"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

type NewsItem = {
  title: string;
  link: string;
  timestamp: number;
  time: string;
  source: string;
  excerpt: string;
  image: string | null;
};

const SLIDE_DURATION = 7000;

export default function NewsHero({ items }: { items: NewsItem[] }) {
  const slides = items.slice(0, 5);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length, index]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[420px] sm:h-[480px] md:h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0F1E] animate-pulse" />
    );
  }

  const slide = slides[index];

  function goTo(i: number) {
    setIndex((i + slides.length) % slides.length);
  }

  return (
    <div className="relative h-[420px] sm:h-[480px] md:h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0F1E]">

      <AnimatePresence mode="sync">
        <motion.div
          key={slide.link}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {slide.image ? (
            <img
              src={slide.image}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              style={{ objectPosition: "50% 20%" }}
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: "linear-gradient(135deg,#0A0F1E 0%,#3a0a14 55%,#C41230 100%)" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
        <span className="rounded-full bg-[#C41230] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
          Live News
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.link}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <a href={slide.link} target="_blank" rel="noopener noreferrer" className="group block">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white group-hover:text-white/90 transition-colors">
                {slide.title}
              </h2>
              {slide.excerpt && (
                <p className="mt-3 hidden sm:block max-w-xl text-sm text-gray-300 line-clamp-2">
                  {slide.excerpt}
                </p>
              )}
            </a>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <a
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-[#C41230] px-3 py-1.5 font-bold text-white hover:bg-[#9B0E22] transition-colors"
              >
                Lire l&rsquo;article
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <span className="rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-gray-200 border border-white/10">
                {slide.source}
              </span>
              <span className="rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-gray-200 border border-white/10">
                {slide.time}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-5 sm:bottom-8 md:bottom-12 right-5 sm:right-8 md:right-12 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.link}
                onClick={() => goTo(i)}
                aria-label={`Actualité ${i + 1}`}
                className="relative h-1 w-6 rounded-full bg-white/25 overflow-hidden"
              >
                {i === index && (
                  <motion.span
                    key={`${slide.link}-progress`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                    className="absolute inset-y-0 left-0 bg-[#C41230]"
                  />
                )}
                {i < index && <span className="absolute inset-0 bg-white/60" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Actualité précédente"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Actualité suivante"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C41230] text-white hover:bg-[#9B0E22] transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
