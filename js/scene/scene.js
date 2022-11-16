import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';

export function createPlaneMarker(){
  const planeMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  
  const planeMarkerGeometry = new THREE.RingGeometry(0.14, 0.15, 16).rotateX(-Math.PI / 2);

  const planeMarker = new THREE.Mesh(planeMarkerGeometry, planeMarkerMaterial);

  planeMarker.matrixAutoUpdate = false;

  return planeMarker;
}

export function createMesh(matrixPosition){
    const boxGeometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    const colorMesh = new THREE.Color(0xffffff);
    colorMesh.setHex(Math.random() * 0xffffff);
    const meshMaterial = new THREE.MeshBasicMaterial({ color: colorMesh });

    const box = new THREE.Mesh(boxGeometry, meshMaterial);

    box.position.setFromMatrixPosition(matrixPosition);
    box.rotation.y = Math.random() * (Math.PI * 2);
    box.visible = true;

    return box;
}
