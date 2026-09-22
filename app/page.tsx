"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import SiteHeader from "./components/SiteHeader";
import AdBanner from "./components/AdBanner";
import WeatherCard from "./components/WeatherCard";
import NewsHero from "./components/NewsHero";
import { NewsListSkeleton, StandingsSidebarSkeleton } from "./components/Skeleton";
import { teams } from "./ecuries/team-data";
import { calendar2026 } from "./calendrier/calendar-data";

const driverVisuals: Record<string, { team: string; color: string; logo: string; photo: string }> = {
  russell:        { team: "Mercedes",        color: "#00D2BE", logo: "/logos/mercedes.png",    photo: "/drivers/russell.png" },
  antonelli:      { team: "Mercedes",        color: "#00D2BE", logo: "/logos/mercedes.png",    photo: "/drivers/antonelli.png" },
  leclerc:        { team: "Ferrari",         color: "#DC0000", logo: "/logos/ferrari.png",     photo: "/drivers/leclerc.png" },
  hamilton:       { team: "Ferrari",         color: "#DC0000", logo: "/logos/ferrari.png",     photo: "/drivers/hamilton.png" },
  bearman:        { team: "Haas",            color: "#E6002B", logo: "/logos/haas.png",        photo: "/drivers/bearman.png" },
  norris:         { team: "McLaren",         color: "#FF8700", logo: "/logos/mclaren.png",     photo: "/drivers/norris.png" },
  gasly:          { team: "Alpine",          color: "#0090FF", logo: "/logos/alpine.png",      photo: "/drivers/gasly.png" },
  max_verstappen: { team: "Red Bull Racing", color: "#0600EF", logo: "/logos/redbull.png",     photo: "/drivers/verstappen.png" },
  lawson:         { team: "Racing Bulls",    color: "#1E41FF", logo: "/logos/rb.png",          photo: "/drivers/lawson.png" },
  lindblad:       { team: "Racing Bulls",    color: "#1E41FF", logo: "/logos/rb.png",          photo: "/drivers/lindblad.png" },
  hadjar:         { team: "Red Bull Racing", color: "#0600EF", logo: "/logos/redbull.png",     photo: "/drivers/hadjar.png" },
  piastri:        { team: "McLaren",         color: "#FF8700", logo: "/logos/mclaren.png",     photo: "/drivers/piastri.png" },
  sainz:          { team: "Williams",        color: "#005AFF", logo: "/logos/williams.png",    photo: "/drivers/sainz.png" },
  bortoleto:      { team: "Audi",            color: "#BB0A30", logo: "/logos/audi.png",        photo: "/drivers/bortoleto.png" },
  colapinto:      { team: "Alpine",          color: "#0090FF", logo: "/logos/alpine.png",      photo: "/drivers/colapinto.png" },
  ocon:           { team: "Haas",            color: "#E6002B", logo: "/logos/haas.png",        photo: "/drivers/ocon.png" },
  hulkenberg:     { team: "Audi",            color: "#BB0A30", logo: "/logos/audi.png",        photo: "/drivers/hulkenberg.png" },
  albon:          { team: "Williams",        color: "#005AFF", logo: "/logos/williams.png",    photo: "/drivers/albon.png" },
  bottas:         { team: "Cadillac",        color: "#003A8F", logo: "/logos/cadillac.png",    photo: "/drivers/bottas.png" },
  perez:          { team: "Cadillac",        color: "#003A8F", logo: "/logos/cadillac.png",    photo: "/logos/f1.png" },
  alonso:         { team: "Aston Martin",    color: "#006F62", logo: "/logos/astonmartin.png", photo: "/drivers/alonso.png" },
  stroll:         { team: "Aston Martin",    color: "#006F62", logo: "/logos/astonmartin.png", photo: "/drivers/stroll.png" },
};

