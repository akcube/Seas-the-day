import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import Boat from './boat'
import Chest from './chest';
import Enemy from './enemy';
import Projectile from './projectile';

const cameraOffset = new THREE.Vector3(0.0, 5.0, -5.0);

let camera, scene, renderer;
let water, sun;

let boat;
let chests = [];
let enemies = [];
let proj_list = [];
let ball_list = [];
let enemy_destroyed = []

let camPos = new THREE.Vector3(0, 150, 200);
let viewMode = 'FRONT';
let specAngle = 0.0;

let score = 0, health = 1000;
let gameOver = false;

const MAX_CHESTS = 50;
const MAX_ENEMIES = 1;

await init_world();
await animate();

function getRandomInt(max){
  return Math.floor(Math.random() * max);
}

setInterval(() => {
  let v = getRandomInt(enemies.length);
  enemies[v].shoot(scene, proj_list);
}, 1000);

async function init_world() {

    for(var i = 0; i<MAX_ENEMIES; i++)
      enemy_destroyed.push(0);

    // Setup renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);

    // Create Scene
    scene = new THREE.Scene();
    boat = new Boat();
    await boat.init(scene);
    for(let i=0; i<MAX_CHESTS; i++){  
      let chest = new Chest();
      await chest.init(scene);
      chests.push(chest);
    }
    for(let i=0; i<MAX_ENEMIES; i++){
      let enemy = new Enemy();
      await enemy.init(scene);
      enemies.push(enemy);
    }

    // Create Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.zoom = 0.45;
    camera.position.set(0, 150, 200);
    camera.lookAt(0, 120, 0);
    camera.updateProjectionMatrix();

    // Create Sun
    sun = new THREE.Vector3();

    // Create Water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    water = new Water(
        waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('assets/textures/waternormals.jpg', function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // Create Skybox
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const parameters = {
        elevation: 5,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);
        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();
        scene.environment = pmremGenerator.fromScene(sky).texture;
    }

    updateSun();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener( 'keydown', function(e){
        if(e.key == "w"){
          boat.velocity = 2
        }
        if(e.key == "s"){
          boat.velocity = 0.25
        }
        if(e.key == "d"){
          boat.turnRight();
        }
        if(e.key == "a"){
          boat.turnLeft();
        }
        if(e.key == "j"){
          if(viewMode == "FRONT") { 
            viewMode = "TOP"; 
            camera.zoom = 0.45;
            camera.fov = 45;
            camera.updateProjectionMatrix();
          }
          else if(viewMode == "TOP") {
            camera.zoom = 0.3;
            camera.fov = 65;
            viewMode = "ROTATE";
            camera.updateProjectionMatrix();
          }
          else if(viewMode == 'ROTATE'){
            viewMode = "FRONT";
            camera.zoom = 0.45;
            camera.fov = 45;
            camera.updateProjectionMatrix();
          }
        }
        if(e.key == " "){
          boat.shoot(scene, ball_list);
        }
      })
      window.addEventListener( 'keyup', function(e){
            boat.reset();
      })
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

async function animate() {

    if(!gameOver){
      requestAnimationFrame(animate);
      render();

      if(viewMode == 'FRONT'){
        let nPos = new THREE.Vector3(0, 0, 0).copy(camPos);
        let axis = new THREE.Vector3(0, 1, 0);
        nPos.applyAxisAngle(axis, boat.getRotation());
        camera.position.set(nPos.x, nPos.y, nPos.z);
        camera.lookAt(0, 0, 0);  
      }
      else if(viewMode == 'TOP'){
        camera.position.set(0, 600, 0);
        camera.lookAt(0, 0, 0);
      }
      else if(viewMode == 'ROTATE'){
        let nPos = new THREE.Vector3(0, 0, 0).copy(camPos);
        let axis = new THREE.Vector3(0, 1, 0);
        nPos.applyAxisAngle(axis, specAngle);
        specAngle += 0.01;
        camera.position.set(nPos.x, nPos.y, nPos.z);
        camera.lookAt(0, 0, 0); 
      }

      boat.update();
      for(let i = 0; i<MAX_CHESTS; i++){
        if(boat.bbox.intersectsBox(chests[i].bbox)){
          score += 2;
          chests[i].destroy(scene);
          chests[i].init(scene);
        }
        chests[i].update(boat.getRotation());
      }
      for(let i = 0; i<MAX_ENEMIES; i++){
        enemies[i].update(boat.getRotation());
      }

      for(var v in proj_list){
        proj_list[v].update();
        if(boat.bbox.intersectsBox(proj_list[v].bbox)){
          health -= 1;
        }
      }

      for(var v in enemies){
        if(boat.bbox.intersectsBox(enemies[v].bbox)){
          health = 0;
        }
      }
      
      for(var v in proj_list){
        if(proj_list[v].projectile.position.y < -50) {
          proj_list[v].destroy(scene);
          proj_list.splice(v, 1);
        }
      }

      for(var v in ball_list){
        ball_list[v].update();
        for(var e in enemies){
          if(enemy_destroyed[e] == 1) continue;
          if(enemies[e].bbox.intersectsBox(ball_list[v].bbox)){
            enemy_destroyed[e] = 1;
            enemies[e].destroyed = true;
          }
        }
      }

      for(var v in enemies){
        if(enemy_destroyed[v] == 1){
          enemies[v].destroy(scene);
          enemies[v].respawn(scene);
          enemy_destroyed[v] = 0;
        }
      }
      
      for(var v in ball_list){
        if(ball_list[v].spinners.position.y < -50) {
          ball_list[v].destroy(scene);
          ball_list.splice(v, 1);
        }
      }

      document.getElementById("score").innerHTML = "Score: " + score;
      document.getElementById("health").innerHTML = "Health: " + health;

      if(health <= 0){
        gameOver = true;
        document.getElementById("health").innerHTML = "Health: " + 0;
        document.getElementById("game-over").innerHTML = "Game over! Max score: " + score;
      }
    }
}

function render() {
    water.material.uniforms['time'].value -= 1.0 / 200.0;
    renderer.render(scene, camera);
}