# Sedncae Outdoor Advertising Studio

A full-stack Node.js + React tool for orchestrating outdoor advertising image generation with the Sedncae 4.0 diffusion model. The solution includes:

- **Express backend** that validates creative briefs, manages preset billboard sizes, and forwards generation requests to the Sedncae API (with an SVG mock fallback for local development).
- **Vite + React frontend** for marketers to craft briefs, pick multiple outdoor formats, and preview/download the generated creatives.

> **Security note:** Never commit or hard-code real API keys. Configure your Sedncae credentials via environment variables before running the generator.

## Project structure

```
/                    Root workspace with shared README and .env template
├── server/          Express API for talking to Sedncae 4.0
│   └── src/         Routes, services, utilities, and presets
└── client/          Vite + React interface for creative teams
```

## Getting started

### 1. Clone and install dependencies

```bash
npm install --prefix server
npm install --prefix client
```

### 2. Configure environment variables

Copy the example configuration and fill in your credentials. Keep your real API key secret—do not check it into Git.

```bash
cp .env.example .env
```

Edit `.env` with the following values:

- `SEDNCAE_API_KEY`: your personal Sedncae 4.0 API key.
- `SEDNCAE_API_URL`: optional custom API base URL (defaults to `https://api.sedncae.ai/v1`).
- `ALLOWED_ORIGINS`: comma-separated list of front-end origins (defaults to the Vite dev server).
- `MOCK_SEDNCAE`: set to `true` to use the built-in SVG mock renderer while testing without hitting the real API.
- `VITE_API_BASE_URL`: the URL where the Express server runs (e.g., `http://localhost:4000`).

### 3. Run the backend

```bash
cd server
npm run dev
```

The API exposes:

- `GET /api/health` — health check.
- `GET /api/presets` — available outdoor size presets and supported formats.
- `POST /api/generate` — accepts a creative brief and returns generated assets per size.

### 4. Run the frontend

```bash
cd client
npm run dev
```

The interface launches at [http://localhost:5173](http://localhost:5173). Draft your campaign, choose billboard formats, and click **Generate visuals** to trigger the API.

## Request payload example

```json
{
  "campaignName": "Smart Mobility Q4",
  "primaryText": "Experience the future of urban travel",
  "secondaryText": "Sedncae 4.0 adaptive intelligence",
  "callToAction": "Book your spot",
  "brandColors": "#0f172a, #38bdf8",
  "visualStyle": "High-impact outdoor photography with bold typography",
  "background": "City skyline at dusk",
  "format": "png",
  "variationCount": 2,
  "sizes": [
    { "id": "bulletin-billboard", "label": "Bulletin Billboard", "width": 6720, "height": 2016 },
    { "id": "street-banner", "label": "Street Pole Banner", "width": 900, "height": 2400 }
  ]
}
```

## Testing & linting

- Backend: `npm test --prefix server` performs a syntax check on all JavaScript files.
- Frontend: `npm run build --prefix client` validates that the Vite bundle compiles.

Run both commands before committing to ensure the project is in a healthy state.

## Deployment tips

- For production, set `MOCK_SEDNCAE` to `false` and provide the actual API key through secure environment management.
- Serve the built frontend (`npm run build --prefix client`) behind a CDN or static host, and deploy the Express server (e.g., to Render, Fly.io, or AWS).
- Consider adding caching and logging middleware if you plan to handle high generation volume.

## Extending the studio

- Integrate brand asset uploads to overlay logos.
- Add campaign history persistence with a database (e.g., PostgreSQL).
- Schedule recurring refreshes to keep outdoor creatives updated.

Enjoy crafting multi-format outdoor ads with Sedncae 4.0!
