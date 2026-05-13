const {
  addMessage,
  clearUnreadCount,
  getConversation,
  listMessages,
} = require('../shared/chatRepository');
const { validateSendMessagePayload } = require('../shared/chatValidation');
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
      const messages = await listMessages(conversationId);
      await clearUnreadCount(conversationId, isAdmin ? 'admin' : 'user');

      return json(context, 200, messages);
    }

    if (req.method === 'POST') {
      const validationError = validateSendMessagePayload(req.body);

      if (validationError) {
        return json(context, 400, { message: validationError });
      }

      const result = await addMessage(conversationId, {
        senderId: authenticatedUser.id,
        senderName: authenticatedUser.name,
        senderRole: isAdmin ? 'admin' : 'user',
        content: req.body.content.trim(),
      });

      return json(context, 201, result.message);
    }

    return json(context, 405, { message: 'Method not allowed.' });
  } catch (error) {
    context.log.error('chat-messages function failed', error);
    return json(context, 500, { message: error.message || 'Internal server error.' });
  }
};
