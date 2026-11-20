export default {
  layout: "nyhet.njk",
  permalink: (data) => (data.page.fileSlug === "nyheter" ? data.permalink : `/nyheter/${data.page.fileSlug}/`),
};
