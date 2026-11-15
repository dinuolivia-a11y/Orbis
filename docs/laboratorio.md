# Il Laboratorio (il gioco di Orbis)

Nato da un'idea di Sofia («ma non c'è un quiz?») e di Olivia: non un quiz normale, ma un gioco in cui si impara facendo.
Si entra dalla sezione **Lezioni**, con il riquadro colorato «Il Laboratorio» (indirizzo diretto: `#gioco`).

## Come funziona

- Il padrone di casa è il **professor Edward**, lo scienziato più distratto del mondo: ha lasciato il laboratorio al buio e ha dimenticato il codice del suo armadietto.
- Ogni stanza è un percorso di passi. Ogni passo si sblocca completando quello prima.
- **Esperimenti** in tre momenti: *Scommetti* (una domanda prima di toccare), *Prova* (si versa e si mescola davvero), *Scopri* (perché succede, come rifarlo a casa, la lezione da leggere).
- **Enigmi**: le risposte sono nascoste in giro per Orbis (lezioni, pianeti, creature). «Dove lo trovo?» dice dove guardare e ci porta; un pulsante «Torna al Laboratorio» riporta indietro al punto giusto.
- **Stelline**: esperimento 1 + 1 se la scommessa era giusta; enigma 3, meno una per ogni risposta fatta dire o tessera sbagliata (minimo 1).
- A ogni passo completato il laboratorio si riaccende: lampada, ampolle colorate, tavola periodica e pianta, telescopio, distintivo.
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

## Come aggiungere passi o stanze

Tutto sta in `sorgenti/gioco/game.js`: l'elenco `GAME_STEPS` (testi, scommesse, spiegazioni, indizi) e `GEXP` (gli esperimenti disegnati).
Dopo le modifiche: `inject_lessons.py`, poi `inject_game.py`, poi `build_pwa.py` e `build_standalone.py`. Il test completo è `test_game.py`.

## Idee per le prossime stanze

- **La stanza dei quanti**: palline che attraversano il muro (effetto tunnel), le due fenditure, il dado della radioattività.
- **L'osservatorio**: lanciare un sasso fino a metterlo in orbita, riconoscere i pianeti dalle ombre, il transito di un esopianeta.
- **La serra della vita**: accoppiare le lettere del DNA, far crescere una pianta con luce e acqua.
- Il taccuino dello scienziato: le creature e le lezioni già visitate, come aiuto per gli enigmi.
