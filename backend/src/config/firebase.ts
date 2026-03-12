import admin from 'firebase-admin';

export const initFirebase = (): void => {
  if (admin.apps.length > 0) return; // Already initialized

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('⚠️  Firebase Admin credentials not fully configured. Auth verification disabled.');
    // Initialize with no credential for development
    admin.initializeApp({ projectId: projectId || 'demo-project' });
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  console.log('✅ Firebase Admin initialized');
};

export { admin };
