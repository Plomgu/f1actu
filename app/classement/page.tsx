import ClassementClient from "./ClassementClient";
import { getStandings } from "../lib/jolpica";

// Régénérée toutes les 5 minutes : les robots reçoivent le classement à jour.
export const revalidate = 300;

export default async function ClassementPage() {
  return <ClassementClient initialStandings={await getStandings()} />;
}
