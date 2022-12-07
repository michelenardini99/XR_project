import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { ARRawAccessButton } from './ARRawAccessButton.js';



init();


function init() {

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;


    document.body.appendChild(ARRawAccessButton.createButton(renderer, { requiredFeatures: ['hit-test','camera-access'] }));

}

