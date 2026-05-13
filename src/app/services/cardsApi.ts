import type { SaveWeddingCardInput, WeddingCardDesign } from '../types/weddingCard';
import {
  clearStoredUser,
  getGoogleSessionErrorMessage,
  getStoredUser,
  hasValidGoogleIdToken,
} from './googleSession';

const API_BASE = '/api/cards';

export async function listWeddingCardDesigns(): Promise<WeddingCardDesign[]> {
  const response = await fetch(API_BASE, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to load saved designs.');
  }

  return (await response.json()) as WeddingCardDesign[];
}

export async function createWeddingCardDesign(
  payload: SaveWeddingCardInput,
): Promise<WeddingCardDesign> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to save design.');
  }

  return (await response.json()) as WeddingCardDesign;
}

export async function updateWeddingCardDesign(
  id: string,
  payload: SaveWeddingCardInput,
): Promise<WeddingCardDesign> {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to update design.');
  }

  return (await response.json()) as WeddingCardDesign;
}

export async function deleteWeddingCardDesign(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw await buildApiError(response, 'Failed to delete design.');
  }
}

async function buildApiError(response: Response, fallbackMessage: string): Promise<Error> {
  if (response.status === 401) {
    clearStoredUser();
    return new Error(getGoogleSessionErrorMessage());
  }

  try {
    const data = (await response.json()) as { message?: string };

    if (data.message) {
      return new Error(data.message);
    }
  } catch {
    // Ignore JSON parsing errors and fall back to the generic message.
  }

  return new Error(fallbackMessage);
}

function getAuthHeaders(): Record<string, string> {
  const user = getStoredUser();

  if (!user?.idToken) {
    return {};
  }

  if (!hasValidGoogleIdToken(user.idToken)) {
    clearStoredUser();
    throw new Error(getGoogleSessionErrorMessage());
  }

  return {
    Authorization: `Bearer ${user.idToken}`,
  };
}
