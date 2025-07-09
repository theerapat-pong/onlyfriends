// src/services/firebase.ts

// Import functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The web app's Firebase configuration, now read from Environment Variables.
// Vite exposes environment variables on the `import.meta.env` object.
// It's crucial to prefix variables with `VITE_` to make them accessible in client-side code.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services to be used across the app
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
