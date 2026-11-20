# matpafat.se

Hemsida för Mat på Fat: catering, privat kock och eventlokal i Kungälv.

- Byggs med [Eleventy](https://www.11ty.dev/) till en statisk sida (`_site/`).
- Innehåll (priser, menyer, nyheter, texter) redigeras i ett admin-gränssnitt på `/admin`
  ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)) som sparar direkt i det här repot.
- Hostas på Netlify, som bygger om sidan automatiskt vid varje ändring. Offertformuläret går via Netlify Forms.

**Instruktion för den som uppdaterar innehållet:** se [ADMIN-GUIDE.md](ADMIN-GUIDE.md).

## Struktur

| Sökväg | Innehåll |
|---|---|
| `src/_data/priser.json` | Prislistan |
| `src/_data/site.json` | Kontaktuppgifter, leverans, Instagram |
| `src/_data/startsida.json` | Texter och bilder på startsidan |
| `src/nyheter/*.md` | Nyheter (en fil per nyhet) |
| `src/menyer/*.md` | Exempelmenyer |
| `src/uploads/` | Bilder och PDF:er som laddas upp i admin |
| `src/index.njk`, `src/_includes/` | Mallar |
| `src/style.css` | Design |
| `src/admin/config.yml` | Fälten i admin-gränssnittet |

## Köra lokalt

```sh
npm install
npm start        # http://localhost:8080
npm run build    # bygger till _site/
```

## Publicera (görs en gång)

1. **Slå ihop koden till `main`.** Admin-gränssnittet sparar till grenen `main`.
2. **Netlify:** skapa ett gratiskonto på netlify.com och välj *Add new site → Import an existing project → GitHub*,
   repot `mpfWeb` och grenen `main`. Bygginställningarna läses från `netlify.toml`.
3. **Inloggning till admin (GitHub OAuth):**
   1. På GitHub: *Settings → Developer settings → OAuth Apps → New OAuth App*.
      - Homepage URL: `https://www.matpafat.se`
      - Authorization callback URL: `https://api.netlify.com/auth/done`
   2. I Netlify: *Site configuration → Access & security → OAuth → Install provider → GitHub*
      och klistra in Client ID och Client Secret.
   3. Bjud in den som ska redigera som *collaborator* med skrivrätt på repot på GitHub.
4. **Formulär:** i Netlify, *Forms → Enable form detection*, och lägg sedan till ett e-postmeddelande
   under *Forms → Form notifications* till info@matpafat.se.
5. **Domänen (hos Simply.com):** i Netlify, *Domain management → Add domain → matpafat.se*. Netlify visar
   vilka DNS-poster som ska in. Ändra **bara** A- och CNAME-posterna för `matpafat.se` och `www` hos
   Simply.com. **Rör inte MX-posterna**, annars slutar mejlen fungera. HTTPS ordnas automatiskt.
6. Säg upp Webnode när allt fungerar. De gamla Webnode-adresserna skickas vidare till rätt del av
   nya sidan (se `netlify.toml`).
