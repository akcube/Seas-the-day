import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';
import Spinners from './spinners';

const loader = new GLTFLoader();

export default class Boat{

    constructor(){
        this.boat = null;
        this.bbox = null;
        this.velocity = 1;
        this.rotation = 0;
        this.tilt = 0;
    }

    async init(scene){
        let gltf = await loader.loadAsync("assets/models/aurora-space-battleship/scene.gltf");
        this.boat = gltf.scene;
        scene.add(gltf.scene);
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0,13,0);

        // this.helper = new THREE.BoxHelper(this.boat, 0x06a5f8 );
        // scene.add( this.helper );

        this.bbox = new THREE.Box3().setFromObject(this.boat);
    }

    reset(){
        this.rotation = 0;
        this.tilt = 0;
    }

    turnLeft(){
        this.tilt = 0.1;
        this.rotation = 0.05;
    }

    turnRight(){
        this.tilt = -0.1;
        this.rotation = -0.05;
    }

    getRotation(){
        return this.boat.rotation.y;
    }

    async shoot(scene, ball_list){
        if(ball_list.length == 0){
            let di = new THREE.Vector3(0, 0, -50);
            let axis = new THREE.Vector3(0, 1, 0);
            di.applyAxisAngle(axis, this.boat.rotation.y);
            let pro = new Spinners(di);
            await pro.init(scene);
            ball_list.push(pro);
        }
    }

    update(){
        if(this.tilt == 0 && this.boat.rotation.z < 0.025) this.boat.rotation.z += 0.01;
        else if(this.tilt == 0 && this.boat.rotation.z > 0.025) this.boat.rotation.z -= 0.01;
        else if(this.boat.rotation.z + this.tilt >= -0.55 && this.boat.rotation.z + this.tilt <= 0.55)
            this.boat.rotation.z += this.tilt * 0.1;
        if((this.boat.rotation.z > 0 && this.rotation > 0) || (this.boat.rotation.z < 0 && this.rotation < 0)) 
            this.boat.rotation.y += this.rotation * 0.1;
        this.bbox = new THREE.Box3().setFromObject(this.boat);
    }
}