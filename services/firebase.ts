// Import the functions you need from the SDKs you need
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firestore from "firebase/firestore";
import * as database from "firebase/database";

// Your web app's Firebase configuration using environment variables
// These variables should be set in your deployment environment (e.g., Vercel, Netlify)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = firebaseApp.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebaseAuth.getAuth(app);
export const db = firestore.getFirestore(app);
export const rtdb = database.getDatabase(app);