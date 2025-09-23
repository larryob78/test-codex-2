const express = require('express');
const { SIZE_PRESETS, SUPPORTED_FORMATS } = require('../config/presets');
const { validateGenerationRequest } = require('../utils/validators');
const { SedncaeClient, buildPrompt } = require('../services/sedncaeClient');

const router = express.Router();

const sedncaeClient = new SedncaeClient({
  apiKey: process.env.SEDNCAE_API_KEY,
  baseUrl: process.env.SEDNCAE_API_URL,
  mockMode: process.env.MOCK_SEDNCAE === 'true',
});

router.get('/presets', (req, res) => {
  res.json({
    sizes: SIZE_PRESETS,
    formats: SUPPORTED_FORMATS,
  });
});

router.post('/generate', async (req, res, next) => {
  try {
    const payload = validateGenerationRequest(req.body);
    const prompt = buildPrompt(payload);

    const sizeResults = await Promise.all(
      payload.sizes.map(async (size) => {
        const variants = await Promise.all(
          Array.from({ length: payload.variationCount }, (_, index) =>
            sedncaeClient.generateImage({
              prompt,
              width: size.width,
              height: size.height,
              format: payload.format,
              label: size.label,
              variation: index + 1,
              callToAction: payload.callToAction,
            })
          )
        );

        return {
          ...size,
          images: variants.map((result, index) => ({
            variation: index + 1,
            dataUri: result.dataUri,
          })),
        };
      })
    );

    res.json({
      campaignName: payload.campaignName,
      format: payload.format,
      prompt,
      variationCount: payload.variationCount,
      results: sizeResults,
      mock: sedncaeClient.mockMode,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
