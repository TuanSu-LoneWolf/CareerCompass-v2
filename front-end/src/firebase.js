// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// 🔐 Auth
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// 🧾 Firestore
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// ☁️ Storage
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// 🧩 Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAy9YMlKcyuT_6e9PUqSfxCC73uvx6dLx0",
  authDomain: "careercompass-react-khkt.firebaseapp.com",
  projectId: "careercompass-react-khkt",
  storageBucket: "careercompass-react-khkt.firebasestorage.app",
  messagingSenderId: "1076497346733",
  appId: "1:1076497346733:web:81121cd2c96f2082589624",
  measurementId: "G-1E3471T0KJ",
};

// 🚀 Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔑 Khởi tạo các dịch vụ Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 🌍 Provider đăng nhập Google
const googleProvider = new GoogleAuthProvider();

// ✅ Export tất cả để sử dụng ở nơi khác
export {
  app,
  analytics,
  auth,
  db,
  storage,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  storageRef,
  uploadBytes,
  getDownloadURL,
};

