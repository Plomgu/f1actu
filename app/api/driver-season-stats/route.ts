import { NextResponse } from "next/server";

export const revalidate = 1800; // 30 min

type SeasonRace = {
  round: number | string;
  winner: { driverId: string } | null;
};

type RaceResult = {
  position: string;
  driver: { driverId: string };
};

type QualyResult = {
  driverId: string;
  gridPosition: number;
};

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) return null;
  return res.json();
}

export async function GET() {
  try {
    const current = await fetchJson("https://f1api.dev/api/current");
    if (!current) return NextResponse.json({ error: "Erreur API F1" }, { status: 502 });

    const season = current.season;
    const completedRounds = ((current.races ?? []) as SeasonRace[])
      .filter((r) => r.winner)
      .map((r) => r.round);

    const stats: Record<string, { wins: number; podiums: number; poles: number }> = {};

    function bump(driverId: string, key: "wins" | "podiums" | "poles") {
      if (!stats[driverId]) stats[driverId] = { wins: 0, podiums: 0, poles: 0 };
      stats[driverId][key] += 1;
    }

    await Promise.all(
      completedRounds.map(async (round) => {
        const [raceData, qualyData] = await Promise.all([
          fetchJson(`https://f1api.dev/api/${season}/${round}/race`),
          fetchJson(`https://f1api.dev/api/${season}/${round}/qualy`),
        ]);

        const results = (raceData?.races?.results ?? []) as RaceResult[];
        for (const r of results) {
          const position = Number(r.position);
          if (!r.driver?.driverId || !position) continue;
          if (position === 1) bump(r.driver.driverId, "wins");
          if (position <= 3) bump(r.driver.driverId, "podiums");
        }

        const qualyResults = (qualyData?.races?.qualyResults ?? []) as QualyResult[];
        const poleSitter = qualyResults.find((q) => q.gridPosition === 1);
        if (poleSitter) bump(poleSitter.driverId, "poles");
      })
    );

    return NextResponse.json({ season, roundsCompleted: completedRounds.length, stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
