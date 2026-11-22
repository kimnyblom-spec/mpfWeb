// Strukturerad data (schema.org) som hjälper Google att förstå företaget och sidorna.
const abs = (site, path) => (path && path.startsWith("http") ? path : site.url + (path || ""));

function foretag(site, startsida) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": site.url + "/#foretag",
    name: site.namn,
    description: site.beskrivning,
    url: site.url + "/",
    logo: abs(site, "/img/logo.png"),
    image: abs(site, "/img/og.jpg"),
    email: site.epost,
    telephone: "+46" + String(site.telefon || "").replace(/\D/g, "").replace(/^0/, ""),
    servesCuisine: "Catering",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.gatuadress,
      postalCode: site.postnummer,
      addressLocality: site.ort,
      addressRegion: "Västra Götalands län",
      addressCountry: "SE",
    },
    hasMap: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${site.gatuadress}, ${site.postnummer} ${site.ort}`),
    sameAs: [`https://www.instagram.com/${site.instagram_anvandare}/`],
  };
  const omraden = (site.leverans_omraden || []).filter(Boolean);
  data.areaServed = (omraden.length ? omraden : [site.ort]).map((n) => ({ "@type": "City", name: n }));
  return data;
}

function brodsmulor(site, steg) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: steg.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.namn, item: abs(site, s.url) })),
  };
}

function faq(fragor) {
  return {
    "@type": "FAQPage",
    mainEntity: (fragor || []).map((f) => ({
      "@type": "Question",
      name: f.fraga,
      acceptedAnswer: { "@type": "Answer", text: f.svar },
    })),
  };
}

function tjanst(site, d, url) {
  const graph = [
    {
      "@type": "Service",
      name: d.kort_namn,
      serviceType: d.title,
      description: d.seo_beskrivning,
      url: abs(site, url),
      image: d.bild ? abs(site, d.bild) : undefined,
      provider: { "@id": site.url + "/#foretag" },
      areaServed: ((site.leverans_omraden || []).length ? site.leverans_omraden : [site.ort]).map((n) => ({ "@type": "City", name: n })),
    },
    brodsmulor(site, [{ namn: "Start", url: "/" }, { namn: d.kort_namn, url }]),
  ];
  if ((d.fragor || []).length) graph.push(faq(d.fragor));
  return { "@context": "https://schema.org", "@graph": graph };
}

function nyhet(site, d, url, date) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: d.title,
        description: d.ingress,
        datePublished: new Date(date).toISOString().slice(0, 10),
        image: d.bild ? abs(site, d.bild) : abs(site, "/img/og.jpg"),
        url: abs(site, url),
        author: { "@id": site.url + "/#foretag" },
        publisher: { "@id": site.url + "/#foretag" },
      },
      brodsmulor(site, [{ namn: "Start", url: "/" }, { namn: "Nyheter", url: "/nyheter/" }, { namn: d.title, url }]),
    ],
  };
}

const faqSida = (fragor) => ({ "@context": "https://schema.org", ...faq(fragor) });

export default { foretag, faq, faqSida, tjanst, nyhet, brodsmulor };
