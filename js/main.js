import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';


document.addEventListener("DOMContentLoaded", checkARSessioSupported());

function initializeScene(){

    const { devicePixelRatio, innerHeight, innerWidth } = window;
    
    const renderer = new THREE.WebGLRenderer({alpha: true});
    
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    renderer.xr.setEnable=true;

    const title = document.getElementById("title");
    title.after(renderer.domElement);
    document.getElementById("enter-ar").textContent = "Stop AR";

    startScene(renderer);
}

function startScene(renderer){
    const scene = new THREE.Scene();
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: "#0000FF"});

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.set(0, 0, -2);
    cube.rotation.set(0, Math.PI/4, 0);

    const camera = new THREE.PerspectiveCamera();
    camera.position.set(1, 1, 5);

    const renderLoop = () => {
        // Rotate box
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;
    
        if (renderer.xr.isPresenting) {
          renderer.render(scene, camera);
        }else{
            renderer.render(scene, camera);
        }
      }
      
      renderer.setAnimationLoop(renderLoop);

}

function checkARSessioSupported() {
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
