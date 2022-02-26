import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';
import Projectile from './projectile';

const loader = new GLTFLoader();

const max_X = 1500;
const max_Y = 1500;

export default class Enemy {

    constructor(){
        this.X = Math.random() * max_X * 2 - max_X;
        this.Y = Math.random() * max_Y * 2 - max_Y;

        this.enemy = null;
        this.bbox = null;
        this.velocity = 1,
        this.rotation = 0;
        this.obtained = false;
    }

    async init(scene){
        let gltf = await loader.loadAsync("assets/models/space-pirate-ship/scene.gltf");
        scene.add(gltf.scene);
        gltf.scene.scale.set(22, 22, 22);
        gltf.scene.position.set(this.X, 22, this.Y);
        this.enemy = gltf.scene;

        // this.helper = new THREE.BoxHelper(this.enemy, 0xff0000 );
        // scene.add( this.helper );
        this.bbox = new THREE.Box3().setFromObject(this.enemy);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    async shoot(scene, proj_list){
        let di = new THREE.Vector3(0, 0, 0);
        di.copy(this.enemy.position);
        di.negate();
        di.y = 20;
        let pro = new Projectile(di, this.enemy.position);
        await pro.init(scene);
        proj_list.push(pro);
    }

    update(boatRot){
        var dirVec1 = new THREE.Vector3(0, 0, 0);
        dirVec1.copy(this.enemy.position);
        dirVec1.negate();
        dirVec1.normalize();
        var dirVec2 = new THREE.Vector3(0, 0, 1);
        var axis = new THREE.Vector3(0, 1, 0);
        dirVec2.applyAxisAngle(axis, boatRot);
        dirVec1.add(dirVec2);
        this.enemy.translateOnAxis(dirVec1, this.velocity * 0.18);
        this.enemy.position.y = 22;
        this.enemy.lookAt(0, 0, 0);

        // this.helper.update();
        this.bbox = new THREE.Box3().setFromObject(this.enemy);
    }


}