const { OAuth2Client } = require('google-auth-library');
const { json } = require('./http');

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

let oauthClient;

function getOAuthClient() {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured.');
  }

  if (!oauthClient) {
    oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
  }

  return oauthClient;
}

async function requireAuthenticatedUser(context, req) {
  const idToken = extractBearerToken(req);

  if (!idToken) {
    json(context, 401, { message: 'Missing Google ID token.' });
    return null;
  }

  try {
    const client = getOAuthClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.name) {
      json(context, 401, { message: 'Invalid Google ID token payload.' });
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture || '',
    };
  } catch (error) {
    context.log.warn('Google ID token verification failed', error.message);
    json(context, 401, { message: 'Invalid or expired Google ID token.' });
    return null;
  }
}

function extractBearerToken(req) {
  const authorization = req.headers?.authorization || req.headers?.Authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim();
}

module.exports = {
  requireAuthenticatedUser,
};
