import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.146.0/examples/jsm/webxr/ARButton.js';

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

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    
    controller = renderer.xr.getController(0);

    controller.addEventListener('select', function () {
        if (planeMarker.visible) {
            const boxGeometry = new THREE.BoxBufferGeometry();
            const colorMesh = new THREE.Color(0xffffff);
            colorMesh.setHex(Math.random() * 0xffffff);
            const meshMaterial = new THREE.MeshBasicMaterial({ color: colorMesh });

            const box = new THREE.Mesh(boxGeometry, meshMaterial);

            box.position.setFromMatrixPosition(planeMarker.matrix);
            box.rotation.y = Math.random() * (Math.PI * 2);
            box.visible = true;

            scene.add(box);
        }
    });

    scene.add(controller);

    //

    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    //
}
//

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

function createPlaneMarker() {
    const planeMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const planeMarkerGeometry = new THREE.RingGeometry(0.14, 0.15, 16).rotateX(-Math.PI / 2);

    const planeMarker = new THREE.Mesh(planeMarkerGeometry, planeMarkerMaterial);

    planeMarker.matrixAutoUpdate = false;

    return planeMarker;
}
