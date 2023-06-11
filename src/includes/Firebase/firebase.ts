import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_APP_ID}`,
};

firebase.initializeApp(firebaseConfig);

const firebaseAuth = firebase.auth();
const firestoreDatabase = firebase.firestore();
const firebaseStorage = firebase.storage();

const usersCollection = firestoreDatabase.collection("users");
const songsCollection = firestoreDatabase.collection("songs");
const commentsCollection = firestoreDatabase.collection("comments");

export {
  firebaseAuth,
  firestoreDatabase,
  firebaseStorage,
  usersCollection,
  songsCollection,
  commentsCollection,
};
