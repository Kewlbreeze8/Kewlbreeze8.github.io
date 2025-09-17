// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5); // light blue-gray for ambient mood

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  60, // narrower field of view to reduce distortion
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Pull camera back and higher up, angled toward center of room
camera.position.set(18, 8, 18);  
camera.lookAt(0, 5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Lighting ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(10, 15, 10);
scene.add(pointLight);

// === Materials ===
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xd2b48c }); // wood-like tan
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 }); // off-white walls

// === Floor ===
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  floorMaterial
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// === Left Wall ===
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 10),
  new THREE.MeshStandardMaterial({ color: 0xadd8e6 }) // light blue
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-10, 5, 0);
scene.add(leftWall);

// === Right Wall ===
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 10),
  new THREE.MeshStandardMaterial({ color: 0xadd8e6 }) // light blue
);
rightWall.position.set(0, 5, -10);
scene.add(rightWall);

// === Animate ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// === Handle Resize ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Main Room Light (Ceiling) ===
const ceilingLight = new THREE.PointLight(0xffffff, 1.2, 30); 
ceilingLight.position.set(0, 8, 0); // centered above the room
scene.add(ceilingLight);

// Ceiling fixture base (attached to ceiling)
const fixtureBase = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 0.2, 32),
  new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6 }) // dark metallic base
);
fixtureBase.position.set(0, 9, 0); // just under the ceiling
scene.add(fixtureBase);

// Ceiling lamp dome (frosted glass look)
const fixtureDome = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), 
  // half-sphere (dome)
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    emissive: 0xffffff,
    emissiveIntensity: 0.2
  })
);
fixtureDome.position.set(0, 7.9, 0);
scene.add(fixtureDome);

// === Trash Can ===
const trashCan = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1.5, 30, 1, true), 
  // smaller radius and shorter height
  new THREE.MeshStandardMaterial({
    color: 0x808080, // gray metal
    side: THREE.DoubleSide,
    metalness: 0.6,
    roughness: 0.4
  })
);

// Add a thin rim for the top
const trashCanRim = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.05, 15, 100),
  new THREE.MeshStandardMaterial({ color: 0x606060, metalness: 0.8 })
);
trashCanRim.rotation.x = Math.PI / 2;
trashCanRim.position.y = 0.5; 
trashCan.add(trashCanRim);

trashCan.position.set(-8.5, 0.5, -4.5); 
scene.add(trashCan);

// === Bed ===
const bedFrame = new THREE.Mesh(
  new THREE.BoxGeometry(6, 1, 3),
  new THREE.MeshStandardMaterial({ color: 0x8b4513 })
);
bedFrame.position.set(-7, 0.5, -8);
scene.add(bedFrame);

const mattress = new THREE.Mesh(
  new THREE.BoxGeometry(6, 0.5, 3),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
mattress.position.set(-7, 1.25, -8);
scene.add(mattress);

// === Pillow ===
const pillow = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.5, 3),
  new THREE.MeshStandardMaterial({ color: 0xfff8dc })
);
pillow.position.set(-9.5, 1.6, -8);
pillow.rotation.y = Math.PI / 2;  
scene.add(pillow);

// Blanket
const blanket = new THREE.Mesh(
  new THREE.BoxGeometry(4, 0.2, 3), // slightly shorter than mattress
  new THREE.MeshStandardMaterial({ color: 0x1e90ff }) // Dodger blue
);
blanket.position.set(-6, 1.6, -8); // sits just above mattress
scene.add(blanket);

// === Door ===
const door = new THREE.Mesh(
  new THREE.BoxGeometry(4, 7, 0.1),
  new THREE.MeshStandardMaterial({ color: 0x654321 }) // dark brown
);
door.rotation.y = Math.PI / 2;   // face inward from left wall
door.position.set(-10, 2, 0);   // flush with left wall, near back
scene.add(door);

// Door knob
const knob = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 10, 10),
  new THREE.MeshStandardMaterial({ color: 0xd4af37 }) // gold
);
// Position knob slightly inward on door surface
knob.position.set(-10, 2.4, -1.5);
scene.add(knob);

