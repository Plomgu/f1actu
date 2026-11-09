import { NextResponse } from "next/server";

import { fetchJolpica, siteDriverId, type JolpicaConstructor, type JolpicaDriver } from "../../lib/jolpica";

export const revalidate = 1800; // 30 min

type Summary = { wins: number; podiums: number; poles: number };

type ResultsData = {
  RaceTable: {
    season: string;
    Races: {
      round: string;
      Results?: { Driver: JolpicaDriver; Constructor: JolpicaConstructor }[];
      QualifyingResults?: { Driver: JolpicaDriver; Constructor: JolpicaConstructor }[];
    }[];
  };
};

/**
 * Victoires, podiums et pole positions de la saison en cours, par pilote et
 * par écurie. Cinq requêtes au total : les 1ers, 2es et 3es de chaque course,
 * puis le 1er de chaque qualification.
 */
export async function GET() {
  try {
    const [first, second, third, poles] = await Promise.all([
      fetchJolpica<ResultsData>("current/results/1.json?limit=100"),
      fetchJolpica<ResultsData>("current/results/2.json?limit=100"),
      fetchJolpica<ResultsData>("current/results/3.json?limit=100"),
      fetchJolpica<ResultsData>("current/qualifying/1.json?limit=100"),
    ]);

    const drivers: Record<string, Summary> = {};
    const teams: Record<string, Summary> = {};

    function bump(entry: { Driver: JolpicaDriver; Constructor: JolpicaConstructor }, key: keyof Summary) {
      const driverId = siteDriverId(entry.Driver.driverId);
      const teamId = entry.Constructor.constructorId;
      for (const [store, id] of [[drivers, driverId], [teams, teamId]] as const) {
        if (!store[id]) store[id] = { wins: 0, podiums: 0, poles: 0 };
        store[id][key] += 1;
      }
    }

    for (const race of first.RaceTable.Races) {
      const winner = race.Results?.[0];
      if (!winner) continue;
      bump(winner, "wins");
      bump(winner, "podiums");
    }
    for (const race of [...second.RaceTable.Races, ...third.RaceTable.Races]) {
      const finisher = race.Results?.[0];
      if (finisher) bump(finisher, "podiums");
    }
    for (const race of poles.RaceTable.Races) {
      const poleSitter = race.QualifyingResults?.[0];
      if (poleSitter) bump(poleSitter, "poles");
    }

    return NextResponse.json({
      season: first.RaceTable.season,
      roundsCompleted: first.RaceTable.Races.length,
      drivers,
      teams,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur API F1" }, { status: 502 });
  }
}
