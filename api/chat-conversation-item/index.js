const {
  getConversation,
  updateConversationStatus,
} = require('../shared/chatRepository');
const { validateConversationUpdatePayload } = require('../shared/chatValidation');
const { isAdminUser, requireAuthenticatedUser } = require('../shared/googleAuth');
const { json } = require('../shared/http');

module.exports = async function (context, req) {
  const conversationId = context.bindingData.id;

  try {
    const authenticatedUser = await requireAuthenticatedUser(context, req);

    if (!authenticatedUser) {
      return;
    }

    const isAdmin = isAdminUser(authenticatedUser);
    const conversation = await getConversation(conversationId);

    if (!conversation) {
      return json(context, 404, { message: 'Conversation not found.' });
    }

    if (!isAdmin && conversation.userId !== authenticatedUser.id) {
      return json(context, 403, { message: 'You do not have access to this conversation.' });
    }

    if (req.method === 'GET') {
      return json(context, 200, conversation);
    }

    if (req.method === 'PUT') {
      if (!isAdmin) {
        return json(context, 403, { message: 'Admin access is required.' });
      }

      const validationError = validateConversationUpdatePayload(req.body);

      if (validationError) {
        return json(context, 400, { message: validationError });
      }

      const updatedConversation = await updateConversationStatus(conversationId, req.body.status);

      return json(context, 200, updatedConversation);
    }

    return json(context, 405, { message: 'Method not allowed.' });
  } catch (error) {
    context.log.error('chat-conversation-item function failed', error);
    return json(context, 500, { message: error.message || 'Internal server error.' });
  }
};
