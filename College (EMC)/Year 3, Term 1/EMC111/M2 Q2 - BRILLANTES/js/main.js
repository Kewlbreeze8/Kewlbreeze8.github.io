import * as THREE from './three.module.js';

// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e); // dark navy office tone

// === Camera Setup ===
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 20);
camera.lookAt(0, 3, 0);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // enable shadows
document.body.appendChild(renderer.domElement);

// === Basic Lighting ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(10, 15, 10);
mainLight.castShadow = true;
scene.add(mainLight);

// === Materials ===
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xd1d1e0, // soft gray-blue office wall
  roughness: 1,
  metalness: 0,
});

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x444444, // dark carpet tone
  roughness: 0.8,
});

// === Floor ===
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// === Left Wall ===
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-10, 5, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);

// === Back Wall ===
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
backWall.position.set(0, 5, -10);
backWall.receiveShadow = true;
scene.add(backWall);

// === Right Wall ===
const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(10, 5, 0);
rightWall.receiveShadow = true;
scene.add(rightWall);

// === Office Desk ===
const deskMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b5a2b, // wooden tone
  roughness: 0.7,
  metalness: 0.1,
});

const desk = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 4), deskMaterial);
desk.position.set(0, 2.2, -5);
desk.castShadow = true;
desk.receiveShadow = true;
scene.add(desk);

// Desk Legs (metal)
const legMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  metalness: 0.8,
  roughness: 0.3,
});

for (let x = -3.5; x <= 3.5; x += 7) {
  for (let z = -1.5; z <= 1.5; z += 3) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 2.2, 16),
      legMaterial
    );
    leg.position.set(x, 1, -5 + z);
    leg.castShadow = true;
    scene.add(leg);
  }
}

// === Chair ===
const chairMaterial = new THREE.MeshStandardMaterial({
  color: 0x202020, // dark gray seat
  roughness: 0.8,
});

const chairSeat = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 0.4, 2.5),
  chairMaterial
);
chairSeat.position.set(0, 1.2, -1.5);
chairSeat.castShadow = true;
scene.add(chairSeat);

const chairBack = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 2, 0.2),
  chairMaterial
);
chairBack.position.set(0, 2.2, -0.7);
chairBack.castShadow = true;
scene.add(chairBack);

// Chair Stem + Base
const stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16),
  new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 })
);
stem.position.set(0, 0.5, -1.5);
scene.add(stem);

const base = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
base.position.set(0, 0.05, -1.5);
scene.add(base);

// === Monitor (Flat LED Display) ===
const monitorBase = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.1, 0.5),
  new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 })
);
monitorBase.position.set(0, 2.5, -4.9);
scene.add(monitorBase);

const monitorStand = new THREE.Mesh(
  new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16),
  new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7 })
);
monitorStand.position.set(0, 2.95, -4.9);
scene.add(monitorStand);

const monitorScreen = new THREE.Mesh(
  new THREE.BoxGeometry(3.5, 2.2, 0.1),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x00aaff,
    emissiveIntensity: 0.4,
  })
);
monitorScreen.position.set(0, 4, -4.8);
scene.add(monitorScreen);

// === Keyboard ===
const keyboardBase = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 0.1, 1),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
keyboardBase.position.set(0, 2.35, -3.5);
scene.add(keyboardBase);

// === Keyboard keys ===
for (let x = -1; x <= 1; x += 0.4) {
  for (let z = -0.4; z <= 0.4; z += 0.4) {
    const key = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.05, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    key.position.set(x, 2.4, -3.5 + z);
    scene.add(key);
  }
}

// === Chair Armrests ===
const armMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a,
  roughness: 0.6,
  metalness: 0.3,
});

// Left Armrest
const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 2), armMaterial);
armLeft.position.set(-1.3, 1.6, -1.5);
scene.add(armLeft);

// Right Armrest
const armRight = armLeft.clone();
armRight.position.set(1.3, 1.6, -1.5);
scene.add(armRight);

// === Ceiling Panel Light ===

// Light panel frame (emissive surface)
const panelGeometry = new THREE.PlaneGeometry(6, 3);
const panelMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 1.5,
  side: THREE.DoubleSide,
});
const ceilingPanel = new THREE.Mesh(panelGeometry, panelMaterial);
ceilingPanel.rotation.x = Math.PI / 2;
ceilingPanel.position.set(0, 9.9, -5);
scene.add(ceilingPanel);

