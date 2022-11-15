import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import {ARButton} from 'https://unpkg.com/three@0.146.0/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;

document.addEventListener("DOMContentLoaded", checkARSessionSupported());


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

    const title = document.getElementById("title");
    title.after(renderer.domElement);


    startScene();
}

function startScene(){
    scene = new THREE.Scene();
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: "#0000FF"});

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.set(0, 0, -2);
    cube.rotation.set(0, Math.PI/4, 0);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
    camera.position.set(1, 0, 5);

    const button = ARButton.createButton(renderer);
    console.log(button);
    document.body.appendChild(button);

}

function checkARSessionSupported() {
    const isArSessionSupported = navigator.xr 
                                && navigator.xr.isSessionSupported
                                && navigator.xr.isSessionSupported("immersive-ar");
    if(isArSessionSupported){
        console.log("Ar supported");
        initializeScene();
        animate();
    }else{
        console.log("AR not supported");
    }
}

function animate(){
    renderer.setAnimationLoop(render);
}

function render(){
    renderer.render(scene, camera);
}