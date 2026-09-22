import { NextResponse } from "next/server";

type DriverStandingApiItem = {
  points: number;
  position: number;
  driver: {
    name: string;
    surname: string;
  };
};

type DriverStandingsApiResponse = {
  drivers_championship: DriverStandingApiItem[];
};

const TOP_DRIVERS_URL = "https://f1api.dev/api/current/drivers-championship";

export const revalidate = 1800;

export async function GET() {
  try {
    const res = await fetch(TOP_DRIVERS_URL, {
      next: { revalidate },
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Impossible de recuperer le classement pilotes." },
        { status: 502 },
      );
    }

    const data = (await res.json()) as DriverStandingsApiResponse;

    const topDrivers = (data.drivers_championship ?? []).slice(0, 5).map((driver) => {
      const surname = driver.driver.surname;
      const name = surname.includes(" ") ? surname : `${driver.driver.name} ${surname}`;
      return { position: driver.position, name, points: driver.points };
    });

    return NextResponse.json(topDrivers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur interne lors de la recuperation du classement pilotes." },
      { status: 500 },
    );
  }
}
