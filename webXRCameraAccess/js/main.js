import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { ARRawAccessButton } from './ARRawAccessButton.js';



init();


function init() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, autoClear: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;

    let options = {
        requiredFeatures: ['hit-test'/*, 'camera-access'*/], 
        optionalFeatures: ['dom-overlay'],
    }

    options.domOverlay = { root: document.body}

    document.getElementById("row-btn").appendChild(ARRawAccessButton.createButton(renderer, options));

}

