import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgJaGp_jE_EvDyLFwqsml0E9_YzJ83PAY",
  authDomain: "fir-course-98d02.firebaseapp.com",
  projectId: "fir-course-98d02",
  storageBucket: "fir-course-98d02.appspot.com",
  messagingSenderId: "564913326648",
  appId: "1:564913326648:web:7db5763bef2f14e98cb4cd",
  measurementId: "G-BHT6JXFMYF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
