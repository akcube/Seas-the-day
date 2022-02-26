import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';

const loader = new GLTFLoader();

const max_X = 5000;
const max_Y = 5000;

export default class Chest {

    constructor(){
        this.X = Math.random() * max_X * 2 - max_X;
        this.Y = Math.random() * max_Y * 2 - max_Y;

        this.chest = null;
        this.bbox = null;
        this.velocity = 1,
        this.rotation = 0;
        this.obtained = false;
    }

    async init(scene){
        let gltf = await loader.loadAsync("assets/models/treasure-chest/scene.gltf");
        scene.add(gltf.scene);
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.rotateY(-1.57);
        gltf.scene.position.set(this.X, 0, this.Y);
        this.chest = gltf.scene;

        this.helper = new THREE.BoxHelper(this.chest, 0xff0000 );
        scene.add( this.helper );

        this.bbox = new THREE.Box3().setFromObject(this.helper);
    }

    destroy(scene){
        scene.remove(this.helper);
        scene.remove(this.chest);
        this.helper.update();
        this.bbox = null;
    }

    update(boatRot){
        this.chest.rotateY(1.57);
        var dirVec = new THREE.Vector3(0, 0, 1);
        var axis = new THREE.Vector3(0, 1, 0);
        dirVec.applyAxisAngle(axis, boatRot);
        this.chest.translateOnAxis(dirVec, this.velocity);
        this.chest.rotateY(-1.57);

        if(Math.abs(this.chest.position.x) >= max_X || Math.abs(this.chest.position.y >= max_Y) || this.obtained){
            this.X = Math.random() * max_X * 2 - max_X;
            this.Y = Math.random() * max_Y * 2 - max_Y;
            this.chest.position.set(this.X, 0, this.Y);
        }

        this.helper.update();
        this.bbox = new THREE.Box3().setFromObject(this.chest);
    }


}