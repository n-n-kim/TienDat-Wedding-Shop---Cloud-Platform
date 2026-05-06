const { randomUUID } = require('node:crypto');
const { TableClient, TableServiceClient } = require('@azure/data-tables');

const TABLE_NAME = process.env.AZURE_TABLE_NAME || 'WeddingCardDesigns';
const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

let clientPromise;

async function getClient() {
  if (!CONNECTION_STRING) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured.');
  }

  if (!clientPromise) {
    clientPromise = createClient();
  }

  return clientPromise;
}

async function createClient() {
  const serviceClient = TableServiceClient.fromConnectionString(CONNECTION_STRING);

  try {
    await serviceClient.createTable(TABLE_NAME);
  } catch (error) {
    if (error.statusCode !== 409) {
      throw error;
    }
  }

  return TableClient.fromConnectionString(CONNECTION_STRING, TABLE_NAME);
}

async function listDesignsByUser(userId) {
  const client = await getClient();
  const results = [];

  const entities = client.listEntities({
    queryOptions: {
      filter: `PartitionKey eq '${escapeODataValue(userId)}'`,
    },
  });

  for await (const entity of entities) {
    results.push(mapEntityToDesign(entity));
  }

  return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function getDesign(userId, designId) {
  const client = await getClient();

  try {
    const entity = await client.getEntity(userId, designId);
    return mapEntityToDesign(entity);
  } catch (error) {
    if (error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

async function createDesign(payload) {
  const client = await getClient();
  const now = new Date().toISOString();
  const design = {
    id: randomUUID(),
    userId: payload.userId,
    userEmail: payload.userEmail,
    userName: payload.userName,
    title: payload.title,
    status: payload.status,
    cardData: payload.cardData,
    previewImageUrl: payload.previewImageUrl || '',
    createdAt: now,
    updatedAt: now,
  };

  await client.createEntity(mapDesignToEntity(design));
  return design;
}

async function updateDesign(userId, designId, payload) {
  const existing = await getDesign(userId, designId);

  if (!existing) {
    return null;
  }

  const client = await getClient();
  const updated = {
    ...existing,
    title: payload.title,
    status: payload.status,
    cardData: payload.cardData,
    updatedAt: new Date().toISOString(),
  };

  await client.upsertEntity(mapDesignToEntity(updated), 'Replace');
  return updated;
}

async function deleteDesign(userId, designId) {
  const client = await getClient();

  try {
    await client.deleteEntity(userId, designId);
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      return false;
    }
    throw error;
  }
}

function mapDesignToEntity(design) {
  return {
    partitionKey: design.userId,
    rowKey: design.id,
    userEmail: design.userEmail,
    userName: design.userName,
    title: design.title,
    status: design.status,
    cardData: JSON.stringify(design.cardData),
    previewImageUrl: design.previewImageUrl || '',
    createdAt: design.createdAt,
    updatedAt: design.updatedAt,
  };
}

function mapEntityToDesign(entity) {
  return {
    id: entity.rowKey,
    userId: entity.partitionKey,
    userEmail: entity.userEmail,
    userName: entity.userName,
    title: entity.title,
    status: entity.status,
    cardData: JSON.parse(entity.cardData),
    previewImageUrl: entity.previewImageUrl || '',
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function escapeODataValue(value) {
  return String(value).replace(/'/g, "''");
}

module.exports = {
  createDesign,
  deleteDesign,
  getDesign,
  listDesignsByUser,
  updateDesign,
};
