import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Object
 */
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

/*
 * Font
 */
const fontLoader = new FontLoader();
fontLoader.load("fonts/courier-new.json", (font) => {
  const text = new THREE.Mesh(
    new TextGeometry("Oladeji", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    }),
    material
  );
  text.geometry.center();
  scene.add(text);

  for (let i = 0; i < 100; i++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.05), material);
    scene.add(torus);
    torus.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    );
    torus.rotation.x = Math.random() * Math.PI;
    torus.rotation.y = Math.random() * Math.PI;
  }
});

// const manualControls = {
//   torusRadius: 1,
//   torusThickness: 0.4,
// };
// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(
//     manualControls.torusRadius,
//     manualControls.torusThickness
//   ),
//   material
// );
// scene.add(torus);
// gui
//   .add(manualControls, "torusRadius")
//   .min(0.1)
//   .max(1.0)
//   .step(0.01)
//   .onChange(() => {
//     torus.geometry.dispose();
//     torus.geometry = new THREE.TorusGeometry(
//       manualControls.torusRadius,
//       manualControls.torusThickness
//     );
//   });
// gui
//   .add(manualControls, "torusThickness")
//   .min(0.1)
//   .max(1.0)
//   .step(0.01)
//   .onChange(() => {
//     torus.geometry.dispose();
//     torus.geometry = new THREE.TorusGeometry(
//       manualControls.torusRadius,
//       manualControls.torusThickness
//     );
//   });

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
// camera.position.x = 1;
// camera.position.y = 1;
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
