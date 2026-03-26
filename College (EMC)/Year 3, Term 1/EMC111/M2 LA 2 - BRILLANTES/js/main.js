// === Scene Setup - Simple for Particle Practice ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Continuous Falling Rain Particles ===
const particleCount = 5000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount);

for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 50;
    positions[i + 1] = Math.random() * 40 + 10;
    positions[i + 2] = (Math.random() - 0.5) * 30;

    velocities[i / 3] = 0.15 + Math.random() * 0.25;
}

const rainGeometry = new THREE.BufferGeometry();
rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const rainMaterial = new THREE.PointsMaterial({
    size: 0.25,
    color: 0x88ccff,
    transparent: true,
    opacity: 0.85,
    depthTest: false
});

const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);

rain.userData.velocities = velocities;

// Color change every 3 seconds (bonus)
let lastColorChange = Date.now();
const rainColors = [0x002bfe, 0x007dfe, 0x004288, 0x00c0ff];

function animate() {
    requestAnimationFrame(animate);

    const posArray = rain.geometry.attributes.position.array;
    const vels = rain.userData.velocities;

    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i + 1] -= vels[i / 3];

        if (posArray[i + 1] < -5) {
            posArray[i + 1] = 45 + Math.random() * 10;
            posArray[i]     = (Math.random() - 0.5) * 50;
            posArray[i + 2] = (Math.random() - 0.5) * 30;
        }
    }

    rain.geometry.attributes.position.needsUpdate = true;

    if (Date.now() - lastColorChange > 3000) {
        const newColor = rainColors[Math.floor(Math.random() * rainColors.length)];
        rainMaterial.color.setHex(newColor);
        lastColorChange = Date.now();
    }

    renderer.render(scene, camera);
}

animate();

// === My Name ===
const canvas = document.createElement('canvas');
canvas.width = 250;
canvas.height = 75;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = 'bold 80px Arial';
ctx.fillStyle = '#00ff56';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('YVES', canvas.width/2, canvas.height/2);

const nameTexture = new THREE.CanvasTexture(canvas);
const nameLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 2),
    new THREE.MeshBasicMaterial({ map: nameTexture, transparent: true })
);
nameLabel.position.set(0, 2, 0.51);
scene.add(nameLabel);
