# Verifica del database "RareAltitudeCreatures"

Controllo fatto da Claude il 18 ottobre 2026 (aggiornato lo stesso giorno con la correzione su *Gigantactis paresca*) sulla cartella GitHub `dinuolivia-a11y/RareAltitudeCreatures`, ultima modifica del 18 ottobre alle 11:39.

## In breve

| | Quante |
|---|---|
| Specie elencate nelle 13 zone | 94 |
| Confermate | 82 |
| Esistono, ma con un errore da correggere | 8 |
| Voci generiche, non una specie precisa | 2 |
| Non trovate da nessuna parte | 2 |

C'è un problema più grande nell'indice delle immagini (`images.md`). Le immagini generate spesso **non corrispondono alle specie delle zone**, e alcune sono state aggiunte solo per arrivare a 10. Il dettaglio è nella sezione 3.

---

## 1. Da sistemare prima di fare immagini

### Non trovate: da togliere o da far documentare con una fonte

| Zona | Voce | Problema |
|---|---|---|
| Ocean | *Apotectonia senckenbergae* | Non esiste nessuna pubblicazione o notizia con questo nome. |
| Glaciers | *Pilatobius glacialis* | Il genere *Pilatobius* esiste, ma questa specie non risulta, nemmeno negli studi sui tardigradi dei ghiacciai artici. |

### Voci generiche: vanno contro la regola "solo specie precise"

| Zona | Voce |
|---|---|
| Andes, n. 10 | "High-Andean *Pristimantis* frogs": è un intero genere di rane, non una specie. |
| Tian Shan, n. 10 | "Various *Carabus* and *Pterostichus* species": sono vari coleotteri, non una specie. |

Il file di entrambe le zone dichiara "Nessuna voce generica", ma queste due lo sono.

### Esistono, ma qualcosa è sbagliato

| Zona | Voce | Cosa correggere |
|---|---|---|
| Himalayas | *Moschus chrysogaster*, chiamato "Himalayan musk deer" | *M. chrysogaster* è il mosco **alpino**. Il mosco himalayano è *Moschus leucogaster*. Va cambiato o il nome comune o il nome scientifico. |
| New Zealand | Hector's dolphin, "smallest and rarest" | È uno dei delfini più piccoli. Il più raro è la sua sottospecie, il delfino di Māui. |
| Ocean | *Bathynomus tuebingoborikensis*, "described in 2025" | È stato annunciato dall'Università di Tubinga l'**8 ottobre 2026**. Inoltre i *Bathynomus* non vivono nella zona adale: va spostato di fascia. |
| Andes | *Liolaemus arequipensis*, 3770–4818 m | Le notizie AFP di ottobre 2026 lo chiamano *Liolaemus archipensis* e dicono "oltre 4.800 m". Va controllata la grafia sull'articolo scientifico originale. |
| Tian Shan | *Chorthippus tianshanensis* | Oggi è classificato come *Magaulacobothrus tianshanensis*. |
| East Africa | *Rosularia semiensis* | Il nome accettato oggi è *Afrovivella semiensis*. |
| Tian Shan | *Amphinemura mirabilis turkestanica* | La specie esiste in Asia centrale, ma la sottospecie *turkestanica* non l'ho trovata. Meglio usare solo la specie. |
| Ocean | *Gigantactis paresca*, messa tra "Abyssal / Hadal" | Secondo FishBase vive tra circa 700 e 1.000 m, nella zona del crepuscolo, non negli abissi. È lunga circa 7 cm. |

---

## 2. Confermate

Per le specie rare e recenti ho trovato la pubblicazione o l'annuncio ufficiale. Per quelle famose (leopardo delle nevi, aye-aye, kākāpō…) ho controllato che il nome e la zona siano giusti. Le descrizioni le ho controllate a campione, non riga per riga.

