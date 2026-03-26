// M2 LA 1 - BRILLANTES
// Uses PlaneGeometry, starts at (0,0,0), 800x800 scene, color change + shrink on bounce

const WIDTH = 800;
const HEIGHT = 800;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-WIDTH/2, WIDTH/2, HEIGHT/2, -HEIGHT/2, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

// Main variables
let dvdMesh = null;
let velocity = new THREE.Vector2(3.8, 2.9);   // bouncing speed and angle
let currentScale = 1.0;
let bounceCount = 0;
const MAX_BOUNCES = 7;

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

const textureLoader = new THREE.TextureLoader();

// DVD Logo
textureLoader.load(
  'textures/dvd_logo.png',
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.PlaneGeometry(240, 120);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });

    dvdMesh = new THREE.Mesh(geometry, material);
    dvdMesh.position.set(0, 0, 0);
    scene.add(dvdMesh);

    console.log('✅ DVD Logo loaded successfully!');
  },
  undefined,
  (error) => {
    console.error('Failed to load dvd_logo.png', error);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (!dvdMesh) return;

  // Move the logo
  dvdMesh.position.x += velocity.x;
  dvdMesh.position.y += velocity.y;

  const halfW = 120 * currentScale;
  const halfH = 60 * currentScale;

  let bounced = false;

  // Bounce on walls
  if (dvdMesh.position.x + halfW > WIDTH/2 || dvdMesh.position.x - halfW < -WIDTH/2) {
    velocity.x = -velocity.x;
    bounced = true;
  }
  if (dvdMesh.position.y + halfH > HEIGHT/2 || dvdMesh.position.y - halfH < -HEIGHT/2) {
    velocity.y = -velocity.y;
    bounced = true;
  }

  if (bounced) {
    bounceCount++;

    // Change color on every bounce
    const newColor = colors[bounceCount % colors.length];
    dvdMesh.material.color.setHex(newColor);
    dvdMesh.material.needsUpdate = true;

    // Shrink a little on every bounce
    currentScale *= 0.86;
    dvdMesh.scale.set(currentScale, currentScale, 1);

    // Disappear after 5-8 bounces
    if (bounceCount >= MAX_BOUNCES) {
      dvdMesh.visible = false;
      console.log(`🎉 DVD logo disappeared after ${bounceCount} bounces!`);
    }
  }

  renderer.render(scene, camera);
}

animate();