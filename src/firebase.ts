// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBZnuw_hB2Z4e9OfQzkl_YXl_B1_EEVDv4',
  authDomain: 'kan-tag-manager-backend.firebaseapp.com',
  databaseURL: 'https://kan-tag-manager-backend-default-rtdb.firebaseio.com',
  projectId: 'kan-tag-manager-backend',
  storageBucket: 'kan-tag-manager-backend.firebasestorage.app',
  messagingSenderId: '643695827033',
  appId: '1:643695827033:web:65ce3f62822d2adfce3948',
  measurementId: 'G-T70106DCYY',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const db = getFirestore(app)
export { db, collection, getDocs }
