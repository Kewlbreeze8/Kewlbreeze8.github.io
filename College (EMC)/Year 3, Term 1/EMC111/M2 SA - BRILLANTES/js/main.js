// ──────────────────────────────────────────────────────────────────────
// FNAF 1 OFFICE RECREATION
// An M2 Summative Assessment By: Yves Rael C. Brillantes
// ──────────────────────────────────────────────────────────────────────

// === Imports ===
import * as THREE from './three.module.js';
import { PointerLockControls } from './PointerLockControls.js';
import { GLTFLoader } from './GLTFLoader.js';

// --- Rendering ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- Scene + Camera ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101010);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
scene.add(camera);
camera.position.set(0, 6, 5);

// === Controls ===
let isFreeRoam = false;
let overlayVisible = true;

// --- Look angles ---
let targetRotationY = 0;
let currentRotationY = 0;
const LOOK_FORWARD = 0;
const LOOK_LEFT = Math.PI / 3;
const LOOK_RIGHT = -Math.PI / 3;
const LOOK_BACK = Math.PI;

// --- Free roam setup ---
const controls = new PointerLockControls(camera, renderer.domElement);
const move = { forward: 0, backward: 0, left: 0, right: 0 };
const moveSpeed = 3;
renderer.domElement.addEventListener('click', () => { if (isFreeRoam) controls.lock(); });

// --- Camera Zoom ---
let targetFOV = 60;
const zoomMin = 30;
const zoomMax = 90;
const zoomSpeed = 0.05;

// --- Loading Overlay ---
const loadingOverlay = document.createElement('div');
loadingOverlay.style = `
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.9); color: #00ffff;
  font-family: monospace; font-size: 20px; z-index: 999;
`;
loadingOverlay.textContent = 'Loading 3D Assets... 0%';
document.body.appendChild(loadingOverlay);

// ──────────────────────────────────────────────────────────────────────
// === GLTF Loader ===
// ──────────────────────────────────────────────────────────────────────
const loader = new GLTFLoader();
let loadedCount = 0;
const totalModels = 5;

let officeDesk, officeMonitor, deskFan, cupcake, poster;

function updateLoadingProgress() {
  const progress = Math.round((loadedCount / totalModels) * 100);
  loadingOverlay.textContent = `Loading 3D Assets... ${progress}%`;
  if (loadedCount === totalModels) {
    setTimeout(() => {
      loadingOverlay.style.transition = 'opacity 1s ease';
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.remove(), 1200);
    }, 500);
  }
}

function loadModel(name, path, position, scale = 1, rotationY = 0) {
  loader.load(
    `./models/${path}`,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(position.x, position.y, position.z);
      model.scale.setScalar(scale);
      model.rotation.y = rotationY;
      scene.add(model);

      switch (name) {
        case 'desk': officeDesk = model; break;
        case 'monitors': officeMonitor = model; break;
        case 'poster': poster = model; break;
        case 'fan': deskFan = model; break;
        case 'cupcake': cupcake = model; break;
      }

      loadedCount++;
      updateLoadingProgress();
      console.log(`${name} loaded.`);
    },
    undefined,
    (error) => {
      console.error(`Error loading ${path}:`, error);
      loadedCount++;
      updateLoadingProgress();
    }
  );
}

// --- Load 3D Props ---
loadModel('desk', 'office_desk.glb', { x: 0, y: 3.6, z: -5.6 }, 1);
loadModel('poster', 'poster.glb', { x: -3.1, y: 4.2, z: -7.3 }, 2, -Math.PI / 2);
loadModel('monitors', 'office_monitors.glb', { x: -2.5, y: 4.9, z: -6.5 }, 0.005);
loadModel('fan', 'desk_fan.glb', { x: 0, y: 3.7, z: -5.5 }, 3, Math.PI / -1.5);
loadModel('cupcake', 'cupcake.glb', { x: 3.2, y: 5.3, z: -6.5 }, 0.3, -0.1);

// --- Overlay UI ---
const overlay = document.createElement('div');
overlay.style = `
  position: absolute; top: 15px; left: 15px;
  padding: 12px 16px;
  background: rgba(0,0,0,0.6); color: #fff;
  font-family: monospace; font-size: 14px; border-radius: 8px;
  line-height: 1.5; white-space: pre-line;
  transition: opacity 0.5s ease; opacity: 1;
`;
overlay.textContent = `FNAF 1 Office Recreation:

Controls:
F11 - For Full Experience
E - Toggle Ingame/Free Roam Mode
Q - Show/Hide This Message

Ingame:
W - Look Forward
A - Look Left
S - Look Right
D - Look Back

Free Roam:
WASD - Move Around
Mouse - Look Around
Mouse Scroll - Zoom In/Out`;
document.body.appendChild(overlay);

