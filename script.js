const video = document.getElementById("video");
const particleCanvas = document.getElementById("particleCanvas");
const particleCtx = particleCanvas.getContext("2d");
const motionCanvas = document.createElement("canvas");
const motionCtx = motionCanvas.getContext("2d");
const startButton = document.getElementById("startButton");
const notice = document.querySelector(".notice");

const particles = [];
const MAX_PARTICLES = 600;
const MOTION_SAMPLE_STEP = 4; // pixels between samples
const MOTION_THRESHOLD = 40; // sensitivity for motion detection

let previousFrame = null;
let animationFrameId = null;
let activeStream = null;
let hasLoopStarted = false;

async function setupCamera() {
  if (!startButton) {
    return;
  }

  if (activeStream) {
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setNotice(
      "Webcam access is not supported in this browser. Please try a modern browser such as Chrome or Firefox.",
      true
    );
    startButton.disabled = true;
    return;
  }

  try {
    startButton.disabled = true;
    startButton.textContent = "Requesting access...";
    setNotice("Please allow camera access in the browser prompt to start the effect.");

    activeStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    video.srcObject = activeStream;
    await video.play();
    handleResize();
    if (!hasLoopStarted) {
      startLoop();
      hasLoopStarted = true;
    }
    startButton.textContent = "Camera running";
    setTimeout(() => {
      startButton.style.display = "none";
    }, 800);
    setNotice("Move in front of the camera to paint with particles.");
  } catch (error) {
    console.error("Unable to access camera", error);
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      activeStream = null;
    }
    setNotice(
      "Camera access was blocked. Please allow webcam permissions and try again.",
      true
    );
    startButton.disabled = false;
    startButton.textContent = "Try again";
  }
}

function setNotice(message, isError = false) {
  if (!notice) {
    return;
  }

  notice.textContent = message;
  notice.classList.toggle("error", Boolean(isError));
}

function handleResize() {
  const width = video.videoWidth || video.clientWidth;
  const height = video.videoHeight || video.clientHeight;
  if (!width || !height) {
    return;
  }

  particleCanvas.width = width;
  particleCanvas.height = height;
  motionCanvas.width = width;
  motionCanvas.height = height;
}

function startLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  const render = () => {
    if (video.readyState >= 2) {
      detectMotion();
      updateParticles();
      drawParticles();
    }
    animationFrameId = requestAnimationFrame(render);
  };

  render();
}

function detectMotion() {
  const { width, height } = motionCanvas;
  motionCtx.drawImage(video, 0, 0, width, height);
  const currentFrame = motionCtx.getImageData(0, 0, width, height);

  if (previousFrame) {
    const { data } = currentFrame;
    const prevData = previousFrame.data;
    const motionSpots = [];

    for (let y = 0; y < height; y += MOTION_SAMPLE_STEP) {
      for (let x = 0; x < width; x += MOTION_SAMPLE_STEP) {
        const index = (y * width + x) * 4;
        const diff =
          Math.abs(data[index] - prevData[index]) +
          Math.abs(data[index + 1] - prevData[index + 1]) +
          Math.abs(data[index + 2] - prevData[index + 2]);

        if (diff > MOTION_THRESHOLD * 3) {
          motionSpots.push({ x, y, diff });
        }
      }
    }

    spawnParticles(motionSpots);
  }

  previousFrame = currentFrame;
}

function spawnParticles(motionSpots) {
  const strengthScale = Math.min(1, motionSpots.length / 200);

  motionSpots.forEach(({ x, y, diff }) => {
    const normalizedStrength = Math.min(1, diff / (255 * 3));
    const count = 1 + Math.floor(normalizedStrength * 3 * (1 + strengthScale));

    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + normalizedStrength * 2;

      particles.push({
        x: x + (Math.random() - 0.5) * MOTION_SAMPLE_STEP,
        y: y + (Math.random() - 0.5) * MOTION_SAMPLE_STEP,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1,
        decay: 0.01 + Math.random() * 0.02,
        hue: (200 + normalizedStrength * 100 + Math.random() * 40) % 360,
      });
    }
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03; // gravity-like effect
    p.life -= p.decay;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particleCtx.globalCompositeOperation = "lighter";

  particles.forEach((p) => {
    const alpha = Math.max(0, p.life);
    const radius = 2 + (1 - alpha) * 3;

    particleCtx.beginPath();
    particleCtx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${alpha})`;
    particleCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    particleCtx.fill();
  });

  particleCtx.globalCompositeOperation = "source-over";
}

window.addEventListener("resize", handleResize);
video.addEventListener("loadedmetadata", handleResize);

if (startButton) {
  startButton.addEventListener("click", () => {
    setupCamera();
  });
}

window.addEventListener("beforeunload", () => {
  if (activeStream) {
    activeStream.getTracks().forEach((track) => track.stop());
  }
});