// === Closet / Cabinet ===
const closet = new THREE.Mesh(
  new THREE.BoxGeometry(3, 6, 6),
  new THREE.MeshStandardMaterial({ color: 0x3a5fcd }) // royal blue
);
closet.position.set(-9.5, 3, 6.5); // along left wall
scene.add(closet);

// Closet doors
const closetDoor1 = new THREE.Mesh(
  new THREE.PlaneGeometry(1.7, 4, 1),
  new THREE.MeshStandardMaterial({ color: 0x4682b4 }) // steel blue
);
closetDoor1.position.set(0, 4.5, 11);
closetDoor1.rotation.y = Math.PI / 2;
scene.add(closetDoor1);

const closetDoor2 = new THREE.Mesh(
  new THREE.PlaneGeometry(1.7, 4, 1),
  new THREE.MeshStandardMaterial({ color: 0x4682b4 }) // steel blue
);
closetDoor2.position.set(0, 4.5, 9);
closetDoor2.rotation.y = Math.PI / 2;
scene.add(closetDoor2);

// Closet handles
const handle1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16),
  new THREE.MeshStandardMaterial({ color: 0x000000 }) // black
);
handle1.position.set(0, 4.5, 10.5);
scene.add(handle1);

const handle2 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16),
  new THREE.MeshStandardMaterial({ color: 0x000000 }) // black
);
handle2.position.set(0, 4.5, 9.5);
scene.add(handle2);

// === Window ===
const windowFrame = new THREE.Mesh(
  new THREE.BoxGeometry(12.5, 4, 0.1),
  new THREE.MeshStandardMaterial({ color: 0x000000 }) // black frame
);
windowFrame.position.set(-5, 4, -10);
scene.add(windowFrame);

// Left Glass Pane
const leftGlass = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 3.5),
  new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.5
  })
);
leftGlass.position.set(-6.4, 4.1, -9); // left side
scene.add(leftGlass);

// Right Glass Pane
const rightGlass = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 3.5),
  new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.5
  })
);
rightGlass.position.set(-1, 4.1, -9); // right side
scene.add(rightGlass);

// Center Divider
const divider = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 3.8, 0.1),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
divider.position.set(-3.7, 4.1, -9);
scene.add(divider);

// === Spiral Circular Rug ===
const rugCanvas = document.createElement("canvas");
rugCanvas.width = 512;
rugCanvas.height = 512;
const rugCtx = rugCanvas.getContext("2d");

// Fill background
rugCtx.fillStyle = "#d2b48c"; // base rug color (tan)
rugCtx.fillRect(0, 0, rugCanvas.width, rugCanvas.height);

// Draw spiral pattern
rugCtx.strokeStyle = "#8b0000"; // dark red spiral
rugCtx.lineWidth = 4;
rugCtx.beginPath();
let centerX = rugCanvas.width / 2;
let centerY = rugCanvas.height / 2;
let spiralRadius = 10;
let angle = 0;
while (spiralRadius < 250) {
  let x = centerX + spiralRadius * Math.cos(angle);
  let y = centerY + spiralRadius * Math.sin(angle);
  rugCtx.lineTo(x, y);
  angle += 0.2; // controls spiral tightness
  spiralRadius += 0.5;
}
rugCtx.stroke();

// === Study Area ===
// Table
const table = new THREE.Mesh(
  new THREE.BoxGeometry(4, 0.3, 2),
  new THREE.MeshStandardMaterial({ color: 0xdeb887 })
);
table.position.set(6, 2, -8);
scene.add(table);

// Table legs
for (let x = -1.5; x <= 1.5; x += 3) {
  for (let z = -0.8; z <= 0.8; z += 1.6) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x654321 })
    );
    leg.position.set(6 + x, 1, -8 + z);
    scene.add(leg);
  }
}

// === Lamp ===
// Lamp base
const lampBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);
lampBase.position.set(7, 2.2, -8.5);
scene.add(lampBase);

