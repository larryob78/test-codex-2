const DEFAULT_BASE_URL = process.env.SEDNCAE_API_URL || 'https://api.sedncae.ai/v1';

class SedncaeClient {
  constructor({ apiKey, baseUrl = DEFAULT_BASE_URL, mockMode = false } = {}) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.mockMode = mockMode || !apiKey;
  }

  async generateImage({
    prompt,
    width,
    height,
    format = 'png',
    label = 'Outdoor Creative',
    variation = 1,
    callToAction = '',
  }) {
    if (this.mockMode) {
      return this.createMockImage({ width, height, format, label, prompt, callToAction, variation });
    }

    const payload = {
      model: 'sedncae-4.0-image',
      prompt,
      width,
      height,
      format,
      variation,
      call_to_action: callToAction,
      negative_prompt: 'no watermarks, no distorted text, no low-resolution artifacts',
    };

    const response = await this.request('/images/generations', payload);
    const base64Image = this.extractBase64(response);
    const dataUri = base64Image.startsWith('data:')
      ? base64Image
      : `data:image/${format};base64,${base64Image}`;

    return {
      dataUri,
      raw: response,
    };
  }

  async request(endpoint, body) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Sedncae API error (${response.status}): ${detail}`);
    }

    return response.json();
  }

  extractBase64(response) {
    if (!response || typeof response !== 'object') {
      throw new Error('Unexpected Sedncae API response.');
    }

    const candidates = [
      response.image_base64,
      response.image,
      response.base64,
      response?.result?.image_base64,
      response?.result?.image,
      response?.data?.[0]?.b64_json,
      response?.data?.[0]?.base64,
      Array.isArray(response.images) ? response.images[0]?.base64 : undefined,
    ].filter(Boolean);

    if (candidates.length === 0) {
      throw new Error('Sedncae API response did not include image data.');
    }

    return candidates[0];
  }

  createMockImage({ width, height, format, label, prompt, callToAction, variation }) {
    const safePrompt = (prompt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeLabel = (label || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeCTA = (callToAction || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  <defs>\n    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="#1b5f8c" />\n      <stop offset="100%" stop-color="#73c8a9" />\n    </linearGradient>\n  </defs>\n  <rect width="100%" height="100%" fill="url(#gradient)" />\n  <g fill="#ffffff" font-family="Arial, Helvetica, sans-serif">\n    <text x="50%" y="15%" font-size="${Math.max(32, width * 0.04)}" text-anchor="middle" font-weight="bold">${safeLabel}</text>\n    <foreignObject x="10%" y="25%" width="80%" height="50%">\n      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:${Math.max(18, width * 0.02)}px;line-height:1.3;color:#ffffff;text-align:center;white-space:pre-wrap;">\n        ${safePrompt}\n      </div>\n    </foreignObject>\n    <text x="50%" y="90%" font-size="${Math.max(20, width * 0.025)}" text-anchor="middle" font-weight="bold">${safeCTA}</text>\n    <text x="5%" y="95%" font-size="${Math.max(14, width * 0.015)}" text-anchor="start">Mock variation ${variation}</text>\n  </g>\n</svg>`;
    const base64 = Buffer.from(svg).toString('base64');
    return {
      dataUri: `data:image/svg+xml;base64,${base64}`,
      raw: { mock: true },
    };
  }
}

function buildPrompt({ campaignName, primaryText, secondaryText, brandColors, visualStyle, background }) {
  const segments = [
    `${visualStyle}`,
    `Outdoor advertising for ${campaignName}`,
    `Headline: ${primaryText}`,
  ];

  if (secondaryText) {
    segments.push(`Support copy: ${secondaryText}`);
  }
  if (brandColors) {
    segments.push(`Brand colors: ${brandColors}`);
  }
  if (background) {
    segments.push(`Background: ${background}`);
  }

  segments.push('High contrast typography, legible from long distance, professional layout');

  return segments.join('. ');
}

module.exports = {
  SedncaeClient,
  buildPrompt,
};
