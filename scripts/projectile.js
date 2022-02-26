import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';

const loader = new GLTFLoader();

export default class Projectile{
    constructor(dir, start){
        this.projectile = null;
        this.bbox = null;
        this.velocity = 1;
        this.dir = new THREE.Vector3(0, 0, 0); this.dir.copy(dir);
        this.start = new THREE.Vector3(0, 0, 0); this.start.copy(start);
        this.dir.y = 13;
        // this.dir.normalize();
        this.dir.multiplyScalar(0.39);
    }

    async init(scene){
        let gltf = await loader.loadAsync("assets/models/coconut-ball/scene.gltf");
        this.projectile = gltf.scene;
        scene.add(gltf.scene);
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(this.start.x, this.start.y, this.start.z);

        // this.helper = new THREE.BoxHelper(this.projectile, 0xff0000 );
        // scene.add( this.helper );

        this.bbox = new THREE.Box3().setFromObject(this.projectile);
    }

    destroy(scene){
        scene.remove(this.projectile);
        // this.helper = null;
        this.bbox = null;
    }

    update(){
        let fac = 1;
        let down = new THREE.Vector3(0, -fac, 0);
        this.dir.add(down);
        this.projectile.translateOnAxis(this.dir, 0.05);
        // this.helper.update();
        this.bbox = new THREE.Box3().setFromObject(this.projectile);
    }
}