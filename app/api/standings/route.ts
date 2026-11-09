import { NextResponse } from "next/server";

import { getConstructorStandings, getDriverStandings } from "../../lib/jolpica";

export const revalidate = 1800;

export async function GET() {
  try {
    const [{ drivers }, constructors] = await Promise.all([getDriverStandings(), getConstructorStandings()]);
    return NextResponse.json({ drivers, constructors });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur API F1" }, { status: 502 });
  }
}
