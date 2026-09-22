"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import SiteHeader from "./components/SiteHeader";
import AdBanner from "./components/AdBanner";
import WeatherCard from "./components/WeatherCard";
import NewsHero from "./components/NewsHero";
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
  const [currentTimestamp] = useState(() => Date.now());
  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso).getTime() > currentTimestamp) ?? calendar2026[calendar2026.length - 1];

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
    return `${days} j ${hours} h`;
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


  const groupedNews = groupByDay(news);


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

        <div className="bg-white">

          <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto">

            <div className="flex gap-6 min-w-max">

              {teams.map((team)=> (

                <Link
                  key={team.link}
                  href={team.link}
                  className="flex items-center justify-center bg-white shadow-md hover:shadow-xl rounded-2xl w-[140px] h-[80px] transition-all"
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

            {Object.entries(groupedNews).map(([day,items]) => (

              <div key={day} className="mb-5 last:mb-0">

                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C41230] pb-1.5 mb-1 border-b border-gray-100">
                  {day}
                </div>

                <div className="divide-y divide-gray-100">

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

                        <span className="block text-[11px] text-gray-400 mt-0.5">{item.source}</span>

                      </span>

                    </a>

                  ))}

                </div>

              </div>

            ))}

          </div>


          <div className="space-y-6 lg:-mt-24">

            {/* CLASSEMENT PILOTES */}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4 overflow-hidden">

              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-[#C41230] text-sm tracking-wider">
                  CLASSEMENT PILOTES
                </div>
                <Link
                  href="/classement"
                  className="text-[11px] font-semibold text-[#C41230] hover:text-[#9B0E22] transition"
                >
                  Voir tout
                </Link>
              </div>

              {standings.length === 0 && (
                <div className="text-xs text-gray-400">Chargement du classement...</div>
              )}

              <div className="space-y-1.5">
                {standings.map((d, i) => {
                  const v = driverVisuals[d.driverId];
                  return (
                    <div key={i} className="flex items-center gap-2 border-b border-gray-100 py-1.5 hover:bg-gray-50/80 transition rounded-xl px-1.5">
                      <div className="w-1 h-8 rounded" style={{ background: v?.color ?? "#ccc" }} />
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold ${
                        d.position === 1 ? "bg-yellow-100 text-yellow-700"
                        : d.position === 2 ? "bg-gray-200 text-gray-700"
                        : d.position === 3 ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>{d.position}</span>
                      <div className="flex items-center flex-1 gap-2 min-w-0">
                        <img src={v?.photo ?? "/logos/f1.png"} alt={d.name} className="h-8 w-8 rounded-full object-cover border border-gray-200" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold leading-none truncate text-[13px]">{d.name}</span>
                          <span className="text-gray-400 text-[11px] flex items-center gap-1 truncate">
                            {v && <img src={v.logo} alt={v.team} className="h-3" />}
                            {v?.team ?? ""}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-extrabold text-[#C41230] tabular-nums">{d.points}</div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-400">pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>


            {/* PROCHAIN GRAND PRIX */}

            <div className="rounded-[1.75rem] border border-gray-100 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C41230] mb-3">Prochaine course</div>
              <div className="space-y-2">
                <div className="text-base font-black text-gray-900 leading-tight">{nextRace.grandPrix}</div>
                <div className="text-sm text-gray-500">{nextRace.location}</div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Date de course</div>
                  <div className="mt-1 text-sm font-bold text-gray-900">{nextRace.raceDateLabel} · {nextRace.raceTime}</div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Compte à rebours</div>
                  <div className="mt-1 text-lg font-extrabold text-[#C41230]">
                    {formatCountdown(currentTimestamp, nextRace.raceDateIso)}
                  </div>
                </div>
                <Link
                  href={`/circuits/${nextRace.circuitSlug}`}
                  className="mt-1 block text-center rounded-2xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#C41230]"
                >
                  Voir le circuit
                </Link>
              </div>
            </div>


            {/* METEO */}

            <WeatherCard location={nextRace.location} />


            {/* PUB */}

            <AdBanner variant="vertical" />

          </div>


        </div>

      </div>

    </div>

  );

}
