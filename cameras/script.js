import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// alert(window.innerWidth);

// base
const dimensions = { x: window.innerWidth, y: window.innerHeight };
const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  dimensions.x / dimensions.y,
  0.1,
  100
);
const axis = new THREE.AxesHelper(2);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(dimensions.x, dimensions.y);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// object
// const mesh = new THREE.Mesh(
//   new THREE.TorusGeometry(),
//   new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true })
// );

// custom geometry
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0,

	-1.0, -1.0,  -1.0,
	 1.0, -1.0,  -1.0,
	 1.0,  1.0,  -1.0,

	 1.0,  1.0,  -1.0,
	-1.0,  1.0,  -1.0,
	-1.0, -1.0,  -1.0,

	-1.0,  1.0,  1.0,
	-1.0,  1.0,  -1.0,
	-1.0,  -1.0,  -1.0,
  
	-1.0,  1.0,  1.0,
	-1.0,  -1.0,  -1.0,
	-1.0,  -1.0,  1.0,

  1.0,  1.0, 1.0,
  1.0,  1.0, -1.0,
  1.0,  -1.0, -1.0,

  1.0,  1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, -1.0, -1.0,

  -1.0,  1.0, 1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, 1.0,

  -1.0, -1.0, 1.0,
  -1.0, -1.0, -1.0,
   1.0, -1.0, 1.0,
]);
// 0, 0, 0,
// 0, 0, 0,
// 0, 0, 0,
// 0, 0, 0,
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const object = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
);

// populate
camera.position.z = 7;
scene.add(camera);
scene.add(axis);
// scene.add(mesh);
scene.add(object);

const controls = new OrbitControls(camera, canvas);
// controls.autoRotate = true;
controls.enableDamping = true;

// resize
window.addEventListener("resize", (event) => {
  dimensions.x = window.innerWidth;
  dimensions.y = window.innerHeight;

  camera.aspect = dimensions.x / dimensions.y;
  camera.updateProjectionMatrix();
  renderer.setSize(dimensions.x, dimensions.y);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", async (event) => {
  const isFullScreen = !!(
    document.fullscreenElement || document.webkitFullscreenElement
  );

  if (!isFullScreen) {
    try {
      await canvas.requestFullscreen();
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      await document.exitFullscreen();
    } catch (e) {
      console.error(e);
    }
  }
});

const render = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};
render();
