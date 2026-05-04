import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import * as path from 'path';
import * as fs from 'fs';

const serviceAccountPath = path.join(__dirname, '..', '..', 'atom-task-manager-77028-firebase-adminsdk-fbsvc-7df24b6106.json');

let serviceAccount;
if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'atom-task-manager-77028',
  });
}

/**
 * Instancia de Firestore inicializada para su uso en toda la aplicación.
 * Utiliza el Admin SDK con permisos totales sobre la base de datos.
 */
export const db = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID || 'atom-task-manager-77028',
  credentials: serviceAccount,
  databaseId: 'atom'
});
