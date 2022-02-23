import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import Boat from './boat'
import Chest from './chest';

const cameraOffset = new THREE.Vector3(0.0, 5.0, -5.0);

let camera, scene, renderer;
let controls, water, sun;
let boat;
let chest;

init_world();
animate();

function init_world() {
    // Setup renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);

    // Create Scene
    scene = new THREE.Scene();
    boat = new Boat(scene);
    chest = new Chest(scene);

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
        if(e.key == "ArrowUp"){
          boat.speed.vel = 2
        }
        if(e.key == "ArrowDown"){
          boat.speed.vel = 0.25
        }
        if(e.key == "ArrowRight"){
          boat.speed.rot = -0.01
        }
        if(e.key == "ArrowLeft"){
          boat.speed.rot = 0.01
        }
      })
      window.addEventListener( 'keyup', function(e){
            boat.speed.vel = 1;
            boat.speed.rot = 0;
      })
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    chest.update();
    boat.update();
}

function render() {
    water.material.uniforms['time'].value += 1.0 / 60.0;
    renderer.render(scene, camera);
}