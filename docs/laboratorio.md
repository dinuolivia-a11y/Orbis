# Il Laboratorio (il gioco di Orbis)

Nato da un'idea di Sofia («ma non c'è un quiz?») e di Olivia: non un quiz normale, ma un gioco in cui si impara facendo.
Si entra dalla sezione **Lezioni**, con il riquadro «Il Laboratorio» e il suo tasto verde (indirizzo diretto: `#gioco`). Il gioco si apre a tutto schermo, sopra il resto di Orbis.

## Come funziona

- Il padrone di casa è il **professor Edward**, lo scienziato più distratto del mondo: ha lasciato il laboratorio al buio e ha dimenticato il codice del suo armadietto.
- All'ingresso compare il titolo, poi la stanza del laboratorio riempie lo schermo. Il professore parla in un fumetto: un tocco finisce la frase, un altro la chiude. Ogni frase la dice una volta sola; toccando il professore la ripete.
- In basso c'è un cartello con il percorso dei passi, il prossimo passo e il tasto **Gioca**. Ogni passo si sblocca completando quello prima; quelli già fatti si possono rigiocare toccandoli.
- Il tasto con la porta, in alto, mostra le stanze: una aperta e tre in arrivo.
- **Esperimenti** in tre momenti: *Scommetti* (una domanda prima di toccare), *Prova* (si versa e si mescola davvero), *Scopri* (perché succede, come rifarlo a casa, la lezione da leggere).
- **Enigmi**: le risposte sono nascoste in giro per Orbis (lezioni, pianeti, creature). «Dove lo trovo?» dice dove guardare e ci porta; un pulsante «Torna al Laboratorio» riporta indietro al punto giusto.
- **Stelline**: esperimento 1 + 1 se la scommessa era giusta; enigma 3, meno una per ogni risposta fatta dire o tessera sbagliata (minimo 1).
- A ogni passo completato il laboratorio si riaccende: lampada, ampolle colorate, tavola periodica e pianta, telescopio, distintivo. Dopo il passo si torna nella stanza e parte una piccola scena da film: compaiono due fasce nere, l'inquadratura si avvicina alla cosa nuova, quella si accende tra le scintille e l'inquadratura torna indietro. Un tocco la salta.
- I progressi restano salvati sul dispositivo (`orbis-game`).

## Stanza 1 · La stanza delle ampolle (chimica), 12 stelline

| # | Passo | Cosa si impara |
|---|---|---|
| 1 | Esperimento: il vulcano di schiuma | Aceto + bicarbonato fanno un gas nuovo (anidride carbonica); acqua e sale si mescolano soltanto. Mescolare non è reagire. |
| 2 | Enigma: il lucchetto dell'armadietto | Codice 7 · 8 · 2: pH dell'acqua pura, protoni dell'ossigeno, idrogeni in una molecola d'acqua (lezioni «Acidi e basi», «La tavola periodica», «L'acqua»). |
| 3 | Esperimento: il succo che cambia colore | Il cavolo rosso è un indicatore: rosa negli acidi, viola nel neutro, blu e verde nelle basi. |
| 4 | Enigma: chi sono? | Venere (nuvole di acido solforico) e il gipeto (stomaco che digerisce le ossa): si trovano nel Sistema solare e sull'Himalaya. |
| 5 | Esperimento: la torre dei liquidi | La densità: miele sotto, acqua in mezzo, olio sopra, in qualunque ordine; moneta, acino d'uva e sughero si fermano a livelli diversi. |

Tutti gli esperimenti usano solo cose di cucina, così si possono rifare a casa con un adulto.

## La grafica · 16 novembre 2026

Olivia ha chiesto una grafica «davvero da gioco», più cinematografica: il gioco le piaceva com'era, ma all'ingresso sembrava una pagina di Orbis e non un gioco. Claude ha rifatto solo l'aspetto. I passi, i testi, le stelline e i progressi salvati sono gli stessi di prima.

- **Uno stile suo**: un laboratorio da libro illustrato, di notte. Contorni scuri e spessi, cartelli color carta, tasti grossi che si abbassano quando li tocchi. I titoli usano il carattere Grandstander (licenza libera OFL, in `app/fonts/`); i testi da leggere restano in Atkinson Hyperlegible.
- **La stanza** è un disegno che riempie lo schermo. È fatta di tre strati: la stanza, il buio della notte sopra (si schiarisce a ogni passo) e in cima le cose che brillano: la finestra con la luna, la lampada e la sua luce, i liquidi colorati.
- **Il professor Edward** è disegnato in grande: sbuca da dietro il cartello, sbatte gli occhi e muove la bocca mentre parla.
- **Le icone** di passi e ingredienti sono disegnate una per una, tutte nello stesso stile: così sono uguali su ogni telefono (prima erano emoji).
- **Piccoli premi per chi gioca**: scintille quando arrivano le stelline, coriandoli alla fine della stanza, il banco che trema quando il vulcano erutta.
- Chi ha scelto «riduci animazioni» sul telefono non vede né titolo animato né scena da film: la stanza cambia e basta.

Tutti i disegni sono vettoriali, scritti nel codice: `GICO` (icone), `gameProf` (professore) e `gameRoomSvg` (stanza). Se un giorno si vorranno immagini dipinte, come nei giochi più grandi, basterà sostituire questi tre.

## Come aggiungere passi o stanze

Tutto sta in `sorgenti/gioco/game.js`: l'elenco `GAME_STEPS` (testi, scommesse, spiegazioni, indizi) e `GEXP` (gli esperimenti disegnati).
Un passo nuovo vuole anche la sua icona in `GICO`, con lo stesso nome del passo. Un regalo nuovo nella stanza vuole un gruppo `r6`, `r7`… in `gameRoomSvg` e il punto dove va l'inquadratura in `GAME_FOCUS`.
Dopo le modifiche: `inject_lessons.py`, poi `inject_game.py`, poi `build_pwa.py` e `build_standalone.py`. Il test completo è `node sorgenti/gioco/test_game.js`: gioca tutta la stanza su un telefono simulato, dentro l'app costruita.

## Idee per le prossime stanze

- **La stanza dei quanti**: palline che attraversano il muro (effetto tunnel), le due fenditure, il dado della radioattività.
- **L'osservatorio**: lanciare un sasso fino a metterlo in orbita, riconoscere i pianeti dalle ombre, il transito di un esopianeta.
- **La serra della vita**: accoppiare le lettere del DNA, far crescere una pianta con luce e acqua.
- Il taccuino dello scienziato: le creature e le lezioni già visitate, come aiuto per gli enigmi.
