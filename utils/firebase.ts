// File: utils/firebase.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// ── 1) Paste your Firebase config here ───────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA4ngiCPLolJ3EI-kdce5mhgVcSW3ZAqwQ",
  authDomain: "beej-app.firebaseapp.com",
  projectId: "beej-app",
  storageBucket: "beej-app.appspot.com",
  messagingSenderId: "237168195428",
  appId: "1:237168195428:web:6a45132c2ae259cd432c71"
};
// ───────────────────────────────────────────────────────────────────────────────

// Prevent reinitializing on hot reload:
const app = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();

// Now export the compat Auth and Firestore instances:
const auth = firebase.auth();
const db   = firebase.firestore();

export { app, auth, db };
