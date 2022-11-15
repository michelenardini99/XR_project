import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';


document.addEventListener("DOMContentLoaded", checkARSessionSupported());

let camera, scene, renderer;
let control;

function initializeScene(){

    const { devicePixelRatio, innerHeight, innerWidth } = window;
    
    //init renderer
    renderer = new THREE.WebGLRenderer({alpha: true,
                                            antialias: true});
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    //Provides access to the WebXR related interface of the renderer.
    renderer.xr.setEnable=true;

    const title = document.getElementById("title");
    title.after(renderer.domElement);
    document.getElementById("enter-ar").textContent = "Stop AR";

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

    const renderLoop = () => {

        // Rotate box
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;
    
        renderer.render(scene, camera);
      }
      
      renderer.setAnimationLoop(renderLoop);

}

function checkARSessionSupported() {
    const isArSessionSupported = navigator.xr 
                                && navigator.xr.isSessionSupported
                                && navigator.xr.isSessionSupported("immersive-ar");
    if(isArSessionSupported){
        console.log("Ar supported");
        document.getElementById("enter-ar").addEventListener("click",initializeScene);
    }else{
        console.log("AR not supported");
        document.getElementById("enter-ar").textContent = "AR not supported";
    }
}
