import { NextResponse } from "next/server";

import { getDriverStandings } from "../../lib/jolpica";

export const revalidate = 1800;

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
