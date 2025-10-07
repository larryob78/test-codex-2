const channels = [
  {
    name: "Instagram Feed",
    size: "1080 × 1080",
    dimensions: [1080, 1080],
    vibe: "visual punch",
  },
  {
    name: "Instagram Story",
    size: "1080 × 1920",
    dimensions: [1080, 1920],
    vibe: "vertical storytelling",
  },
  {
    name: "LinkedIn",
    size: "1200 × 1350",
    dimensions: [1200, 1350],
    vibe: "professional spotlight",
  },
  {
    name: "X (Twitter)",
    size: "1600 × 900",
    dimensions: [1600, 900],
    vibe: "headline-driven",
  },
  {
    name: "Facebook",
    size: "1200 × 1200",
    dimensions: [1200, 1200],
    vibe: "community conversation",
  },
  {
    name: "Pinterest",
    size: "1000 × 1500",
    dimensions: [1000, 1500],
    vibe: "scroll-stopping inspiration",
  },
];

const toneProfiles = {
  bold: {
    headlineVerbs: ["Unleash", "Ignite", "Command", "Dominate"],
    bodyOpeners: ["Lead the charge", "Claim your spotlight", "Make this season yours"],
    textureWords: ["electric", "high-impact", "fearless"],
  },
  friendly: {
    headlineVerbs: ["Say hello to", "Meet", "Feel", "Share"],
    bodyOpeners: ["We made this", "Here's something special", "Made to brighten your day"],
    textureWords: ["cozy", "uplifting", "thoughtful"],
  },
  refined: {
    headlineVerbs: ["Introducing", "Elevate", "Reimagine", "Experience"],
    bodyOpeners: ["Crafted for the discerning", "Designed with intention", "Precision meets comfort"],
    textureWords: ["tailored", "luminous", "meticulously tuned"],
  },
};

const form = document.getElementById("brief-form");
const output = document.getElementById("output");
const template = document.getElementById("post-template");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const brief = {
    brand: data.get("brand").trim(),
    idea: data.get("idea").trim(),
    tone: data.get("tone"),
    cta: data.get("cta").trim(),
  };

  if (!brief.brand || !brief.idea) {
    return;
  }

  const posts = buildCampaign(brief);
  render(posts);
});

function buildCampaign(brief) {
  const keywords = deriveKeywords(brief.idea, brief.brand);
  const palette = derivePalette(brief.brand);

  return channels.map((channel) => {
    const copy = craftCopy(channel, brief, keywords);
    const image = createImage(channel, brief, palette, keywords.primaryPhrase);
    return { ...channel, copy, image };
  });
}

function deriveKeywords(idea, brand) {
  const sanitized = idea
    .replace(/[^a-z0-9\s]/gi, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "your",
    "from",
    "this",
    "that",
    "into",
    "about",
    "into",
    "make",
    "made",
    "our",
    "new",
  ]);

  const keywords = Array.from(
    new Set(sanitized.filter((word) => word.length > 3 && !stopWords.has(word)))
  ).slice(0, 6);

  const primaryPhrase = keywords.slice(0, 3).join(" ") || idea;
  const hashtags = keywords.slice(0, 4).map((word) => `#${word.replace(/[^a-z0-9]/gi, "")}`);

  const brandTag = `#${brand
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")}`;

  if (!hashtags.includes(brandTag) && brandTag.length > 1) {
    hashtags.push(brandTag);
  }

  return { keywords, hashtags, primaryPhrase };
}

function craftCopy(channel, brief, keywords) {
  const tone = toneProfiles[brief.tone];
  const verb = pick(tone.headlineVerbs);
  const texture = pick(tone.textureWords);
  const opener = pick(tone.bodyOpeners);

  const headline = `${verb} ${brief.brand}'s ${titleCase(keywords.primaryPhrase || "next chapter")}`;

  const body = `${opener}. ${channel.vibe
    .charAt(0)
    .toUpperCase()}${channel.vibe.slice(1)} meets ${texture} storytelling for ${brief.brand}. ${brief.idea}`;

  const cta = brief.cta || pick(["Discover more", "Tap to explore", "See the drop"]);

  return {
    headline,
    body,
    cta,
    hashtags: keywords.hashtags.join(" "),
  };
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function titleCase(str) {
  return str
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function derivePalette(brand) {
  const seed = brand
    .toLowerCase()
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const primaryHue = seed % 360;
  const secondaryHue = (primaryHue + 40) % 360;
  const accentHue = (primaryHue + 300) % 360;

  return {
    primary: `hsl(${primaryHue}, 70%, 52%)`,
    secondary: `hsl(${secondaryHue}, 65%, 60%)`,
    accent: `hsl(${accentHue}, 75%, 55%)`,
  };
}

function createImage(channel, brief, palette, phrase) {
  const [width, height] = channel.dimensions;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const scale = Math.min(1, 600 / Math.max(width, height));
  canvas.width = width * scale;
  canvas.height = height * scale;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, palette.primary);
  gradient.addColorStop(0.45, palette.secondary);
  gradient.addColorStop(1, palette.accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  const stripeCount = 6;
  for (let i = 0; i < stripeCount; i += 1) {
    const progress = i / stripeCount;
    const radius = canvas.width * 0.8 * (1 - progress * 0.12);
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75, canvas.height * 0.35, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

  ctx.fillStyle = "white";
  ctx.font = `bold ${Math.max(24, canvas.width * 0.08)}px 'Outfit', sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  wrapText(ctx, brief.brand, canvas.width * 0.08, canvas.height * 0.08, canvas.width * 0.84, canvas.height * 0.12);

  ctx.font = `600 ${Math.max(18, canvas.width * 0.045)}px 'Outfit', sans-serif`;
  wrapText(
    ctx,
    titleCase(phrase || brief.idea.substring(0, 60)),
    canvas.width * 0.08,
    canvas.height * 0.24,
    canvas.width * 0.8,
    canvas.height * 0.4
  );

  ctx.font = `500 ${Math.max(16, canvas.width * 0.04)}px 'Outfit', sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  wrapText(ctx, brief.cta || "Tap to explore", canvas.width * 0.08, canvas.height * 0.72, canvas.width * 0.72, canvas.height * 0.2);

  return canvas.toDataURL("image/png");
}

function wrapText(ctx, text, x, y, maxWidth, maxHeight) {
  const words = text.split(/\s+/);
  let line = "";
  let lineHeight = parseInt(ctx.font.match(/(\d+)px/)[1], 10) * 1.2;
  let currentY = y;

  for (const word of words) {
    const testLine = `${line}${word} `;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = `${word} `;
      currentY += lineHeight;
      if (currentY > y + maxHeight - lineHeight) {
        return;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

function render(posts) {
  output.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "posts-grid";

  posts.forEach((post) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".post__channel").textContent = post.name;
    node.querySelector(".post__size").textContent = post.size;
    node.querySelector(".post__image").src = post.image;
    node.querySelector(".post__copy").innerHTML = createCopyHTML(post.copy);
    grid.appendChild(node);
  });

  output.appendChild(grid);
}

function createCopyHTML(copy) {
  return `
    <div class="copy-block">
      <h4>Headline</h4>
      <p>${copy.headline}</p>
    </div>
    <div class="copy-block">
      <h4>Caption</h4>
      <p>${copy.body}</p>
      <p class="hashtags">${copy.hashtags}</p>
    </div>
    <div class="copy-block">
      <h4>Call to action</h4>
      <p>${copy.cta}</p>
    </div>
  `;
}
