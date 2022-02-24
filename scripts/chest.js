import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';

const loader = new GLTFLoader();

const max_X = 1500;
const max_Y = 1500;

export default class Chest {

    constructor(){
        this.X = Math.random() * max_X * 2 - max_X;
        this.Y = -Math.random() * max_Y * 2;
        console.log(this.X);
        console.log(this.Y);

        this.chest = null;
        this.velocity = 1,
        this.rotation = 0;
    }

    async init(scene){
        let gltf = await loader.loadAsync("assets/models/treasure-chest/scene.gltf");
        scene.add(gltf.scene);
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.rotateY(-1.57);
        gltf.scene.position.set(this.X, 0, this.Y);
        this.chest = gltf.scene;
    }

    update(boatRot){
        if(this.chest){
            this.chest.rotateY(1.57);
            var dirVec = new THREE.Vector3(0, 0, 1);
            var axis = new THREE.Vector3(0, 1, 0);
            dirVec.applyAxisAngle(axis, boatRot);
            this.chest.translateOnAxis(dirVec, this.velocity);
            this.chest.rotateY(-1.57);
        }
    }


}