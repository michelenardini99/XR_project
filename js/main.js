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

    //with ARButton, three.js will take care of set everything up and it will
    //give us a button to initialize the session
    document.body.appendChild(ARButton.createButton(
        renderer,
        { requiredFeatures: ["hit-test"] },
      ));

    startScene();
}

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
