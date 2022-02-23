import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader();

export default class Boat extends Object3D{

    constructor(scene){
        super();
        loader.load("assets/models/aurora-space-battleship/scene.gltf", (gltf) => {
            scene.add( gltf.scene )
            gltf.scene.scale.set(1, 1, 1)
            gltf.scene.position.set(0,13,0)

            this.boat = gltf.scene
            this.speed = {
            vel: 0,
            rot: 0
            }
        })
    }

    getWorldPosition(){
        console.log(this.boat);
        // return this.boat.getWorldPosition();
    }

    stop(){
        this.speed.vel = 0
        this.speed.rot = 0
    }

    update(){
        if(this.boat){
            this.boat.rotation.y += this.speed.rot
            this.boat.translateZ(-this.speed.vel)
        }
    }


}