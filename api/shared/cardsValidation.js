const allowedColorSchemes = new Set([
  'red-gold',
  'pink-gold',
  'white-gold',
  'burgundy',
  'sage-cream',
  'navy-champagne',
  'lavender-silver',
  'terracotta-pearl',
]);
const allowedBackgrounds = new Set([
  'floral',
  'gradient',
  'minimal',
  'luxury',
  'botanical',
  'watercolor',
  'arch',
  'starlight',
]);
const allowedStylePresets = new Set([
  'classic',
  'garden',
  'modern',
  'royal',
  'editorial',
  'minimalist',
]);
const allowedCardFormats = new Set(['portrait']);
const allowedContentLanguages = new Set(['vi', 'en', 'bilingual']);
const allowedEventTypes = new Set(['wedding', 'engagement', 'reception', 'save-the-date']);
const allowedEmbellishments = new Set([
  'wax-seal',
  'ribbon',
  'venue-map',
  'monogram',
  'photo-panel',
  'qr-rsvp',
]);
const allowedStatuses = new Set(['draft', 'submitted']);

function validateCreatePayload(payload) {
  return validateBasePayload(payload);
}

function validateUpdatePayload(payload) {
  return validateBasePayload(payload);
}

function validateBasePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Request body must be a JSON object.';
  }

  if (!payload.title || typeof payload.title !== 'string') {
    return 'title is required.';
  }

  if (payload.title.length > 100) {
    return 'title must be 100 characters or fewer.';
  }

  if (!allowedStatuses.has(payload.status)) {
    return 'status must be draft or submitted.';
  }

  return validateCardData(payload.cardData);
}

function validateCardData(cardData) {
  if (!cardData || typeof cardData !== 'object') {
    return 'cardData is required.';
  }

  if (!allowedColorSchemes.has(cardData.colorScheme)) {
    return 'cardData.colorScheme is invalid.';
  }

  if (!allowedBackgrounds.has(cardData.background)) {
    return 'cardData.background is invalid.';
  }

  if (!allowedStylePresets.has(cardData.stylePreset)) {
    return 'cardData.stylePreset is invalid.';
  }

  if (!allowedCardFormats.has(cardData.cardFormat)) {
    return 'cardData.cardFormat is invalid.';
  }

  if (!allowedContentLanguages.has(cardData.contentLanguage)) {
    return 'cardData.contentLanguage is invalid.';
  }

  if (!allowedEventTypes.has(cardData.eventType)) {
    return 'cardData.eventType is invalid.';
  }

  const textFields = [
    'brideName',
    'groomName',
    'brideParents',
    'groomParents',
    'venue',
    'date',
    'time',
    'dressCode',
    'rsvpContact',
  ];

  for (const field of textFields) {
    if (typeof cardData[field] !== 'string') {
      return `cardData.${field} must be a string.`;
    }
  }

  if (!Array.isArray(cardData.embellishments)) {
    return 'cardData.embellishments must be an array.';
  }

  for (const item of cardData.embellishments) {
    if (!allowedEmbellishments.has(item)) {
      return 'cardData.embellishments contains an invalid value.';
    }
  }

  return null;
}

module.exports = {
  validateCreatePayload,
  validateUpdatePayload,
};
