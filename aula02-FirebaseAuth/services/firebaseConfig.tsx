// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Vai permitir que seja realizado o getReactNativePersistance mesmo sem tipagem
const { getReactNativePersistence } = require("firebase/auth") as any;

const firebaseConfig = {
  apiKey: "AIzaSyAaGJ6m13wv0-1peWgNjNgfBso1zom0_OM",
  authDomain: "aulafirebaseauth-4cd4a.firebaseapp.com",
  projectId: "aulafirebaseauth-4cd4a",
  storageBucket: "aulafirebaseauth-4cd4a.firebasestorage.app",
  messagingSenderId: "454839252633",
  appId: "1:454839252633:web:4e84ee9adac419891aea08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };