const { createDesign, listDesignsByUser } = require('../shared/cardsRepository');
const { requireAuthenticatedUser } = require('../shared/googleAuth');
const { json } = require('../shared/http');
const { validateCreatePayload } = require('../shared/cardsValidation');

module.exports = async function (context, req) {
  try {
    const authenticatedUser = await requireAuthenticatedUser(context, req);

    if (!authenticatedUser) {
      return;
    }

    if (req.method === 'GET') {
      const designs = await listDesignsByUser(authenticatedUser.id);
      return json(context, 200, designs);
    }

    if (req.method === 'POST') {
      const validationError = validateCreatePayload(req.body);

      if (validationError) {
        return json(context, 400, { message: validationError });
      }

      const design = await createDesign({
        ...req.body,
        userId: authenticatedUser.id,
        userEmail: authenticatedUser.email,
        userName: authenticatedUser.name,
      });
      return json(context, 201, design);
    }

    return json(context, 405, { message: 'Method not allowed.' });
  } catch (error) {
    context.log.error('cards function failed', error);
    return json(context, 500, { message: error.message || 'Internal server error.' });
  }
};
