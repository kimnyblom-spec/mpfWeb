// Publikt: tar emot en anmälan från formuläret och reserverar platser
import { andra, hamtaEvent, json, kvar, rensaPerson, idag } from "../lib/bokning.js";

export default async (req) => {
  if (req.method !== "POST") return json({ fel: "Fel metod" }, 405);
  let d;
  try {
    d = await req.json();
  } catch {
    return json({ fel: "Felaktig förfrågan" }, 400);
  }
  if (d["bot-field"]) return json({ ok: true }); // fälla för spamrobotar

  try {
    const { event } = await hamtaEvent(req);
    const ev = event.find((e) => e.id === d.event);
    if (!ev) return json({ fel: "Eventet finns inte längre." }, 404);
    if (ev.dag < idag()) return json({ fel: "Eventet har redan varit." }, 410);
    const { p, fel } = rensaPerson(d);
    if (fel) return json({ fel }, 400);

    const ny = { id: crypto.randomUUID(), skapad: new Date().toISOString(), kalla: "hemsidan", ...p };
    const svar = await andra(ev.id, ev.dag, (post) => {
      const ledigt = kvar(ev, post);
      const fullt = ev.stangd || ledigt === 0;
      if (d.ko || fullt) {
        if (!d.ko) return { avbryt: true, status: 409, fel: "Eventet blev fullbokat. Vill du ställa dig i kö i stället?", kvar: 0 };
        post.ko.push(ny);
        return { ko: true };
      }
      if (ledigt !== null && p.antal > ledigt)
        return { avbryt: true, status: 409, fel: `Det finns bara ${ledigt} ${ledigt === 1 ? "plats" : "platser"} kvar.`, kvar: ledigt };
      post.bokningar.push(ny);
      return { ko: false };
    });
    if (svar.avbryt) return json({ fel: svar.fel, kvar: svar.kvar }, svar.status);
    return json({ ok: true, ko: svar.ko, kvar: kvar(ev, svar.post) });
  } catch (e) {
    return json({ fel: e.message }, 500);
  }
};

export const config = { path: "/api/boka" };
