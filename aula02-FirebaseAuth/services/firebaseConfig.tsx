// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Vai permitir que seja realizado o getReactNativePersistance mesmo sem tipagem
const { getReactNativePersistance } = require("firebase/auth") as any;

const firebaseConfig = {
  apiKey: "AIzaSyDNjGkAgsgNZT_KyZpNtq6zk3kyaxPtd5k",
  authDomain: "aulafirebaseauth.firebaseapp.com",
  projectId: "aulafirebaseauth",
  storageBucket: "aulafirebaseauth.firebasestorage.app",
  messagingSenderId: "571749210403",
  appId: "1:571749210403:web:0dbb90af81a54732255496"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistance(AsyncStorage)
});

export { auth };