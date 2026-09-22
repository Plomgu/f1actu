import { NextResponse } from "next/server";

import { calendar2026 } from "../../calendrier/calendar-data";

export const revalidate = 3600;

export async function GET() {
  const now = new Date();

  const nextRace = calendar2026.find((race) => new Date(race.raceDateIso) >= now);

  if (!nextRace) {
    return NextResponse.json(
      { error: "Aucune prochaine course trouvee." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    name: nextRace.grandPrix,
    circuit: nextRace.location,
    location: `${nextRace.location}, ${nextRace.country}`,
    date: nextRace.raceDateIso,
    raceDateLabel: nextRace.raceDateLabel,
    dateRange: nextRace.dateRange,
    raceTime: nextRace.raceTime,
    sessions: nextRace.sessions,
  });
}
