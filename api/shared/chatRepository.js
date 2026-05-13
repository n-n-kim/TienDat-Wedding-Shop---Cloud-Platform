const { randomUUID } = require('node:crypto');
const { TableClient, TableServiceClient } = require('@azure/data-tables');

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONVERSATIONS_TABLE_NAME =
  process.env.AZURE_CHAT_CONVERSATIONS_TABLE_NAME || 'ConsultationConversations';
const MESSAGES_TABLE_NAME =
  process.env.AZURE_CHAT_MESSAGES_TABLE_NAME || 'ConsultationMessages';
const CONVERSATION_PARTITION_KEY = 'conversation';

let conversationsClientPromise;
let messagesClientPromise;

async function getConversationsClient() {
  if (!CONNECTION_STRING) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured.');
  }

  if (!conversationsClientPromise) {
    conversationsClientPromise = createClient(CONVERSATIONS_TABLE_NAME);
  }

  return conversationsClientPromise;
}

async function getMessagesClient() {
  if (!CONNECTION_STRING) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured.');
  }

  if (!messagesClientPromise) {
    messagesClientPromise = createClient(MESSAGES_TABLE_NAME);
  }

  return messagesClientPromise;
}

async function createClient(tableName) {
  const serviceClient = TableServiceClient.fromConnectionString(CONNECTION_STRING);

  try {
    await serviceClient.createTable(tableName);
  } catch (error) {
    if (error.statusCode !== 409) {
      throw error;
    }
  }

  return TableClient.fromConnectionString(CONNECTION_STRING, tableName);
}

