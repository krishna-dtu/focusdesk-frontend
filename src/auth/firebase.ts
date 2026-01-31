import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * ✅ Firebase Config (Paste from Firebase Console)
 * Project Settings → Web App → Config
 */
const firebaseConfig = {
  apiKey: "AIzaSyDwKs6DoCisxVo2TtMbvpIA5kDb3wBj0f4",
  authDomain: "focusdesk-38386.firebaseapp.com",
  projectId: "focusdesk-38386",
  storageBucket: "focusdesk-38386.firebasestorage.app",
  messagingSenderId: "959487543213",
  appId: "1:959487543213:web:2196fe576f037081000324",
  measurementId: "G-CQFD3BQSV6"
};
/**
 * ✅ Initialize Firebase App
 */
const app = initializeApp(firebaseConfig);

/**
 * ✅ Export Auth Instance
 */
export const auth = getAuth(app);
