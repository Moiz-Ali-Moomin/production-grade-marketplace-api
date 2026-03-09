import * as admin from 'firebase-admin';
import { env } from '../../config/env';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: env.FIREBASE_PROJECT_ID,
            privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

export const firebase = admin;