async function listConversationsByUser(userId) {
  const client = await getConversationsClient();
  const results = [];
  const entities = client.listEntities({
    queryOptions: {
      filter: [
        `PartitionKey eq '${CONVERSATION_PARTITION_KEY}'`,
        `userId eq '${escapeODataValue(userId)}'`,
      ].join(' and '),
    },
  });

  for await (const entity of entities) {
    results.push(mapEntityToConversation(entity));
  }

  return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function listAllConversations() {
  const client = await getConversationsClient();
  const results = [];
  const entities = client.listEntities({
    queryOptions: {
      filter: `PartitionKey eq '${CONVERSATION_PARTITION_KEY}'`,
    },
  });

  for await (const entity of entities) {
    results.push(mapEntityToConversation(entity));
  }

  return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function getConversation(conversationId) {
  const client = await getConversationsClient();

  try {
    const entity = await client.getEntity(CONVERSATION_PARTITION_KEY, conversationId);
    return mapEntityToConversation(entity);
  } catch (error) {
    if (error.statusCode === 404) {
      return null;
    }

    throw error;
  }
}

async function createConversation(payload) {
  const conversationsClient = await getConversationsClient();
  const messagesClient = await getMessagesClient();
  const now = new Date().toISOString();
  const conversation = {
    id: randomUUID(),
    userId: payload.userId,
    userEmail: payload.userEmail,
    userName: payload.userName,
    userAvatar: payload.userAvatar || '',
    contactPhone: payload.contactPhone || '',
    status: 'open',
    lastMessage: buildPreview(payload.initialMessage),
    lastSenderRole: 'user',
    unreadForAdmin: 1,
    unreadForUser: 0,
    createdAt: now,
    updatedAt: now,
  };

  await conversationsClient.createEntity(mapConversationToEntity(conversation));

  const message = createMessageModel(conversation.id, {
    senderId: payload.userId,
    senderName: payload.userName,
    senderRole: 'user',
    content: payload.initialMessage,
    createdAt: now,
  });

  await messagesClient.createEntity(mapMessageToEntity(message));

  return conversation;
}

async function listMessages(conversationId) {
  const client = await getMessagesClient();
  const results = [];
  const entities = client.listEntities({
    queryOptions: {
      filter: `PartitionKey eq '${escapeODataValue(conversationId)}'`,
    },
  });

  for await (const entity of entities) {
    results.push(mapEntityToMessage(entity));
  }

  return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

async function addMessage(conversationId, payload) {
  const conversation = await getConversation(conversationId);

  if (!conversation) {
    return null;
  }

  const messagesClient = await getMessagesClient();
  const conversationsClient = await getConversationsClient();
  const now = new Date().toISOString();
  const message = createMessageModel(conversationId, {
    senderId: payload.senderId,
    senderName: payload.senderName,
    senderRole: payload.senderRole,
    content: payload.content,
    createdAt: now,
  });

  await messagesClient.createEntity(mapMessageToEntity(message));

  const updatedConversation = {
    ...conversation,
    contactPhone: conversation.contactPhone || payload.contactPhone || '',
    status:
      conversation.status === 'closed' && payload.senderRole === 'user'
        ? 'open'
        : conversation.status,
    lastMessage: buildPreview(payload.content),
    lastSenderRole: payload.senderRole,
    unreadForAdmin: payload.senderRole === 'user' ? conversation.unreadForAdmin + 1 : 0,
    unreadForUser: payload.senderRole === 'admin' ? conversation.unreadForUser + 1 : 0,
    updatedAt: now,
  };

  await conversationsClient.upsertEntity(mapConversationToEntity(updatedConversation), 'Replace');

  return {
    conversation: updatedConversation,
    message,
  };
}

async function updateConversationStatus(conversationId, status) {
  const conversation = await getConversation(conversationId);

  if (!conversation) {
    return null;
  }

  const client = await getConversationsClient();
  const updatedConversation = {
    ...conversation,
    status,
    updatedAt: new Date().toISOString(),
  };

  await client.upsertEntity(mapConversationToEntity(updatedConversation), 'Replace');
  return updatedConversation;
}

async function clearUnreadCount(conversationId, viewerRole) {
  const conversation = await getConversation(conversationId);

  if (!conversation) {
    return null;
  }

  const nextUnreadForAdmin = viewerRole === 'admin' ? 0 : conversation.unreadForAdmin;
  const nextUnreadForUser = viewerRole === 'user' ? 0 : conversation.unreadForUser;

  if (
    nextUnreadForAdmin === conversation.unreadForAdmin &&
    nextUnreadForUser === conversation.unreadForUser
  ) {
    return conversation;
  }

  const client = await getConversationsClient();
  const updatedConversation = {
    ...conversation,
    unreadForAdmin: nextUnreadForAdmin,
    unreadForUser: nextUnreadForUser,
  };

  await client.upsertEntity(mapConversationToEntity(updatedConversation), 'Replace');
  return updatedConversation;
}

function mapConversationToEntity(conversation) {
  return {
    partitionKey: CONVERSATION_PARTITION_KEY,
    rowKey: conversation.id,
    userId: conversation.userId,
    userEmail: conversation.userEmail,
    userName: conversation.userName,
    userAvatar: conversation.userAvatar || '',
    contactPhone: conversation.contactPhone || '',
    status: conversation.status,
    lastMessage: conversation.lastMessage || '',
    lastSenderRole: conversation.lastSenderRole || '',
    unreadForAdmin: conversation.unreadForAdmin || 0,
    unreadForUser: conversation.unreadForUser || 0,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}

function mapEntityToConversation(entity) {
  return {
    id: entity.rowKey,
    userId: entity.userId,
    userEmail: entity.userEmail,
    userName: entity.userName,
    userAvatar: entity.userAvatar || '',
    contactPhone: entity.contactPhone || '',
    status: entity.status || 'open',
    lastMessage: entity.lastMessage || '',
    lastSenderRole: entity.lastSenderRole || '',
    unreadForAdmin: Number(entity.unreadForAdmin || 0),
    unreadForUser: Number(entity.unreadForUser || 0),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function mapMessageToEntity(message) {
  return {
    partitionKey: message.conversationId,
    rowKey: message.id,
    senderId: message.senderId,
    senderName: message.senderName,
    senderRole: message.senderRole,
    content: message.content,
    createdAt: message.createdAt,
  };
}

function mapEntityToMessage(entity) {
  return {
    id: entity.rowKey,
    conversationId: entity.partitionKey,
    senderId: entity.senderId,
    senderName: entity.senderName,
    senderRole: entity.senderRole,
    content: entity.content,
    createdAt: entity.createdAt,
  };
}

function createMessageModel(conversationId, payload) {
  return {
    id: `${Date.now().toString().padStart(13, '0')}_${randomUUID()}`,
    conversationId,
    senderId: payload.senderId,
    senderName: payload.senderName,
    senderRole: payload.senderRole,
    content: payload.content,
    createdAt: payload.createdAt,
  };
}

function buildPreview(content) {
  const normalized = String(content || '').trim().replace(/\s+/g, ' ');

  if (normalized.length <= 120) {
    return normalized;
  }

  return `${normalized.slice(0, 117)}...`;
}

function escapeODataValue(value) {
  return String(value).replace(/'/g, "''");
}

module.exports = {
  addMessage,
  clearUnreadCount,
  createConversation,
  getConversation,
  listAllConversations,
  listConversationsByUser,
  listMessages,
  updateConversationStatus,
};
