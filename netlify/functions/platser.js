// Publikt: hur många platser som finns kvar på varje kommande event (inga personuppgifter)
import { butik, hamtaEvent, json, kvar, idag } from "../lib/bokning.js";

export default async (req) => {
  try {
    const { event } = await hamtaEvent(req);
    const store = butik();
    const dag = idag();
    const ut = {};
    await Promise.all(
      event.filter((e) => e.dag >= dag).map(async (e) => {
        const post = await store.get(e.id, { type: "json" });
        const k = kvar(e, post);
        ut[e.id] = { kapacitet: e.kapacitet || null, kvar: k, stangd: !!e.stangd };
      })
    );
    return new Response(JSON.stringify(ut), {
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate" },
    });
  } catch (e) {
    return json({ fel: e.message }, 500);
  }
};

export const config = { path: "/api/platser" };
