import * as THREE from "three";

// canvas
const canvas = document.querySelector("#webgl");
// console.log(canvas);

// scene
const scene = new THREE.Scene();

// objects
const objectsGroup = new THREE.Group();
const material = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  wireframe: true,
});
const torus = new THREE.Mesh(new THREE.TorusGeometry(1), material);
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.4, 0.4, 2, 2, 2),
  material
);
const shpere = new THREE.Mesh(new THREE.SphereGeometry(0.3), material);
const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1), material);
const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1), material);

torus.rotation.x = 0.4;
torus.rotation.y = -0.3;
cube.position.set(3, 0, 0);
cone.position.set(0, 3, -3);
cone2.position.set(0, -3, -3);
cone.rotation.z = Math.PI;

objectsGroup.add(torus);
objectsGroup.add(cube);
objectsGroup.add(shpere);
objectsGroup.add(cone);
objectsGroup.add(cone2);
scene.add(objectsGroup);

// camera
const viewport = {
  width: 600,
  height: 600,
};
const camera = new THREE.PerspectiveCamera(
  90,
  viewport.width / viewport.height
);
camera.position.z = 5;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(viewport.width, viewport.height);

// clock: animation
const clock = new THREE.Clock();
let elapsedTime;

// animation
const animation = () => {
  elapsedTime = clock.getElapsedTime();

  torus.rotation.x += 0.01;
  cone.position.y = 3 + Math.sin(elapsedTime);
  cone2.position.y = Math.cos(elapsedTime + Math.PI / 2) - 3;
  cube.position.x = 2.5 * Math.sin(elapsedTime);
  cube.position.z = 2.5 * Math.cos(elapsedTime);
  cube.rotation.y -= 0.1;

  // render
  renderer.render(scene, camera);

  // animation
  window.requestAnimationFrame(animation);
};
animation();
