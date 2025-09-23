const { SUPPORTED_FORMATS } = require('../config/presets');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toPositiveInteger(value, fallback) {
  const num = Number(value);
  if (Number.isInteger(num) && num > 0) {
    return num;
  }
  return fallback;
}

function validateSizes(sizes = []) {
  if (!Array.isArray(sizes) || sizes.length === 0) {
    throw new Error('At least one size must be provided.');
  }

  return sizes.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Size entry at index ${index} is invalid.`);
    }

    const width = toPositiveInteger(item.width, null);
    const height = toPositiveInteger(item.height, null);
    const label = isNonEmptyString(item.label) ? item.label.trim() : `Custom Size ${index + 1}`;

    if (!width || !height) {
      throw new Error(`Size entry "${label}" must include positive width and height values.`);
    }

    return {
      id: isNonEmptyString(item.id) ? item.id : `custom-${index}`,
      label,
      width,
      height,
    };
  });
}

function validateFormat(format) {
  if (!isNonEmptyString(format)) {
    return SUPPORTED_FORMATS[0];
  }
  const normalized = format.trim().toLowerCase();
  if (!SUPPORTED_FORMATS.includes(normalized)) {
    throw new Error(`Format "${format}" is not supported. Choose one of: ${SUPPORTED_FORMATS.join(', ')}.`);
  }
  return normalized;
}

function validateGenerationRequest(body = {}) {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be a JSON object.');
  }

  if (!isNonEmptyString(body.campaignName)) {
    throw new Error('A campaignName is required.');
  }

  if (!isNonEmptyString(body.primaryText)) {
    throw new Error('A primaryText value is required to describe the creative.');
  }

  const sizes = validateSizes(body.sizes);
  const format = validateFormat(body.format);
  const variationCount = Math.min(Math.max(Number(body.variationCount) || 1, 1), 4);

  return {
    campaignName: body.campaignName.trim(),
    primaryText: body.primaryText.trim(),
    secondaryText: isNonEmptyString(body.secondaryText) ? body.secondaryText.trim() : '',
    callToAction: isNonEmptyString(body.callToAction) ? body.callToAction.trim() : '',
    brandColors: isNonEmptyString(body.brandColors) ? body.brandColors.trim() : '',
    visualStyle: isNonEmptyString(body.visualStyle) ? body.visualStyle.trim() : 'photorealistic outdoor advertising',
    background: isNonEmptyString(body.background) ? body.background.trim() : '',
    format,
    variationCount,
    sizes,
  };
}

module.exports = {
  validateGenerationRequest,
};
