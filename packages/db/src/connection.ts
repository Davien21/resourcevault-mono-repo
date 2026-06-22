import mongoose from "mongoose";

mongoose.set("strictQuery", true);

let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connects to MongoDB once and memoises the promise so repeated calls
 * (API boot, seed scripts, tests) reuse the same connection.
 */
export async function connectToDatabase(uri: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
  }
  return connectionPromise;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    connectionPromise = null;
  }
}

export { mongoose };