// Area-like soft light for illumination
const ceilingLight = new THREE.PointLight(0xffffff, 1.2, 30);
ceilingLight.position.set(0, 9.5, -5);
ceilingLight.castShadow = true;
scene.add(ceilingLight);

// Add a faint ambient fill to simulate reflected light
const ambientFill = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientFill);

// === Desk Lamp ===

// Lamp base
const lampBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
  new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 })
);
lampBase.position.set(2.5, 2.3, -4.8);
scene.add(lampBase);

// Lamp stand (pole)
const lampStand = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16),
  new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9 })
);
lampStand.position.set(2.5, 3, -4.8);
scene.add(lampStand);

// Lamp shade (cone)
const lampShade = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 0.8, 20, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.4,
    roughness: 0.3,
    side: THREE.DoubleSide,
  })
);
lampShade.rotation.x = Math.PI;
lampShade.position.set(2.5, 3.8, -4.8);
scene.add(lampShade);

// Lamp bulb glow (small sphere)
const bulb = new THREE.Mesh(
  new THREE.SphereGeometry(0.15, 16, 16),
  new THREE.MeshStandardMaterial({
    emissive: 0xffee88,
    emissiveIntensity: 1.8,
    color: 0xffffff,
  })
);
bulb.position.set(2.5, 4.1, -4.8);
scene.add(bulb);

// Lamp light (warm tone)
const lampLight = new THREE.PointLight(0xffe29f, 1.2, 8);
lampLight.position.set(2.5, 3.5, -4.8);
lampLight.castShadow = true;
scene.add(lampLight);

// === Textures ===
const textureLoader = new THREE.TextureLoader();
const carpetTexture = textureLoader.load('../textures/carpet_pattern.jpg');
const pinboardTexture = textureLoader.load('../textures/pinboard_texture.jpg');

// === Floor Carpet ===
const carpetMaterial = new THREE.MeshStandardMaterial({
  map: carpetTexture,
  roughness: 0.9,
  metalness: 0.0,
});
const carpet = new THREE.Mesh(new THREE.CircleGeometry(4, 32), carpetMaterial);
carpet.rotation.x = -Math.PI / 2;
carpet.position.set(0, 0.01, -5);
scene.add(carpet);

// === Cubicle Pinboard ===
const pinboardMaterial = new THREE.MeshStandardMaterial({
  map: pinboardTexture,
  color: 0xffffff,
  roughness: 0.8,
});
const pinboard = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), pinboardMaterial);
pinboard.position.set(-5, 5, -9.9);
scene.add(pinboard);

// === Decorative Props ===

// --- Coffee Mug (ceramic material) ---
const mug = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.6,
    metalness: 0.1
  })
);
mug.position.set(1.5, 2.2, -5);
scene.add(mug);

// Mug handle (torus)
const mugHandle = new THREE.Mesh(
  new THREE.TorusGeometry(0.18, 0.05, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
mugHandle.rotation.y = Math.PI / 2;
mugHandle.position.set(1.8, 2.2, -5);
scene.add(mugHandle);

// --- Small Desk Plant (metal pot + leaves) ---
const pot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.35, 0.4, 16),
  new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.7,
    roughness: 0.3
  })
);
pot.position.set(-1.2, 2.2, -5);
scene.add(pot);

// Leaves (simple green cone)
const leaves = new THREE.Mesh(
  new THREE.ConeGeometry(0.35, 0.8, 16),
  new THREE.MeshStandardMaterial({ color: 0x228b22 })
);
leaves.position.set(-1.2, 2.7, -5);
scene.add(leaves);

// --- Glass Cup (transparency test) ---
const glassCup = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32),
  new THREE.MeshPhysicalMaterial({
    color: 0x99ccff,
    roughness: 0.1,
    metalness: 0,
    transmission: 1,   // full glass effect
    transparent: true,
    opacity: 0.9,
    ior: 1.5,
    thickness: 0.2
  })
);
glassCup.position.set(0.2, 2.25, -4.7);
scene.add(glassCup);

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// === Resize Handler ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});




