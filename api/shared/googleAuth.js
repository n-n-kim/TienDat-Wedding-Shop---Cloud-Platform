const { OAuth2Client } = require('google-auth-library');
const { json } = require('./http');

const GOOGLE_CLIENT_IDS = getAllowedClientIds();

let oauthClient;

function getOAuthClient() {
  if (GOOGLE_CLIENT_IDS.length === 0) {
    throw new Error('GOOGLE_CLIENT_ID is not configured.');
  }

  if (!oauthClient) {
    oauthClient = new OAuth2Client();
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
      audience: GOOGLE_CLIENT_IDS,
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
    const debugPayload = decodeJwtPayload(idToken);

    context.log.warn('Google ID token verification failed', {
      errorMessage: error?.message || 'Unknown Google token verification error.',
      expectedAudience: GOOGLE_CLIENT_IDS,
      tokenAudience: debugPayload?.aud || null,
      tokenIssuer: debugPayload?.iss || null,
      tokenExpiry: debugPayload?.exp || null,
      tokenSubject: debugPayload?.sub || null,
    });

    json(context, 401, {
      message: error?.message || 'Invalid or expired Google ID token.',
    });
    return null;
  }
}

function getAllowedClientIds() {
  const rawValue = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';

  return rawValue
    .split(',')
    .map((clientId) => clientId.trim())
    .filter(Boolean);
}

function extractBearerToken(req) {
  const directGoogleToken =
    req.headers?.['x-google-id-token'] ||
    req.headers?.['X-Google-Id-Token'];

  if (typeof directGoogleToken === 'string' && directGoogleToken.trim()) {
    return directGoogleToken.trim();
  }

  const authorization = req.headers?.authorization || req.headers?.Authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim();
}

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const jsonPayload = Buffer.from(padded, 'base64').toString('utf8');

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

module.exports = {
  requireAuthenticatedUser,
};
