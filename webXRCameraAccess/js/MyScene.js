import {createMesh, createTextLamp} from './create.js';
import * as THREE from 'three';
import {Lamp} from './Lamp.js';


class MyScene{

    leng=0.6;
    rowDist=3;
    colDist=5;
    row=3;
    col=4;
    height=2;
/*     rowMeasure=[-10.5, -13.5, -16.5];
    colMeasure=[-13, -18, -23, -28]; */
    lampsName = ["Luce_ECG_26", "Luce_ECG_28", "Luce_ECG_35", "Luce_ECG_31", "Luce_ECG_37", "Luce_ECG_36", "Luce_ECG_32", 
						   "Luce_ECG_29", "Luce_ECG_30", "Luce_ECG_34", "Luce_ECG_32", "Luce_ECG_27"];
    lamps=[];


    constructor(renderer, startX, startY){
        this.xPos = startX; 
        this.yPos = startY;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.group = new THREE.Group();
        this.controller = renderer.xr.getController( 0 );
    }

    getScene(){
        return this.scene;
    }

    getCamera(){
        return this.camera;
    }

    getGroup(){
        return this.group;
    }

    getController(){
        return this.controller;
    }

    getLamps(){
        return this.lamps;
    }

    configScene(){
        this.scene.updateMatrixWorld(true);
        this.camera.position.set(0,0,3);
        this.scene.add(this.group);
        this.scene.add(this.controller);
        this.scene.add(this.ambientLight)
    }

    initMeshInScene(){
        let count=0;
        let y = this.yPos;
        for (let c = 0; c < this.col; c++) {
            let x = this.xPos;
            for (let r = 0; r < this.row; r++) {
                const lampMesh = createMesh(new THREE.Vector3(x*this.leng, this.height, y*this.leng));
                this.group.add(lampMesh);
                console.log(lampMesh.position)
                this.lamps[count] = new Lamp(lampMesh, this.lampsName[count]);
                count++;
                x-=this.rowDist;		
            }
            y-=this.colDist;
        }
    }

    captureTextLamp(bright, status, mesh){
        document.getElementById("brightValue").textContent = bright + "%";
        document.getElementById("ballastValue").textContent = status;
        document.getElementById("card-light").style.display = 'block';
        document.getElementById("card-light").style.color = 'white';
        createTextLamp(mesh);
        document.getElementById("card-light").style.display = 'none';
    }


}

export {MyScene};