// --- HUD Mode Indicator ---
const hud = document.createElement('div');
hud.style = `
  position: absolute; bottom: 40px; left: 50%;
  transform: translateX(-50%);
  padding: 8px 14px;
  background: rgba(0,0,0,0.7); color: #00ffff;
  font-family: monospace; font-size: 16px;
  border-radius: 10px; opacity: 0;
  transition: opacity 0.6s ease; pointer-events: none;
`;
document.body.appendChild(hud);

// --- Crosshair UI ---
const crosshair = document.createElement('div');
crosshair.style = `
  position: absolute;
  top: 50%; left: 50%;
  width: 20px; height: 20px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  z-index: 999;
  transition: opacity 0.4s ease;
`;

const horizontal = document.createElement('div');
horizontal.style = `
  position: absolute;
  top: 50%; left: 0;
  width: 100%; height: 2px;
  background: #00ffff;
  transform: translateY(-50%);
  border-radius: 2px;
`;

const vertical = document.createElement('div');
vertical.style = `
  position: absolute;
  left: 50%; top: 0;
  width: 2px; height: 100%;
  background: #00ffff;
  transform: translateX(-50%);
  border-radius: 2px;
`;

crosshair.appendChild(horizontal);
crosshair.appendChild(vertical);
document.body.appendChild(crosshair);

function toggleCrosshair(show) {
  crosshair.style.opacity = show ? '1' : '0';
}

// --- Input handling ---
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyQ') {
    overlayVisible = !overlayVisible;
    overlay.style.opacity = overlayVisible ? '1' : '0';
  }

  if (e.code === 'KeyE') {
    isFreeRoam = !isFreeRoam;
    showHUD(isFreeRoam ? '🎥 Free Roam Mode 🎥' : '🕹️ Ingame Mode 🕹️');

    if (isFreeRoam) {
      controls.lock();
      toggleCrosshair(true);
    } else {
      controls.unlock();
      toggleCrosshair(false);
      camera.position.set(0, 6, 5);
      targetRotationY = 0;
      currentRotationY = 0;
      targetFOV = 60;
    }
  }

  if (!isFreeRoam) {
    if (e.code === 'KeyA') targetRotationY = LOOK_LEFT;
    if (e.code === 'KeyD') targetRotationY = LOOK_RIGHT;
    if (e.code === 'KeyS') targetRotationY = LOOK_BACK;
    if (e.code === 'KeyW') targetRotationY = LOOK_FORWARD;
  }

  if (isFreeRoam) {
    if (e.code === 'KeyW') move.forward = 1;
    if (e.code === 'KeyS') move.backward = 1;
    if (e.code === 'KeyA') move.left = 1;
    if (e.code === 'KeyD') move.right = 1;
  }
});

window.addEventListener('keyup', (e) => {
  if (isFreeRoam) {
    if (e.code === 'KeyW') move.forward = 0;
    if (e.code === 'KeyS') move.backward = 0;
    if (e.code === 'KeyA') move.left = 0;
    if (e.code === 'KeyD') move.right = 0;
  }
});

// --- Smooth Mouse Scroll Zoom ---
window.addEventListener('wheel', (e) => {
  if (!isFreeRoam) return;
  targetFOV += e.deltaY * zoomSpeed;
  targetFOV = Math.max(zoomMin, Math.min(zoomMax, targetFOV));
});

// --- HUD Display Function ---
let hudTimeout;
function showHUD(text) {
  hud.textContent = text;
  hud.style.opacity = '1';
  clearTimeout(hudTimeout);
  hudTimeout = setTimeout(() => {
    hud.style.opacity = '0';
  }, 2000);
}

// Hide crosshair when pointer is unlocked (failsafe)
controls.addEventListener('unlock', () => toggleCrosshair(false));

