const {
  createConversation,
  listAllConversations,
  listConversationsByUser,
} = require('../shared/chatRepository');
const { validateCreateConversationPayload } = require('../shared/chatValidation');
const { isAdminUser, requireAuthenticatedUser } = require('../shared/googleAuth');
const { json } = require('../shared/http');

module.exports = async function (context, req) {
  try {
    const authenticatedUser = await requireAuthenticatedUser(context, req);

    if (!authenticatedUser) {
      return;
    }

    if (req.method === 'GET') {
      const conversations = isAdminUser(authenticatedUser)
        ? await listAllConversations()
        : await listConversationsByUser(authenticatedUser.id);

      return json(context, 200, conversations);
    }

    if (req.method === 'POST') {
      const validationError = validateCreateConversationPayload(req.body);

      if (validationError) {
        return json(context, 400, { message: validationError });
      }

      const conversation = await createConversation({
        ...req.body,
        userId: authenticatedUser.id,
        userEmail: authenticatedUser.email,
        userName: authenticatedUser.name,
        userAvatar: authenticatedUser.avatar,
      });

      return json(context, 201, conversation);
    }

    return json(context, 405, { message: 'Method not allowed.' });
  } catch (error) {
    context.log.error('chat-conversations function failed', error);
    return json(context, 500, { message: error.message || 'Internal server error.' });
  }
};
