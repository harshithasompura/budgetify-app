import firebaseConfig from './config/firebase-keys'

import { initializeApp } from "firebase/app";

export const firebaseApp = initializeApp(firebaseConfig);
