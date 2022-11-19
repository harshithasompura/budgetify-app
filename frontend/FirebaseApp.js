// 1. import the firebase project keys
import { firebaseConfig } from "./config/firebase-keys";

// other imports from firebase libraries
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 2. instantiate the firebase app
// 3. the "export" keyword enables the firebaseApp variable to be accessible outside this file
export const firebaseApp = initializeApp(firebaseConfig);

// 4. @TODO: instantiate any other firebase services here
// 4. instantiate the auth variable
export const auth = getAuth(firebaseApp);

// - firestore
export const db = getFirestore(firebaseApp);
