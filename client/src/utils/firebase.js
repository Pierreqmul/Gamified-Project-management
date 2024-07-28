import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "gamified-project-manager.firebaseapp.com",
  projectId: "gamified-project-manager",
  storageBucket: "gamified-project-manager.appspot.com",
  messagingSenderId: "1027608307853",
  appId: "1:1027608307853:web:3e70a8233c52c071ac5ac4",
  measurementId: "G-LP6W6TJTKY"

};

export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app)
