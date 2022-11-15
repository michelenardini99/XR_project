import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';


document.addEventListener("DOMContentLoaded", initializeScene());

function initializeScene(){
    const scene = new THREE.Scene();
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: "#0000FF"});

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.set(0, 0, -2);
    cube.rotation.set(0, Math.PI/4, 0);

    const camera = new THREE.PerspectiveCamera();
    camera.position.set(1, 1, 5);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(innerWidth, innerHeight);

    renderer.render(scene, camera);

    document.body.appendChild(renderer.domElement);
}