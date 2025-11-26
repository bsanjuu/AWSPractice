const config = require('./env');

const dynamoDBConfig = {
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region,
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
};

// Local DynamoDB table definitions
const tables = {
  orders: {
    TableName: 'orders',
    KeySchema: [
      { AttributeName: 'orderId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'orderId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'createdAt', AttributeType: 'N' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userIdIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'createdAt', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  users: {
    TableName: 'users',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'emailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  payments: {
    TableName: 'payments',
    KeySchema: [
      { AttributeName: 'paymentId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'paymentId', AttributeType: 'S' },
      { AttributeName: 'orderId', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'orderIdIndex',
        KeySchema: [
          { AttributeName: 'orderId', KeyType: 'HASH' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
};

module.exports = {
  dynamoDBConfig,
  tables,
};