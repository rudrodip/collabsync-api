const dotenv = require('dotenv');

/**
 * Load environment variables from a .env file.
 */
dotenv.config();

/**
 * Firebase configuration object.
 * @typedef {Object} FirebaseConfig
 * @property {string} apiKey - Firebase API key.
 * @property {string} authDomain - Firebase authentication domain.
 * @property {string} projectId - Firebase project ID.
 * @property {string} storageBucket - Firebase storage bucket.
 * @property {string} messagingSenderId - Firebase messaging sender ID.
 * @property {string} appId - Firebase app ID.
 * @property {string} measurementId - Firebase measurement ID.
 */

/**
 * Port number for the server.
 * @type {string}
 */
const port = process.env.PORT;

/**
 * Firebase configuration using environment variables.
 * @type {FirebaseConfig}
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

module.exports = {
  port,
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: firebaseConfig,
};
