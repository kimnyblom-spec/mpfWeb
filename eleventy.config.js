import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";

const md = markdownIt({ html: false, breaks: true, linkify: true });

export default function (eleventyConfig) {
  // Filer som kopieras rakt av
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/uploads");
  // Originalbilderna kopieras också, så att de kan användas som delningsbild i sociala medier
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");
  // Typsnitten ligger på egen server (snabbare, och inga besökaruppgifter skickas till Google)
  for (const f of ["fraunces-latin-300-normal", "fraunces-latin-400-normal", "fraunces-latin-500-normal", "fraunces-latin-300-italic", "fraunces-latin-400-italic"])
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/fraunces/files/${f}.woff2`]: `fonts/${f}.woff2` });
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
  // Event: alla som inte är utkast, närmast först. Passerade event tas bort när sidan byggs
  // (och döljs dessutom i besökarens webbläsare dagen efter, ifall sidan inte byggts om sedan dess).
  const idag = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Stockholm" }).format(new Date());
  const evDag = (p) => new Date(p.data.datum).toISOString().slice(0, 10);
  const allaEvent = (api) =>
    api.getFilteredByGlob("src/event/*.md").filter((p) => !p.data.utkast && p.data.datum).sort((a, b) => evDag(a).localeCompare(evDag(b)));
  eleventyConfig.addCollection("event", allaEvent);
  eleventyConfig.addCollection("kommandeEvent", (api) => allaEvent(api).filter((p) => evDag(p) >= idag()));
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
  // Google-betyg som tal ("4,9" -> 4.9), eller 0 om det saknas
  eleventyConfig.addFilter("betyg", (v) => {
    const n = parseFloat(String(v || "").replace(",", "."));
    return n > 0 && n <= 5 ? n : 0;
  });
  // Omdömen som hör till en viss tjänstesida
  eleventyConfig.addFilter("forTjanst", (lista, namn) => (lista || []).filter((o) => o && o.tjanst && o.tjanst === namn));
  // Datumdelar för event: "veckodag" (tor), "dag" (3), "manad" (dec), "kort" (3 december), "lang" (torsdag 3 december 2026)
  eleventyConfig.addFilter("evdag", (d, del) => {
    const f = (o) => new Intl.DateTimeFormat("sv-SE", { timeZone: "UTC", ...o }).format(new Date(d));
    if (del === "veckodag") return f({ weekday: "short" }).replace(".", "");
    if (del === "dag") return f({ day: "numeric" });
    if (del === "manad") return f({ month: "short" }).replace(".", "");
    if (del === "kort") return f({ day: "numeric", month: "long" });
    return f({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
  });
  eleventyConfig.addFilter("first", (arr, n) => (arr || []).slice(0, n));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
