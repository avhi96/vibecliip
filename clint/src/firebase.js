import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD__vnJqapTM5wD47L5uWhmJ9kruPTFieg",
  authDomain: "vibeclip-4b7b6.firebaseapp.com",
  projectId: "vibeclip-4b7b6",
  storageBucket: "vibeclip-4b7b6.firebasestorage.app",
  messagingSenderId: "207247199803",
  appId: "1:207247199803:web:c6c952a47fb106408f161e",
  measurementId: "G-PXVDTK41NR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
