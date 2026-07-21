const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Connects to MongoDB via Mongoose with retry logic.
 * If the connection fails, it retries up to MAX_RETRIES times before
 * giving up and exiting the process — the API is useless without a DB,
 * so failing loudly on boot is preferable to running in a broken state.
 */
const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('[db] MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[db] MongoDB connection error: ${err.message}`);
    });
  } catch (err) {
    console.error(`[db] Connection attempt ${attempt} failed: ${err.message}`);

    if (attempt < MAX_RETRIES) {
      console.log(`[db] Retrying in ${RETRY_DELAY_MS / 1000}s... (${attempt}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(attempt + 1), RETRY_DELAY_MS);
    } else {
      console.error('[db] Max retries reached. Exiting process.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
