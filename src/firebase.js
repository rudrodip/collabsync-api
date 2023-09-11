const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const config = require('./config');

/**
 * Initialize Firebase Admin SDK with service account credentials and project ID.
 * @type {firebaseAdmin.app.App}
 */
const adminApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  projectId: config.projectId,
});

/**
 * The Firestore database instance.
 * @type {firebaseAdmin.firestore.Firestore}
 */
const db = adminApp.firestore();

/**
 * FieldValue object for Firestore operations.
 * @type {firebaseAdmin.firestore.FieldValue}
 */
const FieldValue = firebaseAdmin.firestore.FieldValue;

module.exports = { db, FieldValue };