// Lamp stand
const lampStand = new THREE.Mesh(
  new THREE.CylinderGeometry(0.1, 0.1, 2, 16),
  new THREE.MeshStandardMaterial({ color: 0x888888 })
);
lampStand.position.set(7, 3.2, -8.5);
scene.add(lampStand);

// Lamp head (shade)
const lampShade = new THREE.Mesh(
  new THREE.ConeGeometry(0.7, 1, 16),
  new THREE.MeshStandardMaterial({ color: 0xffffaa })
);
lampShade.position.set(7, 4, -8.5);
lampShade.rotation.y = Math.PI; // upside-down cone
scene.add(lampShade);

// Lamp light source (for glow effect)
const lampLight = new THREE.PointLight(0xffee88, 0.8, 5);
lampLight.position.set(7, 3.8, -8.5);
scene.add(lampLight);

// === Laptop ===

// Laptop Base (keyboard part)
const laptopBase = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.1, 1.5), // flat and wide
  new THREE.MeshStandardMaterial({ color: 0x222222 }) // dark gray/black
);
laptopBase.position.set(5, 2.2, -8.4); // sitting on the table
scene.add(laptopBase);

// Laptop Screen
const laptopScreen = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1.3, 0.05), // thin flat screen
  new THREE.MeshStandardMaterial({ color: 0x000000 }) // black screen
);
laptopScreen.position.set(5, 2.9, -9.25); // just above back of base
laptopScreen.rotation.x = -Math.PI / 8; // tilt slightly backwards
scene.add(laptopScreen);

// Laptop Screen Display
const laptopDisplay = new THREE.Mesh(
  new THREE.PlaneGeometry(1.8, 1), // inner display
  new THREE.MeshStandardMaterial({
    color: 0x1e90ff, // bluish glow (like Windows login screen)
    emissive: 0x1e90ff,
    emissiveIntensity: 0.3
  })
);
laptopDisplay.position.set(5, 2.9, -9.22);
laptopDisplay.rotation.x = -Math.PI / 8;
scene.add(laptopDisplay);

// === Office Chair ===

// Seat
const chairSeat = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.3, 2),
  new THREE.MeshStandardMaterial({ color: 0x696969 })
);
chairSeat.position.set(5.5, 1, -6);
scene.add(chairSeat);

// Backrest
const chairBack = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 0.2),
  new THREE.MeshStandardMaterial({ color: 0x696969 })
);
chairBack.position.set(5, 2, -5.5);
scene.add(chairBack);

// Stem (under seat)
const chairStem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.2, 1, 16),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);
chairStem.position.set(5.5, 0.25, -5.5);
scene.add(chairStem);

// Wheel Base (cross shape + wheels)
for (let i = 0; i < 4; i++) {
  const leg = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.1, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  leg.position.set(5.5, 0.2, -5.5);
  leg.rotation.y = (Math.PI / 2) * i;
  scene.add(leg);

  // Wheels
  const wheel = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  const offsetX = Math.cos((Math.PI / 2) * i) * 0.75;
  const offsetZ = Math.sin((Math.PI / 2) * i) * 0.75;
  wheel.position.set(5.5 + offsetX, 0, -5.5 + offsetZ);
  scene.add(wheel);
}

// Draw border circle
rugCtx.strokeStyle = "#000000"; // black border
rugCtx.lineWidth = 12;
rugCtx.beginPath();
rugCtx.arc(centerX, centerY, 250, 0, Math.PI * 2);
rugCtx.stroke();

// Turn canvas into a texture
const spiralTexture = new THREE.CanvasTexture(rugCanvas);

const circularRug = new THREE.Mesh(
  new THREE.CircleGeometry(6, 64), // radius 6, smooth circle
  new THREE.MeshStandardMaterial({ map: spiralTexture, side: THREE.DoubleSide })
);
circularRug.rotation.x = -Math.PI / 2; // flat on floor
circularRug.position.set(0, 0.01, 0); // center of room
scene.add(circularRug);


