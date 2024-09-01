import mongoose, { Connection } from 'mongoose';
import { config } from '../../../config';

let mongoClient: Connection | null = null;

async function connect(uri: string, dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(uri, { dbName })
      .then(() => {
        mongoClient = mongoose.connection;
        console.info('Mongoose connected to db');
        resolve();
      })
      .catch((err: mongoose.Error) => {
        console.error('Mongoose connection error:', err);
        reject(err);
      });
  });
}

async function init(
  uri: string = config.db.uri,
  dbName: string = config.db.name,
): Promise<void> {
  try {
    await connect(uri, dbName);
    console.info('Mongodb initialised.');
  } catch (err: unknown) {
    if (err instanceof mongoose.Error) {
      console.error('Connection error:', err);
    } else {
      console.error('Unexpected error:', err);
    }
    throw err;
  }
}

async function getClient(): Promise<Connection> {
  if (!mongoClient) {
    const error = new Error('Connection not initialized. Call init() first.');
    console.error(error);
    throw error;
  }

  return mongoClient;
}

async function close(): Promise<void> {
  if (mongoClient) {
    await mongoose.disconnect();
    console.warn('Mongoose connection is disconnected.');
  } else {
    console.warn('No mongoose connection found to close.');
  }
}

export { init, getClient, close };