export default function Home() {
  const [standings, setStandings] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [newsPage, setNewsPage] = useState(1);
  const [currentTimestamp] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const NEWS_PAGE_SIZE = 20;
  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ?? calendar2026[calendar2026.length - 1];

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {

    async function loadRSS() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function loadStandings() {
      try {
        const res = await fetch("/api/standings", { cache: "no-store" });
        const data = await res.json();
        setStandings((data.drivers ?? []).slice(0, 5));
      } catch(e){
        console.error(e);
      }
    }

    loadRSS();
    loadStandings();

    const newsInterval = setInterval(loadRSS, 60 * 1000);
    const standingsInterval = setInterval(loadStandings, 5 * 60 * 1000);

    return () => {
      clearInterval(newsInterval);
      clearInterval(standingsInterval);
    };

  }, []);


  function formatCountdown(nowTimestamp: number, targetIso: string) {
    const diff = new Date(targetIso).getTime() - nowTimestamp;
    if (diff <= 0) return "En cours ou passé";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${days} j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }

  function isNew(timestamp:number){
    return Date.now() - timestamp < 60 * 60 * 1000;
  }


  function groupByDay(items:any[]){

    const groups:Record<string,any[]> = {};

    items.forEach((item)=>{

      const day = new Date(item.timestamp).toLocaleDateString("fr-FR",{
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
      });

      if(!groups[day]) groups[day] = [];

      groups[day].push(item);

    });

    return groups;
  }


  const newsTotalPages = Math.max(1, Math.ceil(news.length / NEWS_PAGE_SIZE));
  const paginatedNews = news.slice((newsPage - 1) * NEWS_PAGE_SIZE, newsPage * NEWS_PAGE_SIZE);
  const groupedNews = groupByDay(paginatedNews);


  return (

    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">

      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">

        {/* PUB */}

        <AdBanner variant="horizontal" bare />

        <SiteHeader />


        {/* HERO ACTUS */}

        <div className="px-4 pt-4">
          <NewsHero items={news} />
        </div>


        {/* SLIDER LOGOS */}

        <div className="bg-white overflow-hidden">

          <div className="max-w-7xl mx-auto px-4 py-4 overflow-hidden">

            <div className="flex gap-6 w-max animate-marquee">

              {[...teams, ...teams].map((team, i)=> (

                <Link
                  key={`${team.link}-${i}`}
                  href={team.link}
                  className="flex items-center justify-center bg-white shadow-md hover:shadow-xl rounded-2xl w-[140px] h-[80px] transition-all shrink-0"
                >

                  <img
                    src={team.logo}
                    alt={team.name}
                    className="max-h-[40px] max-w-[100px] object-contain"
                  />

                </Link>

              ))}

            </div>

          </div>

        </div>


        {/* LIVE NEWS BAR */}

        <div className="max-w-7xl mx-auto px-4">

<div
  className="w-full lg:w-2/3 text-white font-extrabold py-5 rounded-2xl tracking-widest text-lg flex items-center justify-center gap-3"
  style={{
    background:"linear-gradient(90deg,#0A0F1E 0%,#C41230 30%,#C41230 70%,#0A0F1E 100%)"
  }}
>

  <span>🏁 LIVE NEWS 🏁</span>




          </div>

        </div>


        {/* MAIN */}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">


          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-2xl rounded-3xl border border-gray-100">

            {news.length === 0 && <NewsListSkeleton />}

            {Object.entries(groupedNews).map(([day,items]) => (

              <div key={day} className="mb-5 last:mb-0">

                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C41230] pb-1.5 mb-1 border-b border-gray-100">
                  {day}
                </div>

                <div>

                  {(items as any[]).map((item,index)=> (

                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >

                      <span className="shrink-0 w-10 text-[11px] font-semibold text-gray-400 tabular-nums">{item.time}</span>

                      <span className="flex-1 min-w-0">

                        <span className="text-[13.5px] leading-snug font-medium text-gray-800 group-hover:text-[#C41230] transition-colors">
                          {item.title}
                        </span>

                        {isNew(item.timestamp) && (
                          <span className="ml-2 inline-block rounded-full bg-[#C41230]/10 text-[#C41230] text-[9px] font-bold tracking-wide px-2 py-0.5 align-middle">
                            NOUVEAU
                          </span>
                        )}

                        <span className="ml-2 text-[11px] text-gray-400">- {item.source}</span>

                      </span>

                    </a>

                  ))}

                </div>

              </div>

            ))}

            {newsTotalPages > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-sm">
                {newsPage > 1 && (
                  <button
                    onClick={() => setNewsPage((p) => p - 1)}
                    className="rounded border border-[#C41230]/30 px-2.5 py-1 text-[#C41230] hover:bg-[#C41230]/5 transition-colors"
                  >
                    Précédent
                  </button>
                )}

                {Array.from({ length: newsTotalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <span key={p} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-gray-300">-</span>}
                      {p === newsPage ? (
                        <span className="px-1 font-bold text-gray-700">{p}</span>
                      ) : (
                        <button
                          onClick={() => setNewsPage(p)}
                          className="rounded border border-[#C41230]/30 px-2.5 py-1 text-[#C41230] hover:bg-[#C41230]/5 transition-colors"
                        >
                          {p}
                        </button>
                      )}
                    </span>
                  );
                })}

                {newsPage < newsTotalPages && (
                  <>
                    <span className="text-gray-300">-</span>
                    <button
                      onClick={() => setNewsPage((p) => p + 1)}
                      className="rounded border border-[#C41230]/30 px-2.5 py-1 font-semibold text-[#C41230] hover:bg-[#C41230]/5 transition-colors"
                    >
                      Suivant
                    </button>
                  </>
                )}
              </div>
            )}

          </div>


          <div className="space-y-6 lg:-mt-24">

            {/* CLASSEMENT PILOTES */}

            <div className="bg-white rounded-3xl border border-gray-100 p-5">

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C41230]" />
                  <div className="font-bold text-gray-900 text-sm tracking-wide">
                    Classement pilotes
                  </div>
                </div>
                <Link
                  href="/classement"
                  className="text-[11px] font-semibold text-[#C41230] hover:text-[#9B0E22] transition"
                >
                  Voir tout →
                </Link>
              </div>

              {standings.length === 0 && <StandingsSidebarSkeleton />}

              <div className="divide-y divide-gray-50">
                {standings.map((d, i) => {
                  const v = driverVisuals[d.driverId];
                  return (
                    <div key={i} className="group flex items-center gap-3 py-2.5 -mx-1.5 px-1.5 rounded-lg hover:bg-gray-50/70 transition-colors">
                      <div className="w-1 h-9 rounded-full shrink-0" style={{ background: v?.color ?? "#ccc" }} />
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        d.position === 1 ? "bg-yellow-50 text-yellow-700"
                        : d.position === 2 ? "bg-gray-100 text-gray-600"
                        : d.position === 3 ? "bg-orange-50 text-orange-700"
                        : "text-gray-400"
                      }`}>{d.position}</span>
                      <img src={v?.photo ?? "/logos/f1.png"} alt={d.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold leading-tight truncate text-[13px] text-gray-900">{d.name}</div>
                        <div className="text-gray-400 text-[11px] flex items-center gap-1 truncate">
                          {v && <img src={v.logo} alt={v.team} className="h-2.5" />}
                          {v?.team ?? ""}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[13px] font-extrabold text-[#C41230] tabular-nums">{d.points}</span>
                        <span className="text-[10px] text-gray-400 ml-0.5">pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>


            {/* PROCHAIN GRAND PRIX + METEO */}

            <div className="rounded-3xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C41230]" />
                <div className="font-bold text-gray-900 text-sm tracking-wide">Prochain Grand Prix</div>
              </div>
              <div className="space-y-2">
                <div className="text-base font-black text-gray-900 leading-tight">{nextRace.grandPrix}</div>
                <div className="text-sm text-gray-500">{nextRace.location}</div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Date de course</div>
                  <div className="mt-1 text-sm font-bold text-gray-900">{nextRace.raceDateLabel} · {nextRace.raceTime}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Compte à rebours</div>
                  <div className="mt-1 text-lg font-extrabold text-[#C41230]">
                    {formatCountdown(now, nextRace.raceDateIso)}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <div className="text-xs font-bold text-gray-500 tracking-wide">Météo sur place</div>
                </div>
                <WeatherCard location={nextRace.location} bare />
              </div>

              <Link
                href={`/circuits/${nextRace.circuitSlug}`}
                className="mt-4 block text-center rounded-2xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#C41230]"
              >
                Voir le circuit
              </Link>
            </div>


            {/* PUB */}

            <AdBanner variant="vertical" />

          </div>


        </div>

      </div>

    </div>

  );

}
