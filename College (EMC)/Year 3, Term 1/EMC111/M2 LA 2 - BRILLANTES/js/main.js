import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let stars, starGeo;
let textMesh;

let particleColors = [0x002bfe, 0x007dfe, 0x004288, 0x00c0ff];
let currentColor = 0;

lighting();
createText();
createParticles();

camera.position.z = 30;

// ----------------------------
// PARTICLES
// ----------------------------

function createParticles() {

  const points = [];

  for (let i = 0; i < 6000; i++) {
    points.push(
      new THREE.Vector3(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 600 - 300
      )
    );
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  const texture = new THREE.TextureLoader().load("assets/images/star.png");

  const material = new THREE.PointsMaterial({
    color: particleColors[0],
    size: 0.7,
    map: texture,
    transparent: true
  });

  stars = new THREE.Points(starGeo, material);
  scene.add(stars);
}

function animateParticles() {

  const positions = starGeo.attributes.position.array;

  for (let i = 1; i < positions.length; i += 3) {

    positions[i] -= 0.9;

    if (positions[i] < -300) {
      positions[i] = 300;
    }

  }

  starGeo.attributes.position.needsUpdate = true;
}

// ----------------------------
// TEXT
// ----------------------------

function createText() {

  const loader = new FontLoader();

  loader.load("assets/fonts/helvetiker_regular.typeface.json", function (font) {

    const geometry = new TextGeometry("YVES", {
      font: font,
      size: 4,
      height: 1
    });

    geometry.center();

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff56 });

    textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.z = -5;
    textMesh.scale.set(2.5, 2.5, 0.01);

    scene.add(textMesh);

  });
}

// ----------------------------
// LIGHTING
// ----------------------------

function lighting() {

  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  scene.add(spotLight);
}

// ----------------------------
// ANIMATION
// ----------------------------

function animate() {

  requestAnimationFrame(animate);

  animateParticles();

  if (textMesh) {
    textMesh.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

animate();

// ----------------------------
// COLOR CHANGE
// ----------------------------

setInterval(() => {

  currentColor++;

  if (currentColor >= particleColors.length) {
    currentColor = 0;
  }

  if (stars) {
    stars.material.color.setHex(particleColors[currentColor]);
  }

}, 3000);