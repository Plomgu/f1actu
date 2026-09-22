"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  tempC: number;
  windKmph: number;
  humidity: number;
  code: number;
};

function getWeatherInfo(code: number): { emoji: string; label: string } {
  if (code === 113) return { emoji: "☀️", label: "Ensoleillé" };
  if (code === 116) return { emoji: "⛅", label: "Partiellement nuageux" };
  if (code === 119 || code === 122) return { emoji: "☁️", label: "Nuageux" };
  if (code === 143 || code === 248 || code === 260) return { emoji: "🌫️", label: "Brumeux" };
  if (code === 200 || code === 386 || code === 389 || code === 392 || code === 395) return { emoji: "⛈️", label: "Orage" };
  if (
    code === 227 || code === 230 ||
    (code >= 323 && code <= 338) ||
    code === 368 || code === 371
  ) return { emoji: "❄️", label: "Neige" };
  if (code >= 176 && code <= 377) return { emoji: "🌧️", label: "Pluie" };
  return { emoji: "🌤️", label: "Variable" };
}

export default function WeatherCard({ location, bare = false }: { location: string; bare?: boolean }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setWeather(null);

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://wttr.in/${encodeURIComponent(location)}?format=j1`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const c = data.current_condition[0];
        setWeather({
          tempC: parseInt(c.temp_C, 10),
          windKmph: parseInt(c.windspeedKmph, 10),
          humidity: parseInt(c.humidity, 10),
          code: parseInt(c.weatherCode, 10),
        });
      } catch {
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  const info = weather ? getWeatherInfo(weather.code) : null;

  const content = (
    <>
      {loading ? (
        <div className="py-6 text-center text-sm text-gray-400">Chargement météo...</div>
      ) : weather && info ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-sky-50 p-3 text-center">
              <div className="text-xl">{info.emoji}</div>
              <div className="mt-1.5 text-[11px] font-bold text-gray-700 leading-tight">{info.label}</div>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 text-center">
              <div className="text-xl">🌡️</div>
              <div className="mt-1.5 text-[13px] font-bold text-gray-700">{weather.tempC}°C</div>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 text-center">
              <div className="text-xl">💨</div>
              <div className="mt-1.5 text-[13px] font-bold text-gray-700">{weather.windKmph} km/h</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-gray-400 text-center">
            Humidité {weather.humidity}%
          </div>
        </>
      ) : (
        <div className="py-6 text-center text-sm text-gray-400">Météo indisponible</div>
      )}
    </>
  );

  if (bare) return content;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <div className="font-bold text-gray-900 text-sm tracking-wide">Météo en direct</div>
        </div>
        <div className="text-[11px] font-semibold text-gray-400 truncate max-w-[45%]">{location}</div>
      </div>
      {content}
    </div>
  );
}
