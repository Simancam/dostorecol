// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD4_xMfsBpPpznnFQIDFhRffDFFUMz_c5Y",
  authDomain: "dostore-30bc5.firebaseapp.com",
  projectId: "dostore-30bc5",
  storageBucket: "dostore-30bc5.appspot.com",
  messagingSenderId: "352620388416",
  appId: "1:352620388416:web:19de1ca837d3879f207fa5",
  measurementId: "G-8Y3KCPM6ZR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };