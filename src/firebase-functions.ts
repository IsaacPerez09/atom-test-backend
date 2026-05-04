import * as functions from 'firebase-functions';
import { app } from './index';

export const api = functions.https.onRequest(app);

export const health = functions.https.onRequest((req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});