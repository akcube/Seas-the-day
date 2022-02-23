import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader();

export default class Chest {

    constructor(scene){
        loader.load("assets/models/treasure-chest/scene.gltf", (gltf) => {
            scene.add( gltf.scene )
            gltf.scene.scale.set(10, 10, 10)
            gltf.scene.position.set(0,13,-1000)
            this.chest = gltf.scene
            this.speed = {
                vel: 1,
                rot: 0
            }
        })
    }

    stop(){
        this.speed.vel = 0
        this.speed.rot = 0
    }

    update(){
        if(this.chest){
            this.chest.translateZ(this.speed.vel)
        }
    }


}