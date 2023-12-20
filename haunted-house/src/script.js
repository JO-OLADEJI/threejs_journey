import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

/**
 * Setup
 */
// debug
const gui = new GUI();
const config = {
  roof: {
    radius: 2.5,
    height: 0.7,
    sides: 4,
    rotation: Math.PI / 4,
    color: "#949494",
  },
  walls: {
    width: 2.5,
    height: 2,
    depth: 2.5,
    color: "#ffffff",
  },
  door: {
    width: 1.5,
    height: 1.5,
    color: "#615f5f",
  },
  floor: {
    width: 8,
    height: 8,
    color: "#615f5f",
  },
  lights: {
    ambient: {
      color: "#8f8f8f",
      intensity: 7.5,
    },
  },
  zDelta: 0.01,
  isCameraCentalized: false,
  isWireFrameVisible: false,
};

// canvas
const canvas = document.querySelector("#webgl");

// camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5, 5, 12);
const cameraControls = new OrbitControls(camera, canvas);
cameraControls.enableDamping = true;

// scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(6));
scene.add(camera);

/**
 * Scene Objects
 */

/**
 * HOUSE
 */
// floor
const house = new THREE.Group();
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(config.floor.width, config.floor.height),
  new THREE.MeshStandardMaterial({
    color: config.floor.color,
    side: THREE.DoubleSide,
  })
);
floor.rotation.x = -Math.PI / 2; // 45%
scene.add(floor);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    config.walls.width,
    config.walls.height,
    config.walls.depth
  ),
  new THREE.MeshStandardMaterial({ color: config.walls.color })
);
walls.position.y = config.walls.height / 2;

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(config.door.width, config.door.height),
  new THREE.MeshStandardMaterial({
    color: config.door.color,
    side: THREE.DoubleSide,
  })
);
door.position.z = config.walls.depth / 2 + config.zDelta;
door.position.y = 1.5 * 0.5;

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(
    config.roof.radius,
    config.roof.height,
    config.roof.sides
  ),
  new THREE.MeshStandardMaterial({ color: config.roof.color })
);
roof.position.y = config.walls.height + config.roof.height * 0.5;
roof.rotation.y = config.roof.rotation;

// house bounding-rect
house.add(walls, roof, door);
let houseBox = new THREE.Box3().setFromObject(house, true);
const houseBoundingRect = new THREE.Box3Helper(houseBox, 0xffffff);
houseBoundingRect.visible = config.isWireFrameVisible;
scene.add(houseBoundingRect);
scene.add(house);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(
  config.lights.ambient.color,
  config.lights.ambient.intensity
);
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
const lightsDebug = gui.addFolder("Lights");
lightsDebug.close();
const ambientLightDebug = lightsDebug.addFolder("Ambient");
ambientLightDebug
  .add(config.lights.ambient, "intensity")
  .min(1)
  .max(10)
  .step(0.01)
  .onChange((value) => {
    ambientLight.intensity = value;
  });

const houseDebug = gui.addFolder("House");
const roofDebug = houseDebug.addFolder("Roof");
roofDebug
  .add(config.roof, "radius")
  .min(1)
  .max(10)
  .step(0.1)
  .onChange((value) => {
    roof.geometry.dispose();
    roof.geometry = new THREE.ConeGeometry(value, 1, 4);
    houseBox.setFromObject(house, true);
    houseBoundingRect.updateMatrixWorld();
  });
roofDebug
  .add(config.roof, "rotation")
  .min(0)
  .max(Math.PI * 2)
  .step(Math.PI / 36)
  .onChange((value) => {
    roof.rotation.y = value;
    houseBox.setFromObject(house, true);
    houseBoundingRect.updateMatrixWorld();
  });
houseDebug
  .add(config, "isWireFrameVisible")
  .name("wireframe")
  .onChange((isVisible) => {
    houseBoundingRect.visible = isVisible ? true : false;
  });

const cameraDebug = gui.addFolder("Camera");
cameraDebug.close();
cameraDebug
  .add(config, "isCameraCentalized")
  .name("Centerlize Camera")
  .onChange((isChecked) => {
    if (isChecked == true) {
      cameraControls.target = houseBox.getCenter(new THREE.Vector3());
    } else {
      cameraControls.target = new THREE.Vector3();
    }
  });
