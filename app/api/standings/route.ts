import { NextResponse } from "next/server";

type DriverItem = {
  points: number;
  position: number;
  driverId: string;
  driver: { name: string; surname: string };
};

type ConstructorItem = {
  points: number;
  position: number;
  teamId: string;
  team: { teamName: string };
};

const TEAM_SHORT: Record<string, string> = {
  mercedes: "Mercedes",
  ferrari: "Ferrari",
  mclaren: "McLaren",
  red_bull: "Red Bull Racing",
  alpine: "Alpine",
  haas: "Haas",
  rb: "Racing Bulls",
  williams: "Williams",
  audi: "Audi",
  cadillac: "Cadillac",
  aston_martin: "Aston Martin",
};

function driverDisplayName(d: DriverItem["driver"]): string {
  return d.surname.includes(" ") ? d.surname : `${d.name} ${d.surname}`;
}

export const revalidate = 1800;

export async function GET() {
  try {
    const [driversRes, constructorsRes] = await Promise.all([
      fetch("https://f1api.dev/api/current/drivers-championship", {
        next: { revalidate },
        headers: { accept: "application/json" },
      }),
      fetch("https://f1api.dev/api/current/constructors-championship", {
        next: { revalidate },
        headers: { accept: "application/json" },
      }),
    ]);

    if (!driversRes.ok || !constructorsRes.ok) {
      return NextResponse.json({ error: "Erreur API F1" }, { status: 502 });
    }

    const driversData = await driversRes.json();
    const constructorsData = await constructorsRes.json();

    const drivers = (driversData.drivers_championship ?? []).map((d: DriverItem) => ({
      position: d.position,
      driverId: d.driverId,
      name: driverDisplayName(d.driver),
      points: d.points,
    }));

    const constructors = (constructorsData.constructors_championship ?? []).map((c: ConstructorItem) => ({
      position: c.position,
      teamId: c.teamId,
      name: TEAM_SHORT[c.teamId] ?? c.team.teamName,
      points: c.points,
    }));

    return NextResponse.json({ drivers, constructors });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
