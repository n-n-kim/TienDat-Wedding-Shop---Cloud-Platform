export interface CardData {
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  venue: string;
  date: string;
  time: string;
  colorScheme: string;
  background: string;
}

export type CardStatus = 'draft' | 'submitted';

export interface WeddingCardDesign {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  status: CardStatus;
  cardData: CardData;
  previewImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveWeddingCardInput {
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  status: CardStatus;
  cardData: CardData;
}
