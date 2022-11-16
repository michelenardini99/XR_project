XR_Project

##Introduzione

Negli ultimi anni, la realtà aumentata è diventata una funzionalità comune in molte app mobili.
Quando si tratta di realtà aumentata(AR) e realtà virtuale(VR) per il Web, l'introduzione dell'API per dispositivi WebXR rappresenta un significativo balzo in avanti.

L'API del dispositivo WebXR è un'API che consente agli utenti di eseguire esperienze AR e VR all'interno del browser; consente perciò al browser di cmunicare con tutti i sensori, le fotocamere e gli altri componenti del telefono in modo tale che il dispositivo comprenda la posizione, i movimenti e l'ambiente circostante.

Introduzione a Three.js

Three.js è una libreria open source molto forte nel campo 3d sul Web, avendo ampie funzionalità.

Concetti di base

Scena
Nel contesto di Three.js, una scena rappresenta l'ambiente 3D principale dell'applicazione.
Qui è dove posizioni oggetti, luci, telecamere.

Render
Il renderer è la parte responsabile del disegno effettivo della nostra scena sullo schermo.
Grazie a un ciclo di rendering, disegneremo ripetutamente la nostra scena sullo schermo con un dato intervallo.

Telecamera
La telecamera rappresenta la vista della scena da parte degli utenti.

Modelli e mesh
Three.js offre la possibilità sia di caricare modelli 3D prefabbricati, sia di creare oggetti 3D da zero.



Preparazione allo sviluppo
Ci sono vari modi di installare le dipendenze:

Installazione da npm
```
npm install three;
```