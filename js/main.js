import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.146.0/examples/jsm/webxr/ARButton.js';
import {createPlaneMarker, createMesh} from './scene/scene.js'

let container;
let camera, scene, renderer;
const planeMarker = createPlaneMarker();
let controller;


let hitTestSource = null;
let hitTestSourceRequested = false;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 20);

    scene.add(planeMarker);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    
    controller = renderer.xr.getController(0);

    controller.addEventListener('select', function () {
        if (planeMarker.visible) {
            scene.add(createMesh(planeMarker.matrix));
        }
    });

    scene.add(controller);


    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

}


function animate() {

    renderer.setAnimationLoop(render);

}

function render(timestamp, frame) {

    if (frame) {

        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (hitTestSourceRequested === false) {

            session.requestReferenceSpace('viewer').then(function (referenceSpace) {

                session.requestHitTestSource({ space: referenceSpace }).then(function (source) {

                    hitTestSource = source;

                });

            });

            session.addEventListener('end', function () {

                hitTestSourceRequested = false;
                hitTestSource = null;

            });

            hitTestSourceRequested = true;

        }

        if (hitTestSource) {

            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {

                const hit = hitTestResults[0];

                planeMarker.visible = true;
                planeMarker.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
            } else {

                planeMarker.visible = false;

            }

        }

    }

    renderer.render(scene, camera);

}
