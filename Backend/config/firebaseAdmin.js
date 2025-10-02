import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'

let app

export function initFirebaseAdmin() {
  if (app) return app

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT

  if (!serviceAccountPath && !serviceAccountJson) {
    throw new Error('Firebase Admin: provide FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT in .env')
  }

  let credential
  if (serviceAccountPath) {
    const absolute = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.join(process.cwd(), serviceAccountPath)
    const content = fs.readFileSync(absolute, 'utf-8')
    credential = admin.credential.cert(JSON.parse(content))
  } else {
    credential = admin.credential.cert(JSON.parse(serviceAccountJson))
  }

  app = admin.initializeApp({ credential })
  return app
}

export function getAuth() {
  if (!app) initFirebaseAdmin()
  return admin.auth()
}


