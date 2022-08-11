import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKWJYK6AxJ-Y2hjqjIsXanoEtJeipwCqE",
  authDomain: "netflix-file.firebaseapp.com",
  projectId: "netflix-file",
  storageBucket: "netflix-file.appspot.com",
  messagingSenderId: "496809133907",
  appId: "1:496809133907:web:b8979f110c80b0110e83a6",
  measurementId: "G-CW5QK6HBT3",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
