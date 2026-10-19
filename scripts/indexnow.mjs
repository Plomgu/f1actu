// Soumet toutes les URLs du sitemap à IndexNow (Bing, Yandex, Seznam…).
// Usage : npm run indexnow  (après un déploiement en production)

const SITE_URL = "https://www.f1actu.fr";
const KEY = "2d9ab4607510c46f8a1f00b04f2e3ee2";

const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then((res) => {
  if (!res.ok) throw new Error(`Sitemap inaccessible (${res.status})`);
  return res.text();
});

const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow : ${urlList.length} URLs soumises → ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