// --- Animation ---
const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();

  camera.fov += (targetFOV - camera.fov) * 5 * dt;
  camera.updateProjectionMatrix();

  if (!isFreeRoam) {
    currentRotationY += (targetRotationY - currentRotationY) * 5 * dt;
    camera.rotation.set(0, currentRotationY, 0);
  } else {
    const dir = new THREE.Vector3();
    const velocity = new THREE.Vector3();

    if (move.forward) velocity.z -= moveSpeed * dt;
    if (move.backward) velocity.z += moveSpeed * dt;
    if (move.left) velocity.x -= moveSpeed * dt;
    if (move.right) velocity.x += moveSpeed * dt;

    dir.copy(velocity).applyQuaternion(camera.quaternion);
    controls.getObject().position.add(dir);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ──────────────────────────────────────────────────────────────────────
// === Room Structure ===
// ──────────────────────────────────────────────────────────────────────
const roomWidth = 10;
const roomDepth = 15;
const roomHeight = 10;
const wallThickness = 0.2;

// --- Wall + Ceiling ---
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x1c1c1c,
  roughness: 0.8,
  metalness: 0.1
});

// --- Floor ---
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth),
  new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 })
);
floor.position.set(0, -wallThickness / 2, 0);
scene.add(floor);

// --- Ceiling ---
const ceiling = new THREE.Mesh(
  new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth),
  wallMaterial
);
ceiling.position.set(0, roomHeight + wallThickness / 2, 0);
scene.add(ceiling);

// --- Back Wall ---
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness),
  wallMaterial
);
backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
scene.add(backWall);

// --- Left Wall ---
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth),
  wallMaterial
);
leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
scene.add(leftWall);

// --- Right Wall ---
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth),
  wallMaterial
);
rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
scene.add(rightWall);

// Load red-striped wall texture
const stripeTexture = new THREE.TextureLoader().load('./textures/wall_tiles.jpg');
stripeTexture.wrapS = THREE.RepeatWrapping;
stripeTexture.wrapT = THREE.RepeatWrapping;
stripeTexture.repeat.set(20, 1); // repeat horizontally

const stripeMaterial = new THREE.MeshStandardMaterial({
  map: stripeTexture,
  roughness: 0.8,
  metalness: 0.1
});

// Stripe height
const stripeHeight = 1.2;

// Left Stripe
const leftStripe = new THREE.Mesh(
  new THREE.PlaneGeometry(roomDepth, stripeHeight),
  stripeMaterial
);
leftStripe.position.set(-roomWidth / 2 + 0.11, 3, 0);
leftStripe.rotation.y = Math.PI / 2;
scene.add(leftStripe);

// Right Stripe
const rightStripe = new THREE.Mesh(
  new THREE.PlaneGeometry(roomDepth, stripeHeight),
  stripeMaterial
);
rightStripe.position.set(roomWidth / 2 - 0.11, 3, 0);
rightStripe.rotation.y = -Math.PI / 2;
scene.add(rightStripe);

// ──────────────────────────────────────────────────────────────────────
// --- Door Light & Closed Variants ---
// ──────────────────────────────────────────────────────────────────────
const leftDoorLightTexture = new THREE.TextureLoader().load('./textures/left_door_light.png');
const rightDoorLightTexture = new THREE.TextureLoader().load('./textures/right_door_light.png');
const leftDoorClosedTexture = new THREE.TextureLoader().load('./textures/left_door_closed.png');
const rightDoorClosedTexture = new THREE.TextureLoader().load('./textures/right_door_closed.png');

// --- Window Light Textures ---
const leftWindowLightTexture  = new THREE.TextureLoader().load('./textures/left_window_light.png');
const rightWindowLightTexture = new THREE.TextureLoader().load('./textures/right_window_light.png');

// --- ALT Light Textures (Bonnie / Chica at door/window) ---
const leftDoorLightAltTexture = new THREE.TextureLoader().load('./textures/left_door_light_alt.png');
const rightDoorLightAltTexture = new THREE.TextureLoader().load('./textures/right_door_light_alt.png');
const leftWindowLightAltTexture = new THREE.TextureLoader().load('./textures/left_window_light_alt.png');
const rightWindowLightAltTexture = new THREE.TextureLoader().load('./textures/right_window_light_alt.png');

// --- Door Textures ---
const doorTextureLeft = new THREE.TextureLoader().load('./textures/door_texture.png');
const doorTextureRight = new THREE.TextureLoader().load('./textures/door_texture.png');

// --- Door Materials ---
const leftDoorMaterial = new THREE.MeshStandardMaterial({
  map: doorTextureLeft,
  metalness: 0.3,
  roughness: 0.6
});

