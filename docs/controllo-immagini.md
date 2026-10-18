# Controllo delle immagini di Grok · 18 ottobre 2026

Grok ha caricato 102 immagini in `RareAltitudeCreatures/images/`: 12 con il nome (`portraits/`) e 90 con un codice (`session/`). Claude le ha guardate tutte. 13 riguardano le creature del Madagascar di Orbis. Per oceano e Amazzonia non ce n'è nessuna.

Ogni immagine è stata confrontata con i tratti veri della specie, presi dalle descrizioni scientifiche.

## Madagascar

| Creatura | File di Grok | Esito | Perché |
|---|---|---|---|
| Aye-aye | `portraits/aye-aye.jpg` | ✅ inserita | Pelo scuro arruffato, orecchie enormi, occhi arancio, dito medio lungo e sottile ben visibile. |
| Aye-aye | `session/kX3eo.jpg` | ❌ scartata | Orecchie chiare e piccole da galagone, dito esagerato a uncino. |
| Fossa | `portraits/fossa.jpg` | ✅ inserita | Corpo da felino, pelo bruno-rossiccio uniforme, orecchie tonde, coda lunga quanto il corpo. |
| Fossa | `session/hF9Z7.jpg` | ✅ buona, di riserva | Corretta anche questa. |
| Microcebo di Madame Berthe | `session/WWiSn.jpg` | ✅ inserita | Minuscolo lemure rossiccio, occhi enormi, di notte tra i rametti. |
| Geco di Tsaranoro | `session/dX37E.jpg` | ✅ inserita | Geco marrone screziato su roccia di granito, file di tubercoli sul dorso. Specie descritta nel 2025: esistono pochissime foto. |
| Moriglione del Madagascar | `session/vimSf.jpg` | ✅ inserita | Anatra tuffatrice bruno-castana. Ha gli occhi scuri, quindi è una femmina: i maschi li hanno bianchi. |
| Ratto gigante | `session/Aru3h.jpg` | ✅ inserita | Grande roditore grigio-bruno con orecchie dritte e zampe posteriori forti, nella foresta secca. Le orecchie vere sono un po' più grandi. |
| Indri | `portraits/indri.jpg`, `session/yaQPW.jpg` | ❌ da rifare | Colori invertiti: qui è quasi tutto bianco, ma l'indri vero è soprattutto nero con chiazze bianche. Inoltre ha occhi arancio invece che verdi. |
| Vanga elmo | `session/IfI1P.jpg` | ❌ da rifare | Petto bianco e dorso nero. Il vanga elmo vero ha petto e pancia neri e dorso, ali e coda castano-rossicci. |
| Mesite pettobianco | `session/wBuLV.jpg` | ❌ da rifare | Dorso a puntini bianchi e petto bianco liscio, forma da tordo. Il mesite vero ha il dorso bruno uniforme, una fascia fulva sul petto, la pancia barrata di nero e la coda lunga. |
| Camaleonte nano | `session/kEUqa.jpg` | ❌ da rifare | Coda lunga e arrotolata, e troppo grande rispetto al dito. Il *Brookesia nana* è lungo 2 cm e ha la coda corta e dritta. |

Ho reso più precisi i prompt delle 4 creature da rifare, aggiungendo proprio i tratti che erano sbagliati. Li trovi in `prompt-creature.md` e nel Laboratorio immagini dell'app.

## Le nuove zone

Con le altre 89 immagini di Grok abbiamo aperto 7 nuovi luoghi sul globo. Le specie le ha verificate Claude, con le fonti, prima di scrivere le schede. Per i nomi generici, per esempio "un coleottero del Tian Shan" o "una rana delle Ande", non abbiamo usato nessuna immagine: non si può dire di che specie sia.

| Zona | Inserite | Scartate o mancanti |
|---|---|---|
| Himalaya (12) | ragno saltatore (`g2Pqo`), tetraogallo (`W2pON`), leopardo delle nevi (`portraits/snow-leopard`), orso bruno (`bmSuT`), pika di Royle (`tODQ7`), tahr (`1EYA2`), monal (`7AeWN`), tragopan (`FZZUL`), panda rosso (`portraits/red-panda`) | gipeto: l'uccello è troppo piccolo e lontano (`orP7Z`). Volpe del Tibet: non ha la testa quadrata né la coda a punta bianca (`NWNmC`). Scoiattolo volante lanoso: non c'era. |
| Nuova Zelanda (9) | kea (`VKNdZ`), takahē (`0WjCC`), kākā (`41nxb`), kākāpō (`portraits/kakapo`), pipistrello dalla coda corta (`CgvKY`), cavaliere nero (`W3gxT`), tuatara (`portraits/tuatara`), fraticello fata (`jZPw0`), pinguino dagli occhi gialli (`8vrR6`) | Tutte presenti. Le 3 rane sono generiche e non si sa di che specie siano. |
| Tundra artica (10) | gabbiano d'avorio (`2YOQZ`), civetta delle nevi (`GVYo0`), bue muschiato (`YWHj6`), lupo artico (`8hrnr`), lepre artica (`A0M0y`), volpe artica (`6TagW`), pernice bianca (`Ae79f`), citello artico (`gUEf7`) | Zigolo delle nevi: ha una mascherina nera sugli occhi che quello vero non ha (`3aPO3`). Lemming: in `HfTBH` e `ZuTwp` il muso è appuntito come quello di un ermellino, e Grok stesso le chiama «ermellino». In più `ZuTwp` ha un collare nero disegnato che il lemming non ha. |
| Antartide (10) | petrello delle nevi (`0kRrD`), stercorario (`9DSIk`), pinguino imperatore (`9LnW6`), pinguino di Adelia (`CqY0z`), krill (`giDPW`), pesce argento (`LJvXN`), foca di Weddell (`mMsXz`) | Foca cancrivora: muso tondo da foca comune, mentre quella vera lo ha lungo e appuntito (`BzLzz`). Pesce ghiaccio e moscerino antartico: non c'erano. |
| Tian Shan (7) | pika dell'Ili (`portraits/ili-pika`), ragno lupo (`BfP7G`), Apollo del Tian Shan (`EIIKO`), citello (`SxyPZ`) | Talpa-arvicola: in `3q8Ld` non si vedono i lunghi denti sporgenti che usa per scavare, e Grok la chiama «talpa». Sicista: nessun topolino con la striscia nera sul dorso (`4pdJO`, `jXcgL`). Fringuello alpino: non c'era. Coleotteri, falena e plecottero: generici. |
| Ande (7) | topo dalle orecchie a foglia (`4pdJO`), condor (`MBd0a`), lucertola di Arequipa (`jzs3b`), gatto delle Ande (`portraits/andean-cat`), vigogna (`Cbe2F`), orso dagli occhiali (`6c3Xd`) | Rana del Titicaca: non c'era. |
| Sahara (7) | addax (`FNsTz`), gatto delle sabbie (`RuzxK`), fennec (`tfTB3`), formica argentata (`KE2BV`) | Vipera cornuta, pesce delle sabbie e gerboa: non c'erano. |

**Tenute da parte:** orice d'Arabia, diavolo spinoso, bilby, mostro di Gila, tartaruga del deserto, rana della pioggia, verme dei ghiacci, plecottero dei ghiacciai, lupo etiope, gelada, macaco dalla coda di leone. Sono di posti che sul globo non abbiamo ancora, e le useremo quando li apriremo.

I prompt per tutte le immagini che mancano sono in `per-grok.md`.
