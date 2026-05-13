export type ConversationStatus = 'open' | 'closed';
export type ChatSenderRole = 'user' | 'admin';

export interface ChatConversation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAvatar: string;
  contactPhone: string;
  status: ConversationStatus;
  lastMessage: string;
  lastSenderRole: ChatSenderRole | '';
  unreadForAdmin: number;
  unreadForUser: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: ChatSenderRole;
  content: string;
  createdAt: string;
}

export interface CreateConversationInput {
  contactPhone: string;
  initialMessage: string;
}

export interface SendChatMessageInput {
  content: string;
}
