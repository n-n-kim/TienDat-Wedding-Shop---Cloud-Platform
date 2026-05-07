const allowedColorSchemes = new Set(['red-gold', 'pink-gold', 'white-gold', 'burgundy']);
const allowedBackgrounds = new Set(['floral', 'gradient', 'minimal', 'luxury']);
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

  const textFields = [
    'brideName',
    'groomName',
    'brideParents',
    'groomParents',
    'venue',
    'date',
    'time',
  ];

  for (const field of textFields) {
    if (typeof cardData[field] !== 'string') {
      return `cardData.${field} must be a string.`;
    }
  }

  return null;
}

module.exports = {
  validateCreatePayload,
  validateUpdatePayload,
};
