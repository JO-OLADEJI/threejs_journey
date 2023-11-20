import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const gui = new GUI();
const manualControls = {};

// Textures
// doors
const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const colorTexture = textureLoader.load("/textures/door/color.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

colorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");
const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
material.metalness = 1;
material.roughness = 1;
material.map = colorTexture;
material.aoMap = ambientOcclusionTexture;
material.displacementMap = heightTexture;
material.displacementScale = 0.31;
material.metalnessMap = metalnessTexture;
material.roughnessMap = roughnessTexture;

// Scene
const scene = new THREE.Scene();
// const light = new THREE.PointLight(0xffffff, 20, 100);
// light.position.set(2, 3, 2);
// scene.add(new THREE.AxesHelper(2));
// scene.add(new THREE.AmbientLight(0xffffff));
// scene.add(light);

const group = new THREE.Group();
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 64, 64), material);
plane.rotation.x = -(Math.PI / 2);
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2), material);
torus.rotation.x = -(Math.PI / 2);
torus.position.y = 0.5;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), material);
sphere.position.y = 1.25;

// group.add(plane, torus, sphere);
group.add(plane);
scene.add(group);

manualControls.gravity = () => {
  gsap.to(sphere.position, { duration: 1.5, y: 0.25, ease: "bounce.out" });
  gsap.to(torus.position, { duration: 0.75, y: 0.2, ease: "bounce.out" });
};
gui.add(manualControls, "gravity");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);
gui.add(material, "aoMapIntensity").min(0).max(1).step(0.001);
gui.add(material, "displacementScale").min(0).max(3).step(0.01);

// Environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  console.log(envMap);

  scene.background = envMap;
  scene.environment = envMap;
});

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
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // sphere.position.y = Math.sin(elapsedTime + Math.PI / 2) * 1.25;
  // sphere.rotation.y = elapsedTime * 2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
