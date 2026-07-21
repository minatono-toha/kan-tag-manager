import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// Firebase Web設定(APIキーはクライアント公開前提の識別子。アクセス制御はFirestoreルール側で行う)
const firebaseConfig = {
  apiKey: 'AIzaSyBZnuw_hB2Z4e9OfQzkl_YXl_B1_EEVDv4',
  authDomain: 'kan-tag-manager-backend.firebaseapp.com',
  databaseURL: 'https://kan-tag-manager-backend-default-rtdb.firebaseio.com',
  projectId: 'kan-tag-manager-backend',
  storageBucket: 'kan-tag-manager-backend.firebasestorage.app',
  messagingSenderId: '643695827033',
  appId: '1:643695827033:web:65ce3f62822d2adfce3948',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export { db, collection, getDocs }
