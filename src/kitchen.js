import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("skyblue");

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const textures = {
  cardboard: textureLoader.load('models/kitchen/textures/pale-textile.jpg'),
  wood: textureLoader.load('models/kitchen/textures/brown-wood.jpg')
};

let model;
const canvas = document.querySelector("canvas.threejs");
const textureSelect = document.getElementById('texture-select');

// 🔹 Mapa para guardar las texturas originales del modelo
const originalTextures = new Map();

loader.load(
  'models/kitchen/scene.gltf',
  function (gltf) {
    model = gltf.scene;
    scene.add(model);

    // Guardar las texturas originales de cada mesh
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        originalTextures.set(child.uuid, child.material.map);
      }
    });

    // ---- Escuchar cambios del selector ----
    textureSelect.addEventListener('change', (e) => {
      const selected = e.target.value;

      model.traverse((child) => {
        if (child.isMesh && child.material) {
          switch (selected) {
            case 'cardboard':
              child.material.map = textures.cardboard;
              break;
            case 'wood':
              child.material.map = textures.wood;
              break;
            default:
              // 🔁 Restaurar textura original guardada
              const original = originalTextures.get(child.uuid);
              child.material.map = original || null;
              break;
          }
          child.material.needsUpdate = true;
        }
      });
    });
  },
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  (error) => console.error('An error happened:', error)
);

// ---- Luces ----
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-5, 3, -5);
scene.add(fillLight);

// ---- Cámara isométrica ----
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(10, aspect, 0.1, 100);

const distance = 1;
const angle = 35.264 * (Math.PI / 90);
camera.position.set(
  distance * Math.sin(Math.PI / 4),
  distance * Math.sin(angle),
  distance * Math.cos(Math.PI / 1)
);
camera.lookAt(0, 0, 0);

// ---- Renderizador ----
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderloop);
};

renderloop();
