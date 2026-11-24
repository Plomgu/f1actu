import { NextResponse } from "next/server";

import { getDriverStandings } from "../../lib/jolpica";

// Rendue à chaque requête pour qu'une erreur de Jolpica ne soit jamais figée en
// réponse statique ; les appels à Jolpica restent eux en cache 30 minutes.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { drivers } = await getDriverStandings();
    const topDrivers = drivers
      .slice(0, 5)
      .map(({ position, name, points }) => ({ position, name, points }));

    return NextResponse.json(topDrivers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de récupérer le classement pilotes." },
      { status: 502 },
    );
  }
}
