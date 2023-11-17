import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
// Matcaps
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
// Gradients
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

colorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
// const material = new THREE.MeshNormalMaterial();
material.side = THREE.DoubleSide;

// Scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(2));

const group = new THREE.Group();
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 3, 3), material);
plane.rotation.x = -(Math.PI / 2);
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2), material);
torus.rotation.x = -(Math.PI / 2);
torus.position.y = 0.5;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 8), material);
sphere.position.y = 1.25;

group.add(plane, torus, sphere);
scene.add(group);

manualControls.gravity = () => {
  gsap.to(sphere.position, { duration: 1.5, y: 0.25, ease: "bounce.out" });
  gsap.to(torus.position, { duration: 0.75, y: 0.1, ease: "bounce.out" });
};
gui.add(manualControls, "gravity");

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
