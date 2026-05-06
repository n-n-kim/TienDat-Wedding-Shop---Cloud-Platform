const {
  deleteDesign,
  getDesign,
  updateDesign,
} = require('../shared/cardsRepository');
const { json } = require('../shared/http');
const { validateUpdatePayload } = require('../shared/cardsValidation');

module.exports = async function (context, req) {
  const designId = context.bindingData.id;

  try {
    if (req.method === 'GET') {
      const userId = req.query.userId;

      if (!userId) {
        return json(context, 400, { message: 'userId is required.' });
      }

      const design = await getDesign(userId, designId);

      if (!design) {
        return json(context, 404, { message: 'Design not found.' });
      }

      return json(context, 200, design);
    }

    if (req.method === 'PUT') {
      const validationError = validateUpdatePayload(req.body);

      if (validationError) {
        return json(context, 400, { message: validationError });
      }

      const design = await updateDesign(req.body.userId, designId, req.body);

      if (!design) {
        return json(context, 404, { message: 'Design not found.' });
      }

      return json(context, 200, design);
    }

    if (req.method === 'DELETE') {
      const userId = req.query.userId;

      if (!userId) {
        return json(context, 400, { message: 'userId is required.' });
      }

      const deleted = await deleteDesign(userId, designId);

      if (!deleted) {
        return json(context, 404, { message: 'Design not found.' });
      }

      return json(context, 200, { message: 'Design deleted successfully.' });
    }

    return json(context, 405, { message: 'Method not allowed.' });
  } catch (error) {
    context.log.error('cards-item function failed', error);
    return json(context, 500, { message: error.message || 'Internal server error.' });
  }
};
