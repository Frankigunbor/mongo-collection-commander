
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBZh6Tx77QcFGiJp2URC_5cFfXFtsWbLWo",
//   authDomain: "lovable-admin-demo.firebaseapp.com",
//   projectId: "lovable-admin-demo",
//   storageBucket: "lovable-admin-demo.appspot.com",
//   messagingSenderId: "1025551432178",
//   appId: "1:1025551432178:web:a22b8fa2e0b7f16aca2d5e",
//   measurementId: "G-0JNDKMGC2E"
// };

const firebaseConfig = {
  apiKey: "AIzaSyD6FrmJrtOcJFcyQJ_-CfRVYPMlroSUMNw",
  authDomain: "broadsend-c022b.firebaseapp.com",
  projectId: "broadsend-c022b",
  storageBucket: "broadsend-c022b.firebasestorage.app",
  messagingSenderId: "950882688095",
  appId: "1:950882688095:web:dd4eae311d7a1b10b50fea",
  measurementId: "G-TGYLV4HM8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
