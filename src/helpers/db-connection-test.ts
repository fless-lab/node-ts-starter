import { config, DB } from '../core';

export async function testDatabaseConnection() {
  try {
    await DB.mongo.init(config.db.uri, config.db.name);
    console.info('Mongodb initialised.');
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
    throw error;
  }
}
