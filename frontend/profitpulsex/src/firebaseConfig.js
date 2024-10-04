import { initializeApp } from "firebase/app";
import { getAuth, applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth"; // Import the required functions

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase auth
export const auth = getAuth(app);

// Export the necessary Firebase functions
export { applyActionCode, verifyPasswordResetCode, confirmPasswordReset };
