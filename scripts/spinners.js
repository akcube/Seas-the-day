import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';

const loader = new GLTFLoader();

export default class Spinners{
    constructor(dir){
        this.spinners = null;
        this.bbox = null;
        this.velocity = 1;
        this.dir = new THREE.Vector3(0, 0, 0); this.dir.copy(dir);
        this.start = new THREE.Vector3(0, 10, 0);
        this.dir.y = 13;
        this.dir.multiplyScalar(5);
    }

    async init(scene){
        let gltf = await loader.loadAsync("assets/models/robot-ball/scene.gltf");
        this.spinners = gltf.scene;
        scene.add(gltf.scene);
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.position.set(this.start.x, this.start.y, this.start.z);
        this.bbox = new THREE.Box3().setFromObject(this.spinners);
    }

    destroy(scene){
        scene.remove(this.spinners);
        this.bbox = null;
    }

    update(){
        let fac = 1;
        let down = new THREE.Vector3(0, -fac, 0);
        this.dir.add(down);
        this.spinners.translateOnAxis(this.dir, 0.05);
        this.bbox = new THREE.Box3().setFromObject(this.spinners);
    }
}