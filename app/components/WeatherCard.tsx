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

export default function WeatherCard({ location }: { location: string }) {
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

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-sky-100 via-cyan-50 to-blue-100 px-6 py-4 border-b border-sky-100">
        <div className="font-bold text-sky-700 text-sm tracking-wider">METEO EN DIRECT — PROCHAIN GRAND PRIX</div>
      </div>

      <div className="p-6">
        <div className="mb-4 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600">Lieu</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">{location}</div>
        </div>

        {loading ? (
          <div className="py-6 text-center text-sm text-gray-400">Chargement météo...</div>
        ) : weather && info ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 text-center">
                <div className="text-2xl">{info.emoji}</div>
                <div className="mt-2 text-xs font-bold text-gray-800 leading-tight">{info.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Conditions</div>
              </div>
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-center">
                <div className="text-2xl">🌡️</div>
                <div className="mt-2 text-sm font-bold text-gray-800">{weather.tempC}°C</div>
                <div className="text-xs text-gray-500">Air</div>
              </div>
              <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-4 text-center">
                <div className="text-2xl">💨</div>
                <div className="mt-2 text-sm font-bold text-gray-800">{weather.windKmph} km/h</div>
                <div className="text-xs text-gray-500">Vent</div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-gray-700">
              {info.label} · {weather.tempC}°C · Vent {weather.windKmph} km/h · Humidité {weather.humidity}%
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-sm text-gray-400">Météo indisponible</div>
        )}
      </div>
    </div>
  );
}
