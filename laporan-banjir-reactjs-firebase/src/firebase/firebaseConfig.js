// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "API_KEY_ANDA",
  authDomain: "AUTH_DOMAIN_ANDA",
  projectId: "PROJECT_ID_ANDA",
  storageBucket: "STORAGE_BUCKET_ANDA",
  messagingSenderId: "MESSAGING_SENDER_ID_ANDA",
  appId: "APP_ID_ANDA",
  measurementId: "MEASUREMENT_ID_ANDA",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
