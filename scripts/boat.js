import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';

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
        this.rotation = 0.01;
    }

    turnRight(){
        this.tilt = -0.1;
        this.rotation = -0.01;
    }

    getRotation(){
        return this.boat.rotation.y;
    }

    update(){
        if(this.tilt == 0 && this.boat.rotation.z < 0) this.boat.rotation.z += 0.001;
        else if(this.tilt == 0 && this.boat.rotation.z > 0) this.boat.rotation.z -= 0.001;
        else if(this.boat.rotation.z + this.tilt >= -0.55 && this.boat.rotation.z + this.tilt <= 0.55)
            this.boat.rotation.z += this.tilt * 0.1;
        if((this.boat.rotation.z > 0 && this.rotation > 0) || (this.boat.rotation.z < 0 && this.rotation < 0)) 
            this.boat.rotation.y += this.rotation * 0.1;
        this.bbox = new THREE.Box3().setFromObject(this.boat);
    }
}