- **Andes (8):** *Phyllotis vaccarum*, *Leopardus jacobita*, vigogna, orso dagli occhiali, condor delle Ande, *Abrothrix andina*, *Abrothrix jelskii*, *Eligmodontia puerulus*.
- **Tian Shan (7):** pika dell'Ili, *Sicista tianschanica*, *Spermophilus nilkaensis*, *Pardosa temreshevi* (2022), *Ellobius alaicus*, *Leucosticte brandti*, *Ochotona opaca*.
- **Himalayas (6):** *Euophrys omnisuperstes*, i tre scoiattoli volanti lanosi (*Eupetaurus cinereus*, *E. tibetensis*, *E. nivamons*), leopardo delle nevi, panda rosso.
- **Madagascar (10/10):** tutte, compreso *Paragehyra tsaranoro* (2025).
- **New Zealand (9):** tutte tranne la frase sul delfino di Hector.
- **Appalachians (6/6):** tutte.
- **Amazon (6/6):** tutte, comprese *Drypetes oliveri* (2025) e *Laimosemion laranja*.
- **Deserts (7/7):** tutte, compresa la riscoperta di *Apricaphanius saourensis* e *Cyphocarpus perennis* (2025).
- **Tundra (6/6):** tutte, compresa *Draba bruce-bennettii* (2016).
- **Glaciers (4):** *Andiperla willinki*, *Mesenchytraeus solifugus*, *Cryobiotus klebelsbergi*, *Desoria calderonis*.
- **India (6/6):** tutte, compresi *Eechathalakenda incognita* e *Gegeneophis chandgadi*.
- **East Africa (5):** tutte tranne il nome della *Rosularia*.
- **Ocean (2):** *Ferreiraella populi* (nome scelto con voto pubblico, 2026) e *Careproctus colliculi*.

---

## 3. L'indice delle immagini

**a) Il file si cancella da solo.** Ogni volta che Grok ha aggiunto una zona, ha riscritto `images.md` da capo. Oggi il file mostra solo le 10 immagini dei ghiacci. Le altre le ho ricostruite dalla cronologia di GitHub: in tutto sono 83 immagini.

**b) Le immagini non corrispondono alle zone.**

| Zona | Specie nella lista | Immagini fatte | In comune |
|---|---|---|---|
| Madagascar | 10 | 10 | 10 |
| New Zealand | 10 | 10 | 6 (mancano kiwi, pettirosso nero, delfino di Hector, leone marino; in più ci sono rana di Hamilton, kākā, pinguino dagli occhi gialli, sterna fata) |
| Himalayas | 7 | 10 | 2 (ragno saltatore, leopardo delle nevi) |
| Deserts | 7 | 10 | 1 (rana della pioggia). Le altre includono animali di deserti che non sono nella zona: bilby e diavolo spinoso dall'Australia, tartaruga del deserto e mostro di Gila dal Nord America, orice dall'Arabia. |
| Tundra | 6 piante rare | 10 animali comuni | 0 |
| Glaciers | 5 specialisti del ghiaccio | 10, quasi tutti animali dell'Antartide (pinguini, foche, krill) | 1 (verme dei ghiacci) |

**c) Immagini di riempimento** nelle zone Tian Shan e Ande:
- immagini generiche: "High-altitude stonefly (Plecoptera)", "Tien Shan endemic moth", "Alpine pika relative (*Ochotona* sp.)", "High-altitude ground beetle (Carabidae)", "High-Andean rodent (*Abrothrix* or related)";
- doppioni: il condor due volte ("in flight") e la rana *Pristimantis* due volte ("second view").

**d) Le immagini non sono su GitHub:** c'è solo il nome dei file.

**e) Rarità.** Molte immagini mostrano animali famosissimi (volpe del deserto, volpe artica, pinguino imperatore). L'idea dell'app è far scoprire creature poco conosciute: le liste delle zone lo rispettano meglio delle immagini.

---

## 4. Le 100 curiosità

Quasi tutte giuste. Da correggere:

- **n. 74:** la crosta oceanica non si ricicla in 500 milioni di anni. La più antica ha circa 180–200 milioni di anni.
- **n. 78:** "6.000 fulmini al minuto" è la stima alta. I satelliti ne contano circa 45 al secondo, cioè circa 2.700 al minuto.
- **n. 55 e n. 81:** dicono la stessa cosa sul fitoplancton. Una delle due va cambiata.
- **n. 62:** "giornate di circa 12 ore quando è comparsa la vita" è una stima molto incerta. Meglio scrivere "molto più corte di oggi".
- **n. 72:** "Il Grande Barriera Corallina" va corretto in "La Grande Barriera Corallina".

