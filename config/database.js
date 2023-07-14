'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using a MongoMemoryServer instance.
 * @returns {Promise<MongoMemoryServer>} A promise that resolves to the MongoMemoryServer instance representing the in-memory MongoDB server.
 */
async function connect() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connection established at ${mongoUri}`);

  return mongoServer;
}

module.exports = connect;