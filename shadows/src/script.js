import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

bakedShadow.colorSpace = THREE.SRGBColorSpace;
simpleShadow.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
const gui = new GUI();
const ambientLightGui = gui.addFolder("Ambient Light");
const directionalLightGui = gui.addFolder("Directional Light");
const sceneObjectGui = gui.addFolder("Scene Objects");
const shadowCameraGui = gui.addFolder("Shadow Camera");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 6;

directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -1.5;
directionalLight.shadow.camera.left = -1.5;
directionalLight.shadow.camera.right = 1.5;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
const updateCamera = () => {
  directionalLight.shadow.camera.updateProjectionMatrix();
  directionalLightCameraHelper.update();
};
scene.add(directionalLight, directionalLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(sphere, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * GUI
 */
// objects
sceneObjectGui.add(material, "metalness").min(0).max(1).step(0.001);
sceneObjectGui.add(material, "roughness").min(0).max(1).step(0.001);

// ambient light
ambientLightGui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// directional light
directionalLightGui
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001);
directionalLightGui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001);
directionalLightGui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001);
directionalLightGui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001);

// shadow camera
shadowCameraGui.add(directionalLightCameraHelper, "visible").name("wireframe");
shadowCameraGui
  .add(directionalLight.shadow.camera, "near")
  .min(0.1)
  .max(5)
  .onChange(updateCamera);
shadowCameraGui
  .add(directionalLight.shadow.camera, "far")
  .min(5.1)
  .max(10)
  .onChange(updateCamera);
shadowCameraGui
  .add(directionalLight.shadow.camera, "top")
  .min(1)
  .max(10)
  .step(0.01)
  .onChange(updateCamera);
shadowCameraGui
  .add(directionalLight.shadow.camera, "bottom")
  .min(-10)
  .max(-1)
  .step(0.01)
  .onChange(updateCamera);
shadowCameraGui
  .add(directionalLight.shadow.camera, "left")
  .min(-10)
  .max(-1)
  .step(0.01)
  .onChange(updateCamera);
shadowCameraGui
  .add(directionalLight.shadow.camera, "right")
  .min(1)
  .max(10)
  .step(0.01)
  .onChange(updateCamera);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.position.y = Math.sin(elapsedTime) * 0.5 + 0.5;
  directionalLight.shadow.radius = sphere.position.y * 3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
