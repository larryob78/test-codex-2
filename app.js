const cameraVideo = document.getElementById('camera');
const startCameraBtn = document.getElementById('startCamera');
const useRearCameraToggle = document.getElementById('useRearCamera');
const captureFrameBtn = document.getElementById('captureFrame');
const overlayStage = document.getElementById('overlay-stage');
const overlayTemplate = document.getElementById('overlayTemplate');
const clearOverlaysBtn = document.getElementById('clearOverlays');
const gifUrlInput = document.getElementById('gifUrl');
const gifAddBtn = document.getElementById('addGifFromUrl');
const gifFileInput = document.getElementById('gifFile');
const gifSuggestionContainer = document.getElementById('gifSuggestions');
const textContentInput = document.getElementById('textContent');
const textColorInput = document.getElementById('textColor');
const textBackgroundInput = document.getElementById('textBackground');
const textSizeInput = document.getElementById('textSize');
const textSizeValue = document.getElementById('textSizeValue');
const addTextBtn = document.getElementById('addText');
const snapshotCanvas = document.getElementById('snapshotCanvas');
const downloadSnapshotBtn = document.getElementById('downloadSnapshot');

let activeStream = null;
let overlayCount = 0;
let snapshotBlobUrl = null;

const SAMPLE_GIFS = [
  {
    label: 'Nana Banana: Neon Wave',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3ZkYnEwd2RhcjA2ZTk4d3VqZm91YTRhNHdwejZ3ZWp2M2VxdmF6ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/USUI8uZzJ1w7sXp9ZC/giphy.gif'
  },
  {
    label: 'AI Loop: Morphing Sphere',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGVuZWE4NDA0cWtvYWY1a3F2aThvazJ5eXp2bmZ2eXZ5dmNuMXNvNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEjI6SIIHBdRxXI40/giphy.gif'
  },
  {
    label: 'Emoji Burst',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZno4NHl2aGN6dWxmaGRoaGM2YXdvaXI0ZzZ1bDltNm04anRvZ3I2NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26ufdipQqU2lhNA4g/giphy.gif'
  },
  {
    label: 'Dreamy Waves',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWkzZXZxajBsa3gycm9laHgzMDA1a2hoYm9oeGZta2pxZnhiamVsaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6nV3VkZcX2J4l2c0/giphy.gif'
  }
];

function init() {
  renderSuggestions();
  startCameraBtn.addEventListener('click', startCamera);
  gifAddBtn.addEventListener('click', handleAddGifFromUrl);
  gifFileInput.addEventListener('change', handleGifFileUpload);
  addTextBtn.addEventListener('click', handleAddTextOverlay);
  clearOverlaysBtn.addEventListener('click', clearOverlays);
  captureFrameBtn.addEventListener('click', captureStillFrame);
  downloadSnapshotBtn.addEventListener('click', downloadSnapshot);
  textSizeInput.addEventListener('input', () => {
    textSizeValue.textContent = `${textSizeInput.value}px`;
  });

  cameraVideo.addEventListener('loadedmetadata', () => {
    captureFrameBtn.disabled = false;
  });
}

async function startCamera() {
  try {
    if (activeStream) {
      stopStream(activeStream);
    }

    const prefersRear = useRearCameraToggle.checked;
    const constraints = {
      audio: false,
      video: prefersRear
        ? { facingMode: { ideal: 'environment' } }
        : { facingMode: 'user' }
    };

    activeStream = await navigator.mediaDevices.getUserMedia(constraints);
    cameraVideo.srcObject = activeStream;
    startCameraBtn.disabled = true;
    useRearCameraToggle.disabled = true;
    captureFrameBtn.disabled = true;
    startCameraBtn.textContent = 'Camera active';
    startCameraBtn.classList.add('active');
  } catch (error) {
    console.error('Unable to start camera:', error);
    alert('We could not access your camera. Please check permissions and try again.');
  }
}

function stopStream(stream) {
  stream.getTracks().forEach((track) => track.stop());
}

function handleAddGifFromUrl() {
  const url = gifUrlInput.value.trim();
  if (!url) return;
  createGifOverlay(url);
  gifUrlInput.value = '';
}

function handleGifFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      createGifOverlay(reader.result);
    }
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function handleAddTextOverlay() {
  const text = textContentInput.value.trim();
  if (!text) {
    textContentInput.focus();
    return;
  }

  const color = textColorInput.value;
  const background = textBackgroundInput.value;
  const size = parseInt(textSizeInput.value, 10) || 32;

  const textElement = document.createElement('div');
  textElement.className = 'text-overlay';
  textElement.textContent = text;
  textElement.style.color = color;
  textElement.style.background = background;
  textElement.style.fontSize = `${size}px`;
  textElement.style.minWidth = '140px';

  createOverlay(textElement, {
    width: Math.max(200, text.length * (size / 1.5)),
    height: size * 1.8
  });

  textContentInput.value = '';
}