const rightDoorMaterial = new THREE.MeshStandardMaterial({
  map: doorTextureRight,
  metalness: 0.3,
  roughness: 0.6
});

// --- Left Door Panel ---
const leftDoorPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 8.5),
  leftDoorMaterial
);
leftDoorPanel.position.set(-4.7, 4.2, 3);
leftDoorPanel.rotation.y = Math.PI / 2;
scene.add(leftDoorPanel);

// --- Right Door Panel ---
const rightDoorPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 8.5),
  rightDoorMaterial
);
rightDoorPanel.position.set(4.7, 4.2, 3);
rightDoorPanel.rotation.y = -Math.PI / 2;
scene.add(rightDoorPanel);

// --- Window panel ---
const windowTexture = new THREE.TextureLoader().load('./textures/window_texture.png');
const windowMaterial = new THREE.MeshStandardMaterial({
  map: windowTexture,
  metalness: 0.2,
  roughness: 0.1,
  transmission: 0.7,
  transparent: true,
  opacity: 0.9,
  thickness: 0.2,
  emissive: new THREE.Color(0x000000),
  emissiveIntensity: 0
});

// --- Left ---
const leftWindowPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  windowMaterial
);
leftWindowPanel.position.set(-4.7, 6.5, -2);
leftWindowPanel.rotation.y = Math.PI / 2;
scene.add(leftWindowPanel);

// --- Right ---
const rightWindowPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  windowMaterial
);
rightWindowPanel.position.set(4.7, 6.5, -2);
rightWindowPanel.rotation.y = -Math.PI / 2;
scene.add(rightWindowPanel);

// Optional: Back trim for depth illusion
const backTrim = new THREE.Mesh(
  new THREE.BoxGeometry(roomWidth, 0.2, 0.2),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
backTrim.position.set(0, 0.1, -roomDepth / 2 - 0.1);
scene.add(backTrim);

// --- Lighting ---
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);
const directional = new THREE.DirectionalLight(0xffffff, 0.7);
directional.position.set(3, 5, 2);
scene.add(directional);

// === Extra Geometry, Materials, Textures, Lighting, Animations & Particles ===

// --- Additional Lighting ---
const pointLight = new THREE.PointLight(0xffaa88, 1, 8);
pointLight.position.set(0, 9, -5);
scene.add(pointLight);

// --- SpotLight from ceiling ---
const spotLight = new THREE.SpotLight(0xffffff, 1.2);
spotLight.position.set(0, roomHeight - 0.2, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.4;
spotLight.target.position.set(0, 0, -5);
scene.add(spotLight);
scene.add(spotLight.target);

// --- Decorative Geometries with Different Materials ---

// --- Light Bulb (emissive glowing ball) ---
const bulbGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const bulbMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffaa88,
  emissiveIntensity: 10,
  color: 0xffaa88
});
const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
bulb.position.set(0, 9.6, -5);
scene.add(bulb);

// --- Light Bulb Cone ---
const bulbCone = new THREE.Mesh(
  new THREE.ConeGeometry(1, 0.5, 32),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x787878,
    emissiveIntensity: 0.8
  })
);
bulbCone.position.set(0, 10, -5);
scene.add(bulbCone);

// --- Particle System (dust / ambient atmosphere) ---
const particleCount = 250;
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < particleCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 20,
    Math.random() * roomHeight,
    (Math.random() - 0.5) * 20
  );
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  transparent: true,
  opacity: 0.7,
  depthWrite: false
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// --- Animation Additions ---
const extraClock = new THREE.Clock();
const animateExtras = () => {
  const dt = extraClock.getDelta();
  particles.rotation.y += dt * 0.1;
};

// ──────────────────────────────────────────────────────────────────────
// --- Additional Objects (Props & Scene Details) ---
// ──────────────────────────────────────────────────────────────────────

const texLoader = new THREE.TextureLoader();

// --- TEXTURES ---
const floorTex = texLoader.load('./textures/floor_tiles.jpg');
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(5, 5);

const particleTex = texLoader.load('./textures/particles.png');

// --- Update floor + walls with textures ---
floor.material.map = floorTex;
floor.material.needsUpdate = true;
ceiling.material.color.set(0x1c1c1c); // keep neutral

// --- 1. Plastic Cup with Straw & Flat Lid ---
const cup = new THREE.Group();

// Cup lid
const lid = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 0.05, 30),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
  })
);
lid.scale.set(0.7, 0.7, 0.7);
lid.position.y = 1.11;
cup.add(lid);

