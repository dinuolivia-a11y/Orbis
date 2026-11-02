# Mini lezioni di scienza · 2 novembre 2026

La quinta sezione di Orbis, «Lezioni». Sono lezioni brevi ma vere, per bambini curiosi e adulti: ognuna ha tre parti, un «Prova tu» con qualcosa da fare a casa e un «Lo sapevi?». Molte hanno un disegno o un esperimento da toccare. Alcune hanno un bottone che porta nel punto di Orbis di cui parlano, per esempio il buco nero di M87 o la discesa nell’Himalaya.

Le ha scritte Claude in italiano e in inglese, controllando ogni numero e ogni data.

## Come funziona nell’app

- In alto c’è la scheda **Lezioni**, accanto a Esopianeti. Si possono filtrare per materia e cercare per parola.
- L’elenco «Tutte» alterna le materie, così scorrendo si trova sempre qualcosa di diverso.
- Una lezione letta fino al «Lo sapevi?» viene segnata con ✓ letta, e in alto c’è il conto delle lezioni lette. Il conto resta su quel telefono o computer.
- Quattordici curiosità del giorno ora hanno il bottone «Leggi la lezione», che apre la lezione collegata.

## Le 44 lezioni di partenza

### Particelle e quanti (8)

- **Quasi tutto vuoto: dentro l’atomo** · disegno (`atomi`)
- **Il catalogo delle particelle** · disegno (`particelle`)
- **La doppia fenditura: passare da due parti** · esperimento (`doppia-fenditura`)
- **Il principio di indeterminazione** (`indeterminazione`)
- **L’effetto tunnel: attraversare i muri** · porta in Orbis (`tunnel`)
- **L’entanglement: legati a distanza** (`entanglement`)
- **I neutrini, le particelle fantasma** · porta in Orbis (`neutrini`)
- **Radioattività e tempo di dimezzamento** · esperimento (`radioattivita`)

### Fisica (6)

- **La luce e i colori che non vediamo** · disegno (`luce`)
- **Perché il cielo è blu e il tramonto rosso** (`cielo-blu`)
- **La velocità della luce e il passato che vediamo** · esperimento (`velocita-luce`)
- **Il tempo è elastico: la relatività** (`relativita`)
- **Gravità: tutti cadono allo stesso modo** · esperimento (`gravita`)
- **Entropia: perché non si torna indietro** · esperimento (`entropia`)

### Chimica (6)

- **La tavola periodica: la mappa della materia** · disegno (`tavola-periodica`)
- **Il legame chimico: atomi che si danno la mano** (`legami`)
- **L’acqua, la molecola più strana** · disegno (`acqua`)
- **Che cos’è davvero una fiamma** (`fuoco`)
- **Acidi e basi: il cavolo che cambia colore** · disegno (`acidi-basi`)
- **Siamo fatti di polvere di stelle** · porta in Orbis (`polvere-stelle`)

### Vita (7)

- **La cellula, la fabbrica più piccola** (`cellula`)
- **Il DNA, il libro di istruzioni** · disegno (`dna`)
- **L’evoluzione: come cambiano le specie** (`evoluzione`)
- **Il mondo invisibile dentro di noi** (`microbi`)
- **La fotosintesi: mangiare la luce** (`fotosintesi`)
- **Il cervello: 86 miliardi di neuroni** (`cervello`)
- **Tardigradi, gli animali indistruttibili** (`tardigradi`)

### Spazio (7)

- **Vita e morte di una stella** · disegno · porta in Orbis (`stelle`)
- **I buchi neri** · porta in Orbis (`buchi-neri`)
- **Il Big Bang e l’universo che si allarga** (`big-bang`)
- **Materia oscura ed energia oscura** (`materia-oscura`)
- **Perché ci sono le stagioni** · disegno · porta in Orbis (`stagioni`)
- **Come si trovano i pianeti di altre stelle** · esperimento · porta in Orbis (`esopianeti`)
- **La Luna ci mostra sempre la stessa faccia** · porta in Orbis (`luna`)

### Terra (5)

- **I continenti che si muovono** · porta in Orbis (`placche`)
- **Il viaggio dell’acqua e il peso delle nuvole** (`nuvole`)
- **L’effetto serra e il clima che cambia** (`effetto-serra`)
- **Il campo magnetico e le aurore** · porta in Orbis (`aurore`)
- **Perché il mare è salato** · porta in Orbis (`mare-salato`)

### Numeri e idee (5)

- **Il potere del raddoppio** · esperimento (`esponenziale`)
- **Infiniti più grandi di altri infiniti** (`infinito`)
- **Come fa la scienza a sapere le cose** (`metodo-scientifico`)
- **Il paradosso del compleanno** · esperimento (`compleanno`)
- **Le potenze di dieci: dal quark all’universo** · esperimento (`potenze-di-dieci`)

## Gli esperimenti

| Lezione | Cosa si fa |
|---|---|
| La doppia fenditura | Si sparano elettroni uno alla volta e si vede comparire il disegno a strisce; accendendo il rivelatore le strisce spariscono. |
| Radioattività | 100 atomi si trasformano a caso, ma tutti insieme seguono la curva del dimezzamento. |
| Velocità della luce | Si manda un segnale alla Luna (a velocità reale), al Sole, a Marte, a Giove, a Voyager 1, a Proxima Centauri e ad Andromeda. |
| Gravità | Quattro palle cadono da 2 metri sulla Terra, sulla Luna, su Marte e su Giove, a velocità reale. |
| Entropia | Si toglie la parete e il gas si sparge, senza tornare mai indietro. |
| Esopianeti | Un pianeta passa davanti alla sua stella e la curva della luce si abbassa: con la Terra il calo quasi non si vede. |
| Il potere del raddoppio | Si piega un foglio a metà, una volta dopo l’altra, fino alla Luna e al Sole. |
| Il paradosso del compleanno | Si creano gruppi di persone a caso e si contano le coppie con lo stesso compleanno. |
| Le potenze di dieci | Un cursore va dal protone all’universo osservabile. |

## Come aggiungere lezioni nuove

Il ritmo proposto è di due lezioni nuove a settimana. Una lezione nuova va aggiunta in fondo al file della sua materia, in `sorgenti/lezioni/`, con la data: `added: "AAAA-MM-GG"`. Per due settimane avrà la scritta «Nuova» e comparirà in cima all’elenco, con il filtro «Nuove». Poi si esegue `sorgenti/inject_lessons.py` e si ricostruisce l’app.

Idee per le prossime: l’antimateria, il suono, i vulcani, le maree, il sonno e i sogni, come funziona un vaccino, perché le cose hanno colore, i superconduttori, i numeri primi, il pi greco, i frattali, l’effetto farfalla, le comete, la Luna di ghiaccio Europa, i funghi che parlano tra gli alberi, i fulmini.
