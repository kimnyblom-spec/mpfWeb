export default {
  layout: "tjanst.njk",
  harKontakt: true,
  eleventyComputed: {
    // Dolda tjänstesidor byggs inte alls, så de syns varken på hemsidan eller hos Google
    permalink: (data) => (data.visa === false ? false : data.adress ? `/${data.adress}/` : `/${data.page.fileSlug}/`),
    ogbild: (data) => data.bild,
    extraSchema: (data) => data.schema.tjanst(data.site, data, data.page.url),
  },
};