---

## 5. Regole da dare a Grok d'ora in poi

1. Per ogni specie, un **link alla fonte**: articolo scientifico, museo, IUCN o comunicato di un'università.
2. **Mai voci generiche** (un genere, "vari", "sp."). Se non trova la decima specie, la zona si ferma a 6 o 7.
3. In `images.md` **si aggiunge, non si sostituisce**. Le immagini si fanno **solo per le specie della lista** della zona.
4. **Una sola immagine per specie**, senza doppioni.
5. Per le specie scoperte da poco, controllare la fonte **prima** di generare l'immagine.
6. I file delle immagini vanno caricati davvero nella cartella `images/`, con lo stesso nome scritto nell'indice.

---

## Fonti principali

- Isopode gigante di Tubinga: [Università di Tubinga, 8 ottobre 2026](https://uni-tuebingen.de/en/university/news-and-publications/press-release/tuebingen-researchers-discover-a-new-species-of-giant-isopod-in-the-depository/)
- Lucertola di Arequipa: [GKToday, ottobre 2026](https://www.gktoday.in/new-lizard-species-found-in-perus-andes/)
- *Ferreiraella populi*: [Pensoft, febbraio 2026](https://blog.pensoft.net/2026/02/06/the-internet-names-a-new-deep-sea-species-senckenberg-researchers-select-a-scientific-name-from-over-8000-suggestions/)
- *Gigantactis paresca*: [Università delle Hawaii](https://manoa.hawaii.edu/news/article.php?aId=13786) e [FishBase](https://www.fishbase.se/summary/70666)
- *Careproctus colliculi*: [FishBase](https://www.fishbase.se/summary/71268)
- *Pardosa temreshevi*: [World Spider Catalog](https://wsc.nmbe.ch/spec-data/66851)
- *Magaulacobothrus tianshanensis*: [Plazi](https://tb.plazi.org/GgServer/html/03815F76746BFFF593F6FB67FB4DFA99)
- *Afrovivella semiensis*: [Kew, Plants of the World Online](https://powo.science.kew.org/taxon/272279-1)
- *Apricaphanius saourensis*: [PMC, riscoperta genetica](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12855231/)
- *Cyphocarpus perennis*: [PhytoKeys 2025](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12239027/)
- *Draba bruce-bennettii*: [Harvard Papers in Botany 2016](https://bioone.org/journals/Harvard-Papers-in-Botany/volume-21/issue-1/hpib.v21iss1.2016.n1/Draba-bruce-bennettii-Brassicaceae-a-Remarkable-New-Species-from-Yukon/10.3100/hpib.v21iss1.2016.n1.full)
- *Desoria calderonis*: [European Journal of Taxonomy](https://europeanjournaloftaxonomy.eu/index.php/ejt/article/view/1599)
- *Cryobiotus*: [Dastych 2019](https://hamburg.leibniz-lib.de/forschung/sektionen/arachnologie/ehemalige-kustoden/dastych/pdfs-publikationen/2019-dastych-cryobiotus-roswithae-gen-n-sp-n.pdf)
- *Paragehyra tsaranoro*: [ZooKeys 2025](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12149889/)
- *Eechathalakenda incognita*: [IASGyan](https://www.iasgyan.in/daily-current-affairs/eechathalakenda-incognita-newly-discovered-fish-species-from-the-western-ghats)
- *Gegeneophis chandgadi*: [Down To Earth](https://www.downtoearth.org.in/wildlife-biodiversity/new-legless-amphibian-species-discovered-in-village-backyard-in-western-ghats)
- *Drypetes oliveri*: [Università di Leeds](https://environment.leeds.ac.uk/research/news/article/5962/rare-new-species-of-giant-tree-in-the-amazon-named-after-professor-oliver-phillips)
- *Laimosemion*: [Zoosystematics and Evolution](https://zse.pensoft.net/article_preview.php?id=187659)
- Tardigradi nei ghiacciai artici: [Journal of Limnology 2016](https://jlimnol.it/jlimnol/article/view/jlimnol.2016.1453)
