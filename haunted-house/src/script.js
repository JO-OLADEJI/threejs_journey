import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

/**
 * Setup
 */
// debug
const gui = new GUI();

// canvas
const canvas = document.querySelector("#webgl");

// camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2, 5, 3.5);
const cameraControls = new OrbitControls(camera, canvas);
cameraControls.enableDamping = true;

// scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(6));
scene.add(camera);

/**
 * Scene Objects
 */
// floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(7, 7),
  new THREE.MeshStandardMaterial({ color: "#615f5f", side: THREE.DoubleSide })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// house
const house = new THREE.Group();
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 2, 2.5),
  new THREE.MeshStandardMaterial({ color: "#ffffff" })
);
walls.position.y = 2 * 0.5;
house.add(walls);
scene.add(house);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#8f8f8f", 7.5);
scene.add(ambientLight);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Events & Animations
 */

// double-click for fullscreen
window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

// resize operations
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const render = () => {
  cameraControls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};
render();

/**
 * GUI Debug
 */
const ambientLightControls = gui.addFolder("Ambient Light");
ambientLightControls = ambientLightControls
  .add(ambientLight, "intensity")
  .min(1)
  .max(10)
  .step(0.01);
