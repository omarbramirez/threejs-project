import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const loader = new GLTFLoader();
const scene = new THREE.Scene();
const canvas = document.querySelector("canvas.threejs");

loader.load(
    'models/Kitchen.glb',
	function ( glb ) {
        console.log(glb)
		scene.add( glb.scene );
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	}
);

const light = new THREE.DirectionalLight(0xfffff, 1)
light.position.set(2,2,5)
scene.add(light)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.9,
  100
);
camera.position.set(2,2,5)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer.render(scene, camera);

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();