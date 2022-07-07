import { initializeApp } from "firebase/app";

/// APPLICATION CONFIGURATION
/// import.meta.env is set .env files

const id = import.meta.env.VITE_PROJECT_ID;

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: `${id}.firebaseapp.com`,
  projectId: id,
  storageBucket: `${id}.appspot.com`,
  messagingSenderId: `${import.meta.env.VITE_MESSAGE_ID}`,
  appId: `${import.meta.env.VITE_APP_ID}`
};

export const firebaseApp = initializeApp(firebaseConfig);