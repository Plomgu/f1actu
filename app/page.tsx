import HomeClient from "./HomeClient";
import { getStandings } from "./lib/jolpica";
import { getNews } from "./lib/news";

// Régénérée toutes les 5 minutes : les robots reçoivent les actus, le
// classement et le prochain Grand Prix directement dans le HTML.
export const revalidate = 300;

export default async function Home() {
  const [news, standings] = await Promise.all([getNews().catch(() => []), getStandings()]);
  return <HomeClient initialNews={news} initialStandings={standings?.drivers ?? []} />;
}
