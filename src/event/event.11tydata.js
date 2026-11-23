// Adressen byggs av namn och datum, t.ex. /event/pensla-pimpla-2026-12-03/,
// så att samma event kan återkomma flera gånger utan att adresserna krockar.
const slug = (s) =>
  String(s).toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/é/g, "e").replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default {
  layout: "event.njk",
  harKontakt: true,
  eleventyComputed: {
    // Är event avstängda i admin, eller eventet är ett utkast, byggs ingen sida
    permalink: (data) => {
      if (data.page.fileSlug === "event") return data.synlighet.event === false ? false : "/event/";
      if (data.synlighet.event === false || data.utkast) return false;
      if (!data.title || !data.datum) return false;
      return `/event/${slug(data.title)}-${new Date(data.datum).toISOString().slice(0, 10)}/`;
    },
    ogbild: (data) => data.bild,
    seo_titel: (data) => (data.title ? `${data.title} – event i Kungälv | Mat på Fat` : data.seo_titel),
    seo_beskrivning: (data) => data.kort || data.seo_beskrivning,
    extraSchema: (data) => (data.title && data.page.fileSlug !== "event" ? data.schema.event(data.site, data, data.page.url) : undefined),
  },
};