// Cup base
const cupBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.6, 0.4, 1.5, 32, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1
  })
);
cupBody.scale.set(0.5, 0.5, 0.5);
cupBody.position.y = 0.75;
cup.add(cupBody);

// Straw
const straw = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 2, 16),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
straw.scale.set(0.5, 0.5, 0.5);
straw.position.y = 1;
cup.add(straw);

// Final positioning and scaling
cup.position.set(-2.3, 3.32, -5);
cup.scale.set(1, 1, 1);

scene.add(cup);

// --- 2. Flat Papers ---

// Desk Papers (Horizontal)
const deskPaper1 = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1.4),
  new THREE.MeshStandardMaterial({ color: 0xf5f5f5 })
);
deskPaper1.rotation.x = -Math.PI / 2;
deskPaper1.rotation.z = -Math.PI / 1.1;
deskPaper1.position.set(-1.3, 3.72, -5.5);
scene.add(deskPaper1);

const deskPaper2 = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1.4),
  new THREE.MeshStandardMaterial({ color: 0xf5f5f5 })
);
deskPaper2.rotation.x = -Math.PI / 2;
deskPaper2.rotation.z = -Math.PI / -1.1;
deskPaper2.position.set(1.3, 3.72, -5.5);
scene.add(deskPaper2);

// Wall Drawings (Vertical Papers w/ Drawing Textures)

const drawingTextures = [];
for (let i = 1; i <= 6; i++) {
  const tex = texLoader.load(`./textures/Drawing_${i}.png`);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  drawingTextures.push(tex);
}

function createDrawing(tex, position, rotationY = 0) {
  const paper = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.6),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.7,
      metalness: 0.1
    })
  );
  paper.position.set(position.x, position.y, position.z);
  paper.rotation.y = rotationY;
  scene.add(paper);
  return paper;
}

const drawings = [
  createDrawing(drawingTextures[0], { x: 1, y: 8.5, z: -7.2 }), // Drawing 1
  createDrawing(drawingTextures[1], { x: 0, y: 6.9, z: -7.3 }), // Drawing 2
  createDrawing(drawingTextures[2], { x: 2, y: 10, z: -7.1 }),  // Drawing 3
  createDrawing(drawingTextures[3], { x: 1.5, y: 6.5, z: -7.3 }), // Drawing 4
  createDrawing(drawingTextures[4], { x: 2.5, y: 8, z: -7.2 }), // Drawing 5
  createDrawing(drawingTextures[5], { x: 3.5, y: 9.3, z: -7.2 }) // Drawing 6
];

// --- 3. Circular Crumpled Papers ---
for (let i = 0; i < 4; i++) {
  const paper = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.9 })
  );
  paper.position.set((Math.random() - 0.5) * 5, 3.8, -5.5 + (Math.random() - 0.5) * 1);
  scene.add(paper);
}

// --- 4. Speaker w/ Grills---
const speaker = new THREE.Group();

// Speaker Body (Black Box)
const speakerBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 3.2, 1),
  new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.1,
    roughness: 0.9
  })
);
speakerBody.position.set(0, 1.5, 0); // Relative to group
speaker.add(speakerBody);

// 2. Grill Inset Depth
const insetDepth = 0.05;

// TOP GRILL (Inset into body) 
const topGrill = new THREE.Mesh(
  new THREE.CircleGeometry(0.35, 30),
  new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.3,
    roughness: 0.7
  })
);
topGrill.position.set(0, 2.4, -0.6);
topGrill.position.z = -0.7;
topGrill.rotation.x = Math.PI;
speaker.add(topGrill);

// Top Bezel (ring)
const topBezel = new THREE.Mesh(
  new THREE.RingGeometry(0, 0.50 , 30),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
topBezel.position.copy(topGrill.position);
topBezel.position.z = -0.6;
topBezel.rotation.x = Math.PI;
speaker.add(topBezel);

// BOTTOM GRILL
const bottomGrill = new THREE.Mesh(
  new THREE.CircleGeometry(0.60, 30),
  new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.3,
    roughness: 0.7
  })
);
bottomGrill.position.set(0, 1, -0.6);
bottomGrill.position.z = -0.7;
bottomGrill.rotation.x = Math.PI;
speaker.add(bottomGrill);

