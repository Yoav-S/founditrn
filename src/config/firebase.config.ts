import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCaqv_0nVxTF9De1Y_n_Y68pSUC_A_W1Y0",
  authDomain: "lostandfound-f2f82.firebaseapp.com",
  projectId: "lostandfound-f2f82",
  storageBucket: "lostandfound-f2f82.appspot.com",
  messagingSenderId: "671366342235",
  appId: "1:671366342235:web:a750ebfd0ec1aa6986817e",
  measurementId: "G-V9NVVZ29BX"
};

// Initialize the Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service using the initialized app
const storage = getStorage(app);

console.log('Firebase Storage Bucket Config:', firebaseConfig.storageBucket);

export { app, storage };
