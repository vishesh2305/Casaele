// config/firebaseAdmin.js

import 'dotenv/config';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let app;
let serviceAccount;

function initialize() {
  // Prevent re-initialization
  if (admin.apps.length > 0) {
    app = admin.apps[0];
    return;
  }

  // --- STRATEGY 1: Production (Render, Vercel, etc.) ---
  // Try to load from a single environment variable (pasted JSON)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      console.log('Initializing Firebase Admin with FIREBASE_SERVICE_ACCOUNT_JSON env var...');
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error('CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON.', e.message);
    }
  }

  // --- STRATEGY 2: Production (Alternative) ---
  // Try to load from individual environment variables
  if (
    !serviceAccount &&
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  ) {
    console.log('Initializing Firebase Admin with individual env vars (PROJECT_ID, PRIVATE_KEY, CLIENT_EMAIL)...');
    serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      // Replace "\\n" (escaped newlines) with actual newlines
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
  }

  // --- STRATEGY 3: Local Development (File Path) ---
  // Try to load from a file path (your original method)
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccount && serviceAccountPath) {
    console.log(`Initializing Firebase Admin with file path: ${serviceAccountPath}`);
    try {
      const absolutePath = path.resolve(process.cwd(), serviceAccountPath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Service account file not found at path: ${absolutePath}`);
      }
      serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    } catch (e) {
      console.error('CRITICAL: Failed to initialize Firebase Admin with file path.', e.message);
    }
  }

  // --- Final Initialization & Error ---
  if (!serviceAccount) {
    console.error('CRITICAL: Firebase Admin credentials are not set.');
    console.error('Please set FIREBASE_SERVICE_ACCOUNT_JSON (for production) or FIREBASE_SERVICE_ACCOUNT_PATH (for local dev).');
    process.exit(1);
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('CRITICAL: Failed to initialize Firebase Admin SDK with credentials.');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the initialization
initialize();

// Export the auth service, checking if the app was initialized
export const auth = app ? admin.auth() : null;