// Bottom Bezel
const bottomBezel = new THREE.Mesh(
  new THREE.RingGeometry(0, 0.75 , 30),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
bottomBezel.position.copy(bottomGrill.position);
bottomBezel.position.z = -0.6;
bottomBezel.rotation.x = Math.PI;
speaker.add(bottomBezel);


speaker.position.set(2.5, 0, -5);
speaker.rotation.y = Math.PI / 1.2;

scene.add(speaker);

// --- 4. Square Windows (both sides) ---
// --- Window Frame Material ---
const windowFrameMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
  roughness: 0.6,
  metalness: 0.3
});

// --- Glass Materials (separate for left/right) ---
const leftWindowMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.2,
  roughness: 0.1,
  transmission: 0.7,
  transparent: true,
  opacity: 0.9,
  thickness: 0.2,
  map: windowTexture
});

const rightWindowMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.2,
  roughness: 0.1,
  transmission: 0.7,
  transparent: true,
  opacity: 0.9,
  thickness: 0.2,
  map: windowTexture
});

// --- Hollow Window Frames ---
const windowFrameThickness = 0.25;
const windowFrameDepth = 0.15;

// --- Left glass ---
const leftWindowGlass = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  leftWindowMaterial
);
leftWindowGlass.position.z = 0.06;

// --- Right glass ---
const rightWindowGlass = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  rightWindowMaterial
);
rightWindowGlass.position.z = 0.06;

// Hollow frames
const leftWindowFrame = createHollowFrame(
  4.3, 4.3, windowFrameDepth, windowFrameThickness, windowFrameMaterial
);
const rightWindowFrame = createHollowFrame(
  4.3, 4.3, windowFrameDepth, windowFrameThickness, windowFrameMaterial
);

// Groups
const leftWindowGroup = new THREE.Group();
leftWindowGroup.add(leftWindowFrame, leftWindowGlass);
leftWindowGroup.position.set(-4.6, 6.5, -2);
leftWindowGroup.rotation.y = Math.PI / 2;
scene.add(leftWindowGroup);

const rightWindowGroup = new THREE.Group();
rightWindowGroup.add(rightWindowFrame, rightWindowGlass);
rightWindowGroup.position.set(4.6, 6.5, -2);
rightWindowGroup.rotation.y = -Math.PI / 2;
scene.add(rightWindowGroup);

// ──────────────────────────────────────────────────────────────────────
//  HOLLOW FRAME FUNCTION (for windows & doors)
// ──────────────────────────────────────────────────────────────────────
function createHollowFrame(width, height, depth, frameThickness, material) {
  const group = new THREE.Group();
  const halfW = width / 2;
  const halfH = height / 2;

  // Top bar
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width, frameThickness, depth),
    material
  );
  top.position.set(0, halfH - frameThickness / 2, 0);
  group.add(top);

  // Bottom bar
  const bottom = top.clone();
  bottom.position.y = -halfH + frameThickness / 2;
  group.add(bottom);

  // Left bar
  const left = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, height - frameThickness * 2, depth),
    material
  );
  left.position.set(-halfW + frameThickness / 2, 0, 0);
  group.add(left);

  // Right bar
  const right = left.clone();
  right.position.x = halfW - frameThickness / 2;
  group.add(right);

  return group;
}

// --- 5. Doors (both sides) ---
// --- Door Frame Material ---
const doorFrameMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
  roughness: 0.6,
  metalness: 0.3
});

// --- Left Door Group ---
const leftDoorGroup = new THREE.Group();
const leftDoorFrame = createHollowFrame(4.3, 9.3, 0.15, 0.25, doorFrameMaterial);
leftDoorGroup.add(leftDoorFrame);
leftDoorGroup.position.set(-4.6, 4, 3);
leftDoorGroup.rotation.y = Math.PI / 2;
scene.add(leftDoorGroup);

// --- Right Door Group ---
const rightDoorGroup = new THREE.Group();
const rightDoorFrame = createHollowFrame(4.3, 9.3, 0.15, 0.25, doorFrameMaterial);
rightDoorGroup.add(rightDoorFrame);
rightDoorGroup.position.set(4.6, 4, 3);
rightDoorGroup.rotation.y = -Math.PI / 2;
scene.add(rightDoorGroup);

// --- Update Particle System to use circular texture ---
particlesMaterial.map = particleTex;
particlesMaterial.needsUpdate = true;

// === Door Funtions ===

// --- Textures ---
const doorCloseTexture = new THREE.TextureLoader().load('./textures/door_texture.png');
const buttonTexture = new THREE.TextureLoader().load('./textures/particles.png'); // optional texture for the button surface

// --- Door Material ---
const animatedDoorMaterial = new THREE.MeshStandardMaterial({
  map: doorCloseTexture,
  metalness: 0.2,
  roughness: 0.6
});

// --- Button Material ---
const buttonMaterial = new THREE.MeshStandardMaterial({
  map: buttonTexture,
  metalness: 0.3,
  roughness: 0.4
});

// --- Animated Doors ---
const leftAnimatedDoor = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 9),
  animatedDoorMaterial
);
leftAnimatedDoor.position.set(-4.8, 4, 3);
leftAnimatedDoor.rotation.y = Math.PI / 2;
leftAnimatedDoor.visible = false;
scene.add(leftAnimatedDoor);

const rightAnimatedDoor = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 9),
  animatedDoorMaterial
);
rightAnimatedDoor.position.set(4.8, 4, 3);
rightAnimatedDoor.rotation.y = -Math.PI / 2;
rightAnimatedDoor.visible = false;
scene.add(rightAnimatedDoor);

// --- Buttons Group Function ---
function createButtonSet(xPos, yPos, zPos, rotationY) {
  const doorButton = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.05),
    buttonMaterial
  );
  doorButton.position.set(xPos, yPos + 0.4, zPos);
  doorButton.rotation.y = rotationY;

  const lightButton = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.05),
    buttonMaterial
  );
  lightButton.position.set(xPos, yPos - 0.4, zPos);
  lightButton.rotation.y = rotationY;

  scene.add(doorButton, lightButton);
  return { doorButton, lightButton };
}

// Left & Right button panels (by the office desk sides)
const leftButtons = createButtonSet(-4.6, 5.5, 6, Math.PI / 2);
const rightButtons = createButtonSet(4.6, 5.5, 6, -Math.PI / 2);

// --- Button Panel ---
const panelMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.4,
  roughness: 0.7
});

// Function to create a control panel box
function createButtonBox(xPos, yPos, zPos, rotY) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.2),
    panelMaterial
  );
  box.position.set(xPos, yPos, zPos);
  box.rotation.y = rotY;
  scene.add(box);

  return box;
}

// --- Left Panel ---
const leftButtonBox = createButtonBox(-4.7, 5.5, 6, Math.PI / 2);

// --- Right Panel ---
const rightButtonBox = createButtonBox(4.7, 5.5, 6, -Math.PI / 2);

// --- Control Box Labels ---
const doorsLabelTexture = new THREE.TextureLoader().load('./textures/door_label.png');
const lightsLabelTexture = new THREE.TextureLoader().load('./textures/light_label.png');

const labelMaterialDoors = new THREE.MeshStandardMaterial({
  map: doorsLabelTexture,
  transparent: true,
  roughness: 0.8,
  metalness: 0.2
});
const labelMaterialLights = new THREE.MeshStandardMaterial({
  map: lightsLabelTexture,
  transparent: true,
  roughness: 0.8,
  metalness: 0.2
});

// Function to create a label plane and attach it to a control box
function createLabel(textureMaterial, xPos, yPos, zPos, rotY) {
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.3),
    textureMaterial
  );
  label.position.set(xPos, yPos, zPos);
  label.rotation.y = rotY;
  scene.add(label);
  return label;
}

// --- Left Side Labels ---
const leftDoorsLabel = createLabel(labelMaterialDoors, -4.59, 5.5, 6, Math.PI / 2);
const leftLightsLabel = createLabel(labelMaterialLights, -4.59, 4.7, 6, Math.PI / 2);

// --- Right Side Labels ---
const rightDoorsLabel = createLabel(labelMaterialDoors, 4.59, 5.5, 6, -Math.PI / 2);
const rightLightsLabel = createLabel(labelMaterialLights, 4.59, 4.7, 6, -Math.PI / 2);

// --- Door State ---
let leftDoorDown = false;
let rightDoorDown = false;

// --- Door Animation Params ---
const doorSpeed = 5;
const doorTargetY = 4.51;
const doorOpenY   = 13.5;

// --- Door Control Function ---
function toggleDoor(side) {
  if (side === 'left') {
    leftDoorDown = !leftDoorDown;
    leftAnimatedDoor.visible = true;
  } else {
    rightDoorDown = !rightDoorDown;
    rightAnimatedDoor.visible = true;
  }
}

