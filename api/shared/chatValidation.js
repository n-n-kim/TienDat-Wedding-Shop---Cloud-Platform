function validateCreateConversationPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Request body is required.';
  }

  const initialMessage = normalizeString(payload.initialMessage);
  const contactPhone = normalizeString(payload.contactPhone);

  if (!contactPhone) {
    return 'contactPhone is required.';
  }

  if (!initialMessage) {
    return 'initialMessage is required.';
  }

  if (contactPhone.length > 32) {
    return 'contactPhone must be 32 characters or fewer.';
  }

  if (initialMessage.length > 2000) {
    return 'initialMessage must be 2000 characters or fewer.';
  }

  return null;
}

function validateSendMessagePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Request body is required.';
  }

  const content = normalizeString(payload.content);

  if (!content) {
    return 'content is required.';
  }

  if (content.length > 2000) {
    return 'content must be 2000 characters or fewer.';
  }

  return null;
}

function validateConversationUpdatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Request body is required.';
  }

  if (!['open', 'closed'].includes(payload.status)) {
    return 'status must be either open or closed.';
  }

  return null;
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

module.exports = {
  validateConversationUpdatePayload,
  validateCreateConversationPayload,
  validateSendMessagePayload,
};
