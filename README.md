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
In questo modo il pacchetto verrà installato e potrai importarlo nel tuo codice.

```
import * as THREE from 'three';
```

Installazione da CDN
```
import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
```

Primi passi

Prima di tutto andremo a verificare che il dispositivo su cui stiamo attualmente lavorando supporta la tecnologia XR.
Verificheremo ciò per non dare agli utenti che navigano su dispositivi non all'avanguardia una esperienza incompleta o non funzionante.
```
function checkARSessionSupported() {
    const isArSessionSupported = navigator.xr 
                                && navigator.xr.isSessionSupported
                                && navigator.xr.isSessionSupported("immersive-ar");
    //check if the device support AR session
    if(isArSessionSupported){
        console.log("Ar supported");
        initializeScene();
    }else{
        console.log("AR not supported");
    }
}
```

Verificato ciò andremo a inizializzare la nostra scena, creando il render e il resto degli oggetti richiesti.
```
function initializeScene(){

    const { devicePixelRatio, innerHeight, innerWidth } = window;

    const container = document.createElement("div");
    document.body.appendChild(container);
    
    //init renderer
    renderer = new THREE.WebGLRenderer({alpha: true,
                                            antialias: true});
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    //Provides access to the WebXR related interface of the renderer.
    renderer.xr.setEnable=true;

    container.appendChild(renderer.domElement);

    //with ARButton, three.js will take care of set everything up and it will
    //give us a button to initialize the session
    document.body.appendChild(ARButton.createButton(
        renderer,
        { requiredFeatures: ["hit-test"] },
      ));

    startScene();
}
```

Per creare l'oggetto renderer, andremo ad utilizzare il costruttore WebGLRenderer fornito da Three.js a cui passeremo
due argomenti, alpha e antialis.
Antialias ci permetterà di vedere i nostri oggetti renderizzati più puliti, mentre alpha, aseconda di come è settata 
ci permette di utilizzare la trasparenza su qualsiasi cosa renderizzata.

Chiamando ARButton.createButton,una funzione di supporto messa a disposizione da Three.js, non solo verrà creata un bottone
ma Three.js si occuperà di impostare tutto.


Ora passeremo alla creazione della vera e propria scena:
```
function startScene(){
    scene = new THREE.Scene();

    const boxGeometry=new THREE.BoxBufferGeometry(1,1,1);
    const boxMaterial=new THREE.MeshBasicMaterial({color: 0xff0000});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.z = -3;

    scene.add(box);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.02, 20 );
    
    const renderLoop = function render(){
        if (renderer.xr.isPresenting) {
            box.rotation.x+=0.01;
            box.rotation.y+=0.01;
            renderer.render(scene, camera);
        }
    }

    renderer.setAnimationLoop(renderLoop);
}
```
Iniziamo chiamando il costruttore Scene, che inizializza un nuovo oggetto scena vuoto. Questa scena è ciò che 
ospiterà tutti i contenuti 3D nella nostra app.

Successivamente, creiamo una PerspectiveCamera utilizzando il costruttore fornito da Three.js. Sebbene questa app utilizzi 
anche la fotocamera del dispositivo reale che abbiamo ottenuto da ARButton, dobbiamo ancora creare un'istanza di una fotocamera che funzioni 
come vista nella scena Three.js. 

La prima cosa che facciamo è creare un BoxGeometry. Questa è una forma predefinita di Threejs, che ci dà un oggetto Geometry a forma di cubo che possiamo usare quando creiamo una mesh. 
I tre parametri che passiamo definiranno la larghezza , l'altezza e la profondità di quel cubo, in quest'ordine.

Dopodiche creiamo un MeshBasicMaterial per il nostro cubo. 
Abbiamo bisogno di un materiale affinché il nostro cubo venga disegnato sulla scena.

Infine, possiamo creare la mesh tramite il costruttore fornito da Three.js, passando il boxGeometry e il MeshMaterial, fatto ciò potremo aggiungere l'oggetto alla scena con scene.add().

Per aggiungere un po' di interattività all'applicazione, dobbiamo implementare alcuni hit test di base.
"Nella programmazione grafica computerizzata, l'hit testing ( hit detection , picking o pick correlation ) è il processo per determinare se un cursore controllato dall'utente (come un cursore del mouse o un punto di contatto su un'interfaccia touch-screen) interseca una data forma , linea o curva disegnata sullo schermo. Questo può essere fatto per i movimenti del puntatore o della forma sottostante, o limitato alla selezione avviata dall'utente, come un clic del mouse."
 