export default {
  layout: "tjanst.njk",
  harKontakt: true,
  permalink: (data) => (data.adress ? `/${data.adress}/` : `/${data.page.fileSlug}/`),
  eleventyComputed: {
    ogbild: (data) => data.bild,
    extraSchema: (data) => data.schema.tjanst(data.site, data, data.page.url),
  },
};
