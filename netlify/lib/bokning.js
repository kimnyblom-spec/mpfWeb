// Gemensam logik för eventbokningar.
// Bokningarna sparas i Netlify Blobs (inte i Git-repot, som är publikt).
// En nyckel per event: { dag, bokningar: [...], ko: [...] }
import { getStore } from "@netlify/blobs";

export const butik = () => getStore({ name: "eventbokningar", consistency: "strong" });

// Eventen (namn, datum, antal platser) publiceras av bygget som /event-data.json
let cache = { tid: 0, url: "", data: null };
export async function hamtaEvent(req) {
  const url = new URL("/event-data.json", req.url).toString();
  if (cache.data && cache.url === url && Date.now() - cache.tid < 30_000) return cache.data;
  const res = await fetch(url, { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error("Kunde inte läsa eventlistan");
  const data = await res.json();
  cache = { tid: Date.now(), url, data };
  return data;
}

export const tom = (dag) => ({ dag, bokningar: [], ko: [] });
export const bokade = (post) => (post?.bokningar || []).reduce((s, b) => s + (Number(b.antal) || 0), 0);

// Läs, ändra och spara ett event. Görs om ifall någon annan hann spara emellan,
// så att två samtidiga bokningar aldrig kan ta samma plats.
export async function andra(id, dag, fn) {
  const store = butik();
  for (let i = 0; i < 8; i++) {
    const nu = await store.getWithMetadata(id, { type: "json" });
    const post = nu?.data || tom(dag);
    if (!post.dag && dag) post.dag = dag;
    const svar = await fn(post);
    if (svar?.avbryt) return svar;
    const res = nu
      ? await store.setJSON(id, post, { onlyIfMatch: nu.etag })
      : await store.setJSON(id, post, { onlyIfNew: true });
    if (res.modified) return { ...svar, post };
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 120));
  }
  throw new Error("Det är många som bokar just nu. Försök igen.");
}

export function idag() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Stockholm" }).format(new Date());
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const kort = (v, max) => String(v ?? "").trim().slice(0, max);
export function rensaPerson(d, { epostKravs = true } = {}) {
  const p = {
    namn: kort(d.namn, 120),
    epost: kort(d.epost, 200),
    telefon: kort(d.telefon, 40),
    antal: Math.floor(Number(d.antal)),
    meddelande: kort(d.meddelande, 2000),
  };
  if (!p.namn) return { fel: "Skriv ditt namn." };
  if ((epostKravs || p.epost) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.epost)) return { fel: "Skriv en giltig e-postadress." };
  if (!(p.antal >= 1 && p.antal <= 20)) return { fel: "Ange antal platser (1–20)." };
  return { p };
}

// Lediga platser för ett event, eller null om eventet saknar antal platser
export function kvar(ev, post) {
  if (!ev.kapacitet) return null;
  return Math.max(0, ev.kapacitet - bokade(post));
}
