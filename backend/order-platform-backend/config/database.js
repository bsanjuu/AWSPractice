const config = require('./env');

// In-memory store for local development (replace with actual DB later)
const inMemoryStore = {
  users: [],
  orders: [],
  payments: [],
};

const connectDB = async () => {
  if (config.database.type === 'local') {
    console.log('✓ Using in-memory database for local development');
    return inMemoryStore;
  }
  // Add real DB connection logic here
};

module.exports = {
  connectDB,
  inMemoryStore,
};