/**
 * Accès aux données F1 via Jolpica (https://api.jolpi.ca), le successeur
 * communautaire de l'API Ergast. Gratuit, sans clé, limité à 4 requêtes/s
 * et 500 requêtes/heure : les réponses sont donc mises en cache par Next.
 */
import { driverPages } from "../pilotes/driver-data";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

export const F1_DATA_REVALIDATE = 1800; // 30 min

/** Identifiants Jolpica qui diffèrent de ceux utilisés sur le site. */
const DRIVER_ID_ALIASES: Record<string, string> = {
  arvid_lindblad: "lindblad",
};

/** Noms d'écuries courts, identiques à ceux du reste du site. */
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

const driverNameById = Object.fromEntries(
  Object.values(driverPages).map((d) => [d.standingsId, d.name]),
);

export type JolpicaDriver = { driverId: string; givenName: string; familyName: string };
export type JolpicaConstructor = { constructorId: string; name: string };

export function siteDriverId(jolpicaId: string) {
  return DRIVER_ID_ALIASES[jolpicaId] ?? jolpicaId;
}

/** Nom affiché : celui de la fiche pilote du site, sinon prénom + nom. */
export function driverName(driver: JolpicaDriver) {
  return driverNameById[siteDriverId(driver.driverId)] ?? `${driver.givenName} ${driver.familyName}`;
}

export function teamName(team: JolpicaConstructor) {
  return TEAM_SHORT[team.constructorId] ?? team.name;
}

/** Récupère `MRData` d'un point d'accès Jolpica, ou lève une erreur. */
export async function fetchJolpica<T = Record<string, unknown>>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    next: { revalidate: F1_DATA_REVALIDATE },
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Jolpica ${path} : HTTP ${res.status}`);
  const data = await res.json();
  return data.MRData as T;
}

type DriverStandingsData = {
  StandingsTable: {
    season: string;
    StandingsLists: {
      round: string;
      DriverStandings: { position?: string; positionText: string; points: string; Driver: JolpicaDriver }[];
    }[];
  };
};

type ConstructorStandingsData = {
  StandingsTable: {
    StandingsLists: {
      ConstructorStandings: { position?: string; positionText: string; points: string; Constructor: JolpicaConstructor }[];
    }[];
  };
};

export type DriverStanding = { position: number; driverId: string; name: string; points: number };
export type ConstructorStanding = { position: number; teamId: string; name: string; points: number };

export async function getDriverStandings(): Promise<{ season: string; round: number; drivers: DriverStanding[] }> {
  const data = await fetchJolpica<DriverStandingsData>("current/driverstandings.json");
  const list = data.StandingsTable.StandingsLists[0];
  const drivers = (list?.DriverStandings ?? []).map((s, index) => ({
    position: Number(s.position ?? index + 1),
    driverId: siteDriverId(s.Driver.driverId),
    name: driverName(s.Driver),
    points: Number(s.points),
  }));
  return { season: data.StandingsTable.season, round: Number(list?.round ?? 0), drivers };
}

export async function getConstructorStandings(): Promise<ConstructorStanding[]> {
  const data = await fetchJolpica<ConstructorStandingsData>("current/constructorstandings.json");
  const list = data.StandingsTable.StandingsLists[0];
  return (list?.ConstructorStandings ?? []).map((s, index) => ({
    position: Number(s.position ?? index + 1),
    teamId: s.Constructor.constructorId,
    name: teamName(s.Constructor),
    points: Number(s.points),
  }));
}
