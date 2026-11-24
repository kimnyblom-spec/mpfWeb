# Så uppdaterar du hemsidan

Allt görs på **www.matpafat.se/admin**. Logga in med **Logga in med GitHub**.
Det finns också en illustrerad manual som PDF: [docs/Mat-pa-Fat-hemsidan-manual.pdf](docs/Mat-pa-Fat-hemsidan-manual.pdf).

## Spara och publicera

**Spara** sparar ändringen, men den syns **inte** på hemsidan än. Gör gärna alla ändringar du vill först.
Sedan trycker du på den orange knappen **Publicera (3)** längst ner till vänster. Där ser du allt som väntar
och trycker **Publicera alla**. Ändringarna syns på hemsidan **1–2 minuter** senare.

Varför? Varje publicering kostar lite hos Netlify (webbhotellet). Flera ändringar i en publicering kostar lika
mycket som en.

> Admin visas på samma språk som webbläsaren. Står det Save, New och Delete i stället för Spara, Ny och Radera är webbläsaren inställd på engelska.

> Gör du fel är det ingen fara. Varje ändring sparas i en historik och kan ångras.

---

## Ändra ett pris

1. Gå till **Priser, kontakt och texter → Priser**.
2. Klicka på raden du vill ändra, till exempel *Buffé*.
3. Skriv priset i fältet **Pris**, till exempel `295`, `fr. 295` eller `250–350`.
4. Klicka **Spara** uppe till höger.

- **Dölja en rad:** töm fältet *Pris*. Rader utan pris syns inte på hemsidan.
- **Ny rad:** klicka **Lägg till Prisrad** längst ner i listan.
- **Fotnot:** under listan finns plats för t.ex. "Alla priser inkl. moms".
- Har ingen rad något pris visas inte prisrutan alls, och kunderna ser bara "Begär offert".

## Lägga upp en exempelmeny

1. Gå till **Menyförslag** och klicka **Ny**.
2. Fyll i namn, kategori och gärna en kort beskrivning, t.ex. *"Från 295 kr/person, minst 15 personer"*.
3. Antingen:
   - **ladda upp en PDF** under *Meny som PDF*, eller
   - **skriv menyn** i textfältet (en rätt per rad med ett streck först blir en punktlista).
4. **Ordning** styr vilken meny som visas först (lägst nummer först).
5. Klicka **Spara**.

Ta bort en gammal meny: öppna den och välj **Radera** i menyn (tre prickar) uppe till höger.

## Publicera en nyhet

1. Gå till **Nyheter** och klicka **Ny**.
2. Skriv **rubrik**, välj **datum** och skriv en **kort sammanfattning** (den syns på nyhetskortet).
3. Ladda upp en **bild**. Mobilbilder går bra, de görs mindre automatiskt. Skriv några ord i
   **Bildbeskrivning**, t.ex. "Julbord med skinka och sill".
4. Skriv själva texten. Knapparna ovanför fältet ger **fetstil**, listor, länkar och fler bilder.
5. Klicka **Spara**.

De tre senaste nyheterna visas på startsidan, och alla finns under **Nyheter**.

- **Inte klar ännu?** Bocka i **Utkast** så sparas nyheten utan att synas.
- Nyheter är bra för det som ska ligga kvar: nya menyer, säsongens event, julbord och sommaröppet.
  Vardagliga bilder passar bättre på Instagram, som visas på sidan ändå.

## Ändra kontaktuppgifter, leverans eller texter

- **Priser, kontakt och texter → Kontakt, leverans och Instagram:** telefon, adress, svarstid,
  vilka orter ni levererar till, leveransavgifter och framförhållning.
- **Priser, kontakt och texter → Texter på startsidan:** alla rubriker och texter på startsidan,
  bilderna och kundomdömen.

## Instagram på hemsidan

Hemsidan kan visa era senaste Instagram-inlägg automatiskt. Det görs med den kostnadsfria
tjänsten **Behold**:

1. Skapa ett konto på **behold.so** och koppla ert Instagram-konto.
2. Skapa ett flöde (feed) och kopiera dess **feed-id**.
3. Klistra in id:t i admin under **Kontakt, leverans och Instagram → Instagram-flöde (Behold feed-id)**
   och spara.

Därefter uppdateras bilderna på hemsidan av sig själva när ni lägger upp något på Instagram.

Vill ni hellre välja inlägg själva? Lämna Behold-fältet tomt och klistra in länkar till enskilda
inlägg under **Utvalda Instagram-inlägg**.

## Offertförfrågningar

Formuläret på hemsidan skickas till Netlify, som mejlar förfrågan till info@matpafat.se. Ni kan
också se alla förfrågningar i Netlify under **Forms**.

## Tjänstesidor (viktiga för Google)

Under **Tjänstesidor** finns egna sidor för bröllop, minnesstund, företag och event, catering,
privat kock och lokalen. De är gjorda för att synas när någon googlar t.ex. "bröllopscatering Kungälv".

- **Rubrik på sidan**, **Titel i Google** och **Beskrivning i Google** ska nämna vad ni gör och var,
  t.ex. "Bröllopscatering i Kungälv". Titeln bör vara högst ca 60 tecken.
- **Vanliga frågor** visas på sidan och kan dyka upp direkt i Googles sökresultat. Lägg gärna till
  frågor som kunder ofta ställer.
- **Ändra inte Webbadress** på en befintlig sida, då slutar länkar från Google att fungera.
- **Visa som stort kort på startsidan** styr vilka tjänster som syns överst på startsidan.

## Tips för att synas bättre på Google

- **Bildbeskrivning:** fyll alltid i den. Google läser den.
- **Filnamn:** uppladdade bilder får automatiskt ett filnamn efter originalnamnet. Döp gärna bilden
  innan du laddar upp den, t.ex. `brollop-marstrand-buffe.jpg` i stället för `IMG_5307.jpg`.
- **Nyheter med säsongens sökord:** skriv om julbord i oktober, studentmottagning i april och
  bröllop under vintern. Nämn gärna orter och platser.
- **Google-recensioner:** be nöjda kunder om en recension och svara på dem. Det påverkar mycket
  hur högt ni syns i kartan.

## Visa eller dölja delar av hemsidan

Under **Priser, kontakt och texter → Visa på hemsidan** finns ett reglage för varje del av
startsidan: prislista, menyförslag, leverans, nyheter, Instagram, butik, kundomdömen, vanliga
frågor, privat kock och lokalen. Stäng av en del så syns den inte, men innehållet ligger kvar i
admin. Då kan du förbereda till exempel priser och menyer i lugn och ro och slå på dem när de är klara.

Varje tjänstesida har också ett reglage, **Visa sidan på hemsidan**. En avstängd sida försvinner
helt: från menyn, länkarna och Google. **Namn i huvudmenyn** styr om sidan syns i menyn högst upp.

Från start är **prislista, menyförslag, leverans och kundomdömen avstängda**.
