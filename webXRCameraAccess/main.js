import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { ARRawAccessButton } from './ARRawAccessButton.js';
import {createPlaneMarker, createMesh} from './scene.js'

let container;
let camera, scene, renderer, cube;


init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 20);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cube = new THREE.Mesh( geometry, material );
    scene.add(cube);


    document.body.appendChild(ARRawAccessButton.createButton(renderer, { requiredFeatures: ['camera-access'] }));

}


function animate() {
    renderer.setAnimationLoop(render);

}

function render(timestamp, frame) {

    

    renderer.render(scene, camera);

}
