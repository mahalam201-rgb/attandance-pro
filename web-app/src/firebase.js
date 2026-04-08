import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCtzNTKl0eJwaoh-iqu2laGHLuHFTsDIP0",
  authDomain: "addendance-pro-2.firebaseapp.com",
  projectId: "addendance-pro-2",
  storageBucket: "addendance-pro-2.firebasestorage.app",
  messagingSenderId: "888516501277",
  appId: "1:888516501277:web:attendancepro"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
