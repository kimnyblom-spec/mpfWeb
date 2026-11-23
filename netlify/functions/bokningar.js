// Bokningslistan för admin. Skyddad med lösenordet i miljövariabeln BOKNING_LOSENORD (sätts i Netlify).
import { timingSafeEqual, createHash } from "node:crypto";
import { andra, butik, bokade, hamtaEvent, json, kvar, rensaPerson, idag } from "../lib/bokning.js";

const SPARA_DAGAR = 90; // bokningar raderas tre månader efter eventet

function behorig(req) {
  const losen = process.env.BOKNING_LOSENORD || "";
  const givet = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!losen || !givet) return false;
  const h = (s) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(losen), h(givet));
}

function gransdag() {
  const d = new Date(idag() + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - SPARA_DAGAR);
  return d.toISOString().slice(0, 10);
}

export default async (req) => {
  if (!process.env.BOKNING_LOSENORD) return json({ fel: "Inget lösenord är inställt för bokningslistan ännu (BOKNING_LOSENORD i Netlify)." }, 503);
  if (!behorig(req)) {
    await new Promise((r) => setTimeout(r, 800));
    return json({ fel: "Fel lösenord." }, 401);
  }
  try {
    const { event } = await hamtaEvent(req);
    const store = butik();

    if (req.method === "GET") {
      // Rensa bort gamla bokningar
      const grans = gransdag();
      const { blobs } = await store.list();
      const poster = {};
      for (const { key } of blobs) {
        const post = await store.get(key, { type: "json" });
        if (post?.dag && post.dag < grans) await store.delete(key);
        else poster[key] = post;
      }
      const kanda = new Set(event.map((e) => e.id));
      const lista = [
        ...event,
        // Event som tagits bort i admin men har bokningar kvar
        ...Object.keys(poster).filter((k) => !kanda.has(k)).map((k) => ({ id: k, titel: k, dag: poster[k]?.dag || "", borttaget: true })),
      ].filter((e) => !e.dag || e.dag >= grans);
      return json({
        idag: idag(),
        spara_dagar: SPARA_DAGAR,
        event: lista.map((e) => {
          const post = poster[e.id];
          return { ...e, bokade: bokade(post), kvar: kvar(e, post), bokningar: post?.bokningar || [], ko: post?.ko || [] };
        }),
      });
    }

    if (req.method !== "POST") return json({ fel: "Fel metod" }, 405);
    const d = await req.json();
    const ev = event.find((e) => e.id === d.event) || { id: d.event, dag: "" };
    if (!d.event) return json({ fel: "Event saknas." }, 400);

    if (d.action === "avboka") {
      await andra(ev.id, ev.dag, (post) => {
        post.bokningar = post.bokningar.filter((b) => b.id !== d.id);
        post.ko = post.ko.filter((b) => b.id !== d.id);
      });
      return json({ ok: true });
    }
    if (d.action === "flytta") {
      await andra(ev.id, ev.dag, (post) => {
        const b = post.ko.find((x) => x.id === d.id);
        if (!b) return;
        post.ko = post.ko.filter((x) => x.id !== d.id);
        post.bokningar.push({ ...b, fran_ko: true });
      });
      return json({ ok: true });
    }
    if (d.action === "lagg-till") {
      const { p, fel } = rensaPerson(d, { epostKravs: false });
      if (fel) return json({ fel }, 400);
      const ny = { id: crypto.randomUUID(), skapad: new Date().toISOString(), kalla: "manuell", ...p };
      await andra(ev.id, ev.dag, (post) => {
        (d.ko ? post.ko : post.bokningar).push(ny);
      });
      return json({ ok: true });
    }
    return json({ fel: "Okänd åtgärd" }, 400);
  } catch (e) {
    return json({ fel: e.message }, 500);
  }
};

export const config = { path: "/api/bokningar" };
