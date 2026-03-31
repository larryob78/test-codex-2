import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';

const startCameraBtn = document.getElementById('startCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const clearSceneBtn = document.getElementById('clearSceneBtn');
const toggleGridBtn = document.getElementById('toggleGridBtn');
const softnessSlider = document.getElementById('softnessSlider');

const video = document.getElementById('cameraFeed');
const overlayCanvas = document.getElementById('overlayCanvas');
const overlayCtx = overlayCanvas.getContext('2d');
const sceneContainer = document.getElementById('sceneContainer');

let stream;
let selfieSegmentation;
let latestMask = null;
let latestFrame = null;
let running = false;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
sceneContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x040816);
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
camera.position.set(0, 1.25, 4.2);

const hemi = new THREE.HemisphereLight(0x8cc6ff, 0x141029, 0.9);
scene.add(hemi);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 30, 30),
  new THREE.MeshBasicMaterial({ color: 0x071124, wireframe: true, opacity: 0.6, transparent: true })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const splats = [];
let activeSplat = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function resizeRenderer() {
  const { clientWidth, clientHeight } = sceneContainer;
  renderer.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resizeRenderer);
resizeRenderer();

function renderScene() {
  renderer.render(scene, camera);
  requestAnimationFrame(renderScene);
}
renderScene();

async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
  video.srcObject = stream;
  await video.play();

  overlayCanvas.width = video.videoWidth;
  overlayCanvas.height = video.videoHeight;

  selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  selfieSegmentation.setOptions({ modelSelection: 1 });
  selfieSegmentation.onResults(onSegmentationResults);

  running = true;
  runSegmentationLoop();
  captureBtn.disabled = false;
}

async function runSegmentationLoop() {
  if (!running || !selfieSegmentation) return;

  await selfieSegmentation.send({ image: video });
  requestAnimationFrame(runSegmentationLoop);
}

function onSegmentationResults(results) {
  if (!results.segmentationMask) {
    return;
  }

  const w = overlayCanvas.width;
  const h = overlayCanvas.height;
  overlayCtx.clearRect(0, 0, w, h);
  overlayCtx.drawImage(results.segmentationMask, 0, 0, w, h);
  overlayCtx.globalCompositeOperation = 'source-in';
  overlayCtx.drawImage(video, 0, 0, w, h);
  overlayCtx.globalCompositeOperation = 'source-over';

  latestMask = results.segmentationMask;
  latestFrame = document.createElement('canvas');
  latestFrame.width = w;
  latestFrame.height = h;
  latestFrame.getContext('2d').drawImage(video, 0, 0, w, h);
}

function createSplatTexture() {
  if (!latestMask || !latestFrame) return null;

  const w = latestFrame.width;
  const h = latestFrame.height;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(latestMask, 0, 0, w, h);
  ctx.filter = `blur(${softnessSlider.value}px)`;
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(latestFrame, 0, 0, w, h);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return { tex, ratio: w / h };
}

function placeSplat(x = 0, z = 0) {
  const data = createSplatTexture();
  if (!data) return;

  const material = new THREE.SpriteMaterial({ map: data.tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  const height = 1.75;
  sprite.scale.set(height * data.ratio, height, 1);
  sprite.position.set(x, height / 2, z);
  scene.add(sprite);
  splats.push(sprite);
  activeSplat = sprite;
}

function toNdc(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function pickSplat(event) {
  toNdc(event);
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(splats);
  return intersections[0]?.object ?? null;
}

function placeOnGround(event) {
  toNdc(event);
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObject(ground);
  if (!intersections.length) return;
  const point = intersections[0].point;
  placeSplat(point.x, point.z);
}

let dragPointerId = null;
let pinchDistance = null;
let pinchStartScale = null;

renderer.domElement.addEventListener('pointerdown', (event) => {
  renderer.domElement.setPointerCapture(event.pointerId);
  const picked = pickSplat(event);
  if (picked) {
    activeSplat = picked;
    dragPointerId = event.pointerId;
    return;
  }
  placeOnGround(event);
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!activeSplat || dragPointerId !== event.pointerId) return;

  toNdc(event);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(ground)[0];
  if (hit) {
    activeSplat.position.x = hit.point.x;
    activeSplat.position.z = hit.point.z;
  }
});

renderer.domElement.addEventListener('pointerup', (event) => {
  if (dragPointerId === event.pointerId) {
    dragPointerId = null;
  }
});

renderer.domElement.addEventListener('touchmove', (event) => {
  if (!activeSplat) return;
  if (event.touches.length === 2) {
    const [a, b] = event.touches;
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (!pinchDistance) {
      pinchDistance = dist;
      pinchStartScale = activeSplat.scale.clone();
      return;
    }

    const ratio = dist / pinchDistance;
    activeSplat.scale.copy(pinchStartScale.clone().multiplyScalar(ratio));

    const angle = Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX);
    activeSplat.material.rotation = angle;
  }
}, { passive: true });

renderer.domElement.addEventListener('touchend', () => {
  pinchDistance = null;
  pinchStartScale = null;
});

startCameraBtn.addEventListener('click', async () => {
  try {
    startCameraBtn.disabled = true;
    await startCamera();
    startCameraBtn.textContent = 'Camera running';
  } catch (error) {
    console.error(error);
    startCameraBtn.disabled = false;
    alert('Camera permissions are required.');
  }
});

captureBtn.addEventListener('click', () => {
  placeSplat(0, 0);
});

clearSceneBtn.addEventListener('click', () => {
  splats.forEach((s) => {
    scene.remove(s);
    s.material.map?.dispose();
    s.material.dispose();
  });
  splats.length = 0;
  activeSplat = null;
});

toggleGridBtn.addEventListener('click', () => {
  ground.visible = !ground.visible;
});
