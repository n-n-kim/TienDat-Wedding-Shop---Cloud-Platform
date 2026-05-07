import type { SaveWeddingCardInput, WeddingCardDesign } from '../types/weddingCard';

const API_BASE = '/api/cards';

export async function listWeddingCardDesigns(): Promise<WeddingCardDesign[]> {
  const response = await fetch(API_BASE, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to load saved designs.');
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
    throw new Error('Failed to save design.');
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
    throw new Error('Failed to update design.');
  }

  return (await response.json()) as WeddingCardDesign;
}

export async function deleteWeddingCardDesign(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete design.');
  }
}

function getAuthHeaders(): Record<string, string> {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return {};
  }

  try {
    const user = JSON.parse(storedUser) as { idToken?: string | null };

    if (!user.idToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${user.idToken}`,
    };
  } catch {
    return {};
  }
}
