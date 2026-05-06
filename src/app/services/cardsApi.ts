import type { SaveWeddingCardInput, WeddingCardDesign } from '../types/weddingCard';

const API_BASE = '/api/cards';

export async function listWeddingCardDesigns(userId: string): Promise<WeddingCardDesign[]> {
  const response = await fetch(`${API_BASE}?userId=${encodeURIComponent(userId)}`);

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
  payload: Pick<SaveWeddingCardInput, 'userId' | 'title' | 'status' | 'cardData'>,
): Promise<WeddingCardDesign> {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update design.');
  }

  return (await response.json()) as WeddingCardDesign;
}

export async function deleteWeddingCardDesign(id: string, userId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE}/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete design.');
  }
}
