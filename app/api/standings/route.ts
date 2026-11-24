import { NextResponse } from "next/server";

import { getConstructorStandings, getDriverStandings } from "../../lib/jolpica";

// Rendue à chaque requête pour qu'une erreur de Jolpica ne soit jamais figée en
// réponse statique ; les appels à Jolpica restent eux en cache 30 minutes.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [{ drivers }, constructors] = await Promise.all([getDriverStandings(), getConstructorStandings()]);
    return NextResponse.json({ drivers, constructors });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur API F1" }, { status: 502 });
  }
}
