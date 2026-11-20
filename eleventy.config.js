import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";

const md = markdownIt({ html: false, breaks: true, linkify: true });

export default function (eleventyConfig) {
  // Filer som kopieras rakt av
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/uploads");
  // Originalbilderna kopieras också, så att de kan användas som delningsbild i sociala medier
  eleventyConfig.addPassthroughCopy("src/img");
  // Typsnitten ligger på egen server (snabbare, och inga besökaruppgifter skickas till Google)
  for (const f of ["jost-latin-300-normal", "jost-latin-400-normal", "jost-latin-500-normal"])
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/jost/files/${f}.woff2`]: `fonts/${f}.woff2` });
  for (const f of ["cormorant-garamond-latin-500-normal", "cormorant-garamond-latin-600-normal", "cormorant-garamond-latin-500-italic"])
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/cormorant-garamond/files/${f}.woff2`]: `fonts/${f}.woff2` });
  eleventyConfig.addPassthroughCopy("src/admin/config.yml");
  // Admin-gränssnittet (Sveltia CMS) hämtas från npm-paketet
  eleventyConfig.addPassthroughCopy({ "node_modules/@sveltia/cms/dist": "admin/cms" });

  // Bilder skalas om och görs till webp automatiskt vid bygget,
  // så att stora mobilbilder som laddas upp i admin inte gör sidan långsam.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "auto"],
    widths: [480, 960, 1600],
    failOnError: false,
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async", sizes: "(max-width: 900px) 100vw, 50vw" },
    },
  });

  // Nyheter, senaste först
  eleventyConfig.addCollection("nyheter", (api) =>
    api.getFilteredByGlob("src/nyheter/*.md").filter((p) => !p.data.utkast).sort((a, b) => b.date - a.date)
  );
  // Tjänstesidor i vald ordning
  eleventyConfig.addCollection("tjanst", (api) =>
    api.getFilteredByGlob("src/tjanster/*.md").filter((p) => p.data.visa !== false).sort((a, b) => (a.data.ordning ?? 99) - (b.data.ordning ?? 99))
  );
  // Menyer i vald ordning
  eleventyConfig.addCollection("menyer", (api) =>
    api.getFilteredByGlob("src/menyer/*.md").sort((a, b) => (a.data.ordning ?? 99) - (b.data.ordning ?? 99))
  );

  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("mdInline", (s) => (s ? md.renderInline(String(s)) : ""));
  eleventyConfig.addFilter("datum", (d) =>
    new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d))
  );
  eleventyConfig.addFilter("isodatum", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("tel", (s) => "+46" + String(s || "").replace(/\D/g, "").replace(/^0/, ""));
  eleventyConfig.addFilter("synliga", (rows) => (rows || []).filter((r) => r && String(r.pris || "").trim() !== ""));
  eleventyConfig.addFilter("medKategori", (menyer, kat) => (menyer || []).filter((m) => m.data.kategori === kat));
  // Finns sidan med den här adressen (dvs. är den inte dold)?
  eleventyConfig.addFilter("harUrl", (sidor, url) => !!url && (sidor || []).some((p) => p.url === url));
  eleventyConfig.addFilter("first", (arr, n) => (arr || []).slice(0, n));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
