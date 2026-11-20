export default {
  layout: "nyhet.njk",
  eleventyComputed: {
    // Är nyheterna avstängda i admin byggs inga nyhetssidor
    permalink: (data) => (data.synlighet.nyheter === false ? false : data.page.fileSlug === "nyheter" ? "/nyheter/" : `/nyheter/${data.page.fileSlug}/`),
    ogtyp: (data) => (data.page.fileSlug === "nyheter" ? "website" : "article"),
    ogbild: (data) => data.bild,
    seo_titel: (data) => (data.title ? `${data.title} | Mat på Fat` : data.seo_titel),
    seo_beskrivning: (data) => data.ingress || data.seo_beskrivning,
    extraSchema: (data) => (data.title && data.page.fileSlug !== "nyheter" ? data.schema.nyhet(data.site, data, data.page.url, data.page.date) : undefined),
  },
};
