import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
export const isFirebaseConfigured = !!(rawApiKey && rawApiKey.trim() !== '' && !rawApiKey.includes('your_'));

const firebaseConfig = {
  apiKey: isFirebaseConfigured ? rawApiKey : 'mock-firebase-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'kalasetu-sih2026.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kalasetu-sih2026',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'kalasetu-sih2026.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:100000000000:web:0000000000000000000000',
};

let app: FirebaseApp | undefined;
let auth: Auth | any;
let db: Firestore | any;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  if (isFirebaseConfigured) {
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    // Safe offline mock objects that won't throw on getAuth()
    auth = {
      app: { options: {} },
      currentUser: null,
      onAuthStateChanged: () => () => {},
    };
    db = {};
  }
} catch (e) {
  console.warn('Firebase safe offline mode active:', e);
  auth = { app: { options: {} }, currentUser: null };
  db = {};
}

export { app, auth, db };

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// Phone Auth helpers with safe reCAPTCHA lifecycle handling
export const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
  if (typeof window !== 'undefined' && window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Could not clear previous recaptcha verifier:', e);
    }
  }
  const verifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
  });
  if (typeof window !== 'undefined') {
    window.recaptchaVerifier = verifier;
  }
  return verifier;
};

export const sendOTP = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
  return signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
};