function renderSuggestions() {
  gifSuggestionContainer.innerHTML = '';
  SAMPLE_GIFS.forEach((gif) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = gif.label;
    button.addEventListener('click', () => createGifOverlay(gif.url));

    const img = document.createElement('img');
    img.src = gif.url;
    img.alt = gif.label;
    button.appendChild(img);

    gifSuggestionContainer.appendChild(button);
  });
}

function createGifOverlay(url) {
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'GIF overlay';
  img.loading = 'lazy';
  img.draggable = false;
  createOverlay(img, { width: 220, height: 220 });
}

function createOverlay(contentNode, size = { width: 220, height: 160 }) {
  const overlay = overlayTemplate.content.firstElementChild.cloneNode(true);
  overlay.dataset.width = size.width;
  overlay.dataset.height = size.height;
  overlay.dataset.x = 0;
  overlay.dataset.y = 0;
  overlay.dataset.id = `overlay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const contentContainer = overlay.querySelector('.content');
  contentContainer.appendChild(contentNode);

  overlayStage.appendChild(overlay);
  centerOverlay(overlay);
  wireOverlayInteractions(overlay);
  overlay.focus({ preventScroll: true });
  overlayCount++;
  refreshOverlayControls();
}

function centerOverlay(overlay) {
  const stageRect = overlayStage.getBoundingClientRect();
  const width = parseFloat(overlay.dataset.width);
  const height = parseFloat(overlay.dataset.height);
  const x = (stageRect.width - width) / 2;
  const y = (stageRect.height - height) / 2;
  setOverlayPosition(overlay, x, y);
}

function setOverlayPosition(overlay, x, y) {
  const stageRect = overlayStage.getBoundingClientRect();
  const width = parseFloat(overlay.dataset.width);
  const height = parseFloat(overlay.dataset.height);
  const clampedX = clamp(x, 0, Math.max(0, stageRect.width - width));
  const clampedY = clamp(y, 0, Math.max(0, stageRect.height - height));

  overlay.dataset.x = clampedX;
  overlay.dataset.y = clampedY;
  overlay.style.left = `${clampedX}px`;
  overlay.style.top = `${clampedY}px`;
  overlay.style.width = `${width}px`;
  overlay.style.height = `${height}px`;
  overlay.style.zIndex = `${Date.now()}`;
}

function setOverlaySize(overlay, width, height) {
  const stageRect = overlayStage.getBoundingClientRect();
  const minSize = 80;
  const maxWidth = stageRect.width;
  const maxHeight = stageRect.height;
  const newWidth = clamp(width, minSize, maxWidth);
  const newHeight = clamp(height, minSize, maxHeight);
  overlay.dataset.width = newWidth;
  overlay.dataset.height = newHeight;
  overlay.style.width = `${newWidth}px`;
  overlay.style.height = `${newHeight}px`;
}

function wireOverlayInteractions(overlay) {
  const removeBtn = overlay.querySelector('.remove');
  const resizeBtn = overlay.querySelector('.resize');

  removeBtn.addEventListener('click', () => {
    overlay.remove();
    overlayCount = Math.max(0, overlayCount - 1);
    refreshOverlayControls();
  });

  overlay.addEventListener('pointerdown', (event) => {
    if (event.target === resizeBtn || event.target.closest('.resize')) {
      startResizing(overlay, event);
    } else {
      startDragging(overlay, event);
    }
  });
}

function startDragging(overlay, event) {
  event.preventDefault();
  const pointerId = event.pointerId;
  overlay.setPointerCapture(pointerId);
  const startX = event.clientX;
  const startY = event.clientY;
  const initialX = parseFloat(overlay.dataset.x);
  const initialY = parseFloat(overlay.dataset.y);

  const onMove = (moveEvent) => {
    if (moveEvent.pointerId !== pointerId) return;
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    setOverlayPosition(overlay, initialX + deltaX, initialY + deltaY);
  };

  const onUp = (upEvent) => {
    if (upEvent.pointerId !== pointerId) return;
    overlay.releasePointerCapture(pointerId);
    overlay.removeEventListener('pointermove', onMove);
    overlay.removeEventListener('pointerup', onUp);
    overlay.removeEventListener('pointercancel', onUp);
  };

  overlay.addEventListener('pointermove', onMove);
  overlay.addEventListener('pointerup', onUp);
  overlay.addEventListener('pointercancel', onUp);
}

function startResizing(overlay, event) {
  event.preventDefault();
  const pointerId = event.pointerId;
  overlay.setPointerCapture(pointerId);
  const startX = event.clientX;
  const startY = event.clientY;
  const initialWidth = parseFloat(overlay.dataset.width);
  const initialHeight = parseFloat(overlay.dataset.height);
  const initialX = parseFloat(overlay.dataset.x);
  const initialY = parseFloat(overlay.dataset.y);

  const onMove = (moveEvent) => {
    if (moveEvent.pointerId !== pointerId) return;
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    setOverlaySize(overlay, initialWidth + deltaX, initialHeight + deltaY);
    setOverlayPosition(overlay, initialX, initialY);
  };

  const onUp = (upEvent) => {
    if (upEvent.pointerId !== pointerId) return;
    overlay.releasePointerCapture(pointerId);
    overlay.removeEventListener('pointermove', onMove);
    overlay.removeEventListener('pointerup', onUp);
    overlay.removeEventListener('pointercancel', onUp);
  };

  overlay.addEventListener('pointermove', onMove);
  overlay.addEventListener('pointerup', onUp);
  overlay.addEventListener('pointercancel', onUp);
}

function refreshOverlayControls() {
  clearOverlaysBtn.disabled = overlayStage.childElementCount === 0;
}

function clearOverlays() {
  overlayStage.innerHTML = '';
  overlayCount = 0;
  refreshOverlayControls();
}

async function captureStillFrame() {
  if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) {
    alert('Camera is not ready yet.');
    return;
  }

  snapshotCanvas.width = cameraVideo.videoWidth;
  snapshotCanvas.height = cameraVideo.videoHeight;
  const ctx = snapshotCanvas.getContext('2d');
  ctx.drawImage(cameraVideo, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

  const stageRect = overlayStage.getBoundingClientRect();
  const scaleX = snapshotCanvas.width / stageRect.width;
  const scaleY = snapshotCanvas.height / stageRect.height;

  const overlayPromises = Array.from(overlayStage.children).map((overlay) => {
    const x = parseFloat(overlay.dataset.x) * scaleX;
    const y = parseFloat(overlay.dataset.y) * scaleY;
    const width = parseFloat(overlay.dataset.width) * scaleX;
    const height = parseFloat(overlay.dataset.height) * scaleY;
    const content = overlay.querySelector('.content').firstElementChild;

    if (!content) return Promise.resolve();

    if (content.tagName === 'IMG') {
      return drawImageToCanvas(ctx, content.src, x, y, width, height);
    }

    if (content.classList.contains('text-overlay')) {
      drawTextToCanvas(ctx, content, x, y, width, height);
      return Promise.resolve();
    }

    return Promise.resolve();
  });

  await Promise.all(overlayPromises);

  const dataUrl = snapshotCanvas.toDataURL('image/png');
  showSnapshotCanvas(dataUrl);
  enableSnapshotDownload(dataUrl);
}

function drawImageToCanvas(ctx, src, x, y, width, height) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      ctx.drawImage(image, x, y, width, height);
      resolve();
    };
    image.onerror = reject;
    image.src = src;
  }).catch((error) => {
    console.warn('Could not render GIF overlay to snapshot:', error);
  });
}

function drawTextToCanvas(ctx, textElement, x, y, width, height) {
  const style = getComputedStyle(textElement);
  ctx.save();
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.fillStyle = style.backgroundColor || 'transparent';
  if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    ctx.fillRect(x, y, width, height);
  }
  ctx.fillStyle = style.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(textElement.textContent, x + width / 2, y + height / 2, width * 0.96);
  ctx.restore();
}

function showSnapshotCanvas(dataUrl) {
  snapshotCanvas.style.display = 'block';
  const img = new Image();
  img.src = dataUrl;
  const ctx = snapshotCanvas.getContext('2d');
  img.onload = () => {
    ctx.clearRect(0, 0, snapshotCanvas.width, snapshotCanvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

function enableSnapshotDownload(dataUrl) {
  if (snapshotBlobUrl) {
    URL.revokeObjectURL(snapshotBlobUrl);
    snapshotBlobUrl = null;
  }

  downloadSnapshotBtn.disabled = false;
  fetch(dataUrl)
    .then((response) => response.blob())
    .then((blob) => {
      snapshotBlobUrl = URL.createObjectURL(blob);
      downloadSnapshotBtn.dataset.href = snapshotBlobUrl;
    })
    .catch((error) => console.warn('Unable to prepare download:', error));
}

function downloadSnapshot() {
  const href = downloadSnapshotBtn.dataset.href;
  if (!href) return;
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = `ar-gif-studio-${Date.now()}.png`;
  anchor.click();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

init();
