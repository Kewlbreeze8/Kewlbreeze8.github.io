const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const materials = [
    new THREE.MeshStandardMaterial({ color: 0xff0000 }),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
    new THREE.MeshStandardMaterial({ color: 0x0000ff }),
    new THREE.MeshStandardMaterial({ color: 0xffff00 }),
    new THREE.MeshStandardMaterial({ color: 0xff00ff })
];

const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.ConeGeometry(0.8, 2, 32),
    new THREE.CylinderGeometry(0.7, 0.7, 2, 32),
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.TorusGeometry(1, 0.4, 16, 100)
];

const meshes = geometries.map((geo, i) => {
    const mesh = new THREE.Mesh(geo, materials[i]);
    mesh.position.x = (i - 2) * 3;
    scene.add(mesh);
    return mesh;
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

function animate() {
    requestAnimationFrame(animate);

    meshes.forEach((mesh, i) => {
        mesh.rotation.x += 0.01 + i * 0.005;
        mesh.rotation.y += 0.01 + i * 0.003;
    });

    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
