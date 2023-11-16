import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

const gui = new GUI();
const globalDebug = {};
globalDebug.meshColor = "#8f8f8f";
globalDebug.meshSubdivision = 2;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const axis3d = new THREE.AxesHelper(0.5 / 2);
scene.add(axis3d);

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(
  1,
  1,
  1,
  globalDebug.meshSubdivision,
  globalDebug.meshSubdivision,
  globalDebug.meshSubdivision
);
const material = new THREE.MeshBasicMaterial({
  color: globalDebug.meshColor,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

globalDebug.spinMesh = () => {
  gsap.to(mesh.rotation, {
    y: mesh.rotation.y + Math.PI * 2,
    duration: 2,
    ease: "back.out(1.7)",
  });
};

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

window.addEventListener("dblclick", async () => {
  if (!document.fullscreenElement) {
    try {
      await canvas.requestFullscreen();
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      await document.exitFullscreen();
    } catch (e) {
      console.log(e);
    }
  }
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

gui.add(mesh.position, "y").min(-3).max(3).step(0.001).name("elevation");
gui.add(controls, "autoRotate");
gui.add(material, "wireframe");
gui.addColor(globalDebug, "meshColor").onChange(() => {
  material.color.set(globalDebug.meshColor);
});
gui.add(globalDebug, "spinMesh");
gui
  .add(globalDebug, "meshSubdivision")
  .min(1)
  .max(20)
  .step(1)
  .onChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      globalDebug.meshSubdivision,
      globalDebug.meshSubdivision,
      globalDebug.meshSubdivision
    );
  });

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