// --- Button Interactions ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x330000 });
const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 });
const greyMaterial = new THREE.MeshStandardMaterial({ color: 0x777777, emissive: 0x222222 });
const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x777777 });

// Assign default materials
leftButtons.doorButton.material = redMaterial.clone();
rightButtons.doorButton.material = redMaterial.clone();
leftButtons.lightButton.material = greyMaterial.clone();
rightButtons.lightButton.material = greyMaterial.clone();

// Keep track of toggle states
let doorStates = { left: false, right: false };
let lightTimers = { left: null, right: null };
let lightStates = { left: false, right: false };

// --- Shared Animatronic State (sync door + window) ---
let animatronicStates = { left: false, right: false };
const ANIMATRONIC_CHANCE = 0.3; // 30% chance

// ──────────────────────────────────────────────────────────────────────
//  SINGLE FUNCTION: Handles ALL door textures (light + closed states)
// ──────────────────────────────────────────────────────────────────────
function updateDoorTexture(side) {
  const panel = side === 'left' ? leftDoorPanel : rightDoorPanel;
  
  let targetTex;

  if (doorStates[side]) {
    targetTex = side === 'left' ? leftDoorClosedTexture : rightDoorClosedTexture;
  } else if (lightStates[side]) {
    targetTex = animatronicStates[side]
      ? (side === 'left' ? leftDoorLightAltTexture : rightDoorLightAltTexture)
      : (side === 'left' ? leftDoorLightTexture : rightDoorLightTexture);
  } else {
    targetTex = side === 'left' ? doorTextureLeft : doorTextureRight;
  }

  panel.material.map = targetTex;
  panel.material.needsUpdate = true;
}

function setWindowLightState(side, isActive) {
  const glass = side === 'left' ? leftWindowGlass : rightWindowGlass;
  
  let targetTex;
  if (isActive) {
    targetTex = animatronicStates[side]
      ? (side === 'left' ? leftWindowLightAltTexture : rightWindowLightAltTexture)
      : (side === 'left' ? leftWindowLightTexture : rightWindowLightTexture);
  } else {
    targetTex = windowTexture;
  }

  glass.material.map = targetTex;
  glass.material.needsUpdate = true;
}

// --- Handle Clicks ---
function onButtonClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const clickable = [
    leftButtons.doorButton,
    rightButtons.doorButton,
    leftButtons.lightButton,
    rightButtons.lightButton
  ];

  const intersects = raycaster.intersectObjects(clickable);
  if (intersects.length > 0) {
    const button = intersects[0].object;

    // === Door Button ===
    if (button === leftButtons.doorButton || button === rightButtons.doorButton) {
      const side = button === leftButtons.doorButton ? "left" : "right";

      doorStates[side] = !doorStates[side];
      if (side === 'left') leftDoorDown = doorStates.left;
      if (side === 'right') rightDoorDown = doorStates.right;

      button.material = doorStates[side] ? greenMaterial.clone() : redMaterial.clone();

      if (side === 'left') leftAnimatedDoor.visible = true;
      if (side === 'right') rightAnimatedDoor.visible = true;

      updateDoorTexture(side);
      console.log(`${side} door ${doorStates[side] ? "closed" : "opened"}`);
    }

    // === Light Button ===
    if (button === leftButtons.lightButton || button === rightButtons.lightButton) {
      const side = button === leftButtons.lightButton ? "left" : "right";

      lightStates[side] = !lightStates[side];
      
      if (lightStates[side]) {
        animatronicStates[side] = Math.random() < ANIMATRONIC_CHANCE;
      }
      
      button.material = lightStates[side] ? whiteMaterial.clone() : greyMaterial.clone();

      updateDoorTexture(side);
      setWindowLightState(side, lightStates[side]);

      if (lightTimers[side]) clearTimeout(lightTimers[side]);
      lightTimers[side] = setTimeout(() => {
        lightStates[side] = false;
        button.material = greyMaterial.clone();
        updateDoorTexture(side);
        setWindowLightState(side, false);
        console.log(`${side} lights off`);
        lightTimers[side] = null;
      }, 3000);

      console.log(`${side} lights ${lightStates[side] ? "ON" : "OFF"} ${animatronicStates[side] ? "(ANIMATRONIC!)" : ""}`);
    }
  }
}

window.addEventListener('click', onButtonClick);
requestAnimationFrame(animate);