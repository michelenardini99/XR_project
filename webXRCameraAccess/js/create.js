import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import SpriteText from '../../node_modules/three-spritetext/dist/three-spritetext.module.js';


export function createMesh(matrixPosition){
    const boxGeometry = new THREE.SphereGeometry(.5);
    const colorMesh = new THREE.Color(0xffffff);
    colorMesh.setHex(Math.random() * 0xffffff);
    const meshMaterial = new THREE.MeshBasicMaterial({ color: colorMesh/*, transparent: true, opacity: 0*/ });

    const box = new THREE.Mesh(boxGeometry, meshMaterial);
    box.position.copy(matrixPosition);
    box.rotation.y = Math.random() * (Math.PI * 2);
    box.visible = true;

    return box;
}

export function createTextLamp(mesh){
  html2canvas(document.querySelector("#card-light"),{backgroundColor:null}).then(canvas => {
    const geometry = new THREE.PlaneGeometry(1, 1.2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping; 
    texture.wrapT = THREE.RepeatWrapping;
    const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    }));
    plane.material.side = THREE.DoubleSide;
    mesh.add(plane);
    plane.position.set(0,0,1);

    plane.userData = { URL: "./consumi.html" };
  });
}






