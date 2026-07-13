// Firestore のマスタデータをローカルにダンプする(読み取りのみ)。
// 生成器(build-maintable.mjs)はこのダンプを入力にするため、更新時は先にこれを実行する。
//   node scripts/fetch-master.mjs
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'data', 'master')

// src/firebase.ts と同じ公開設定(アクセス制御は Firestore ルール側)
const app = initializeApp({
  apiKey: 'AIzaSyBZnuw_hB2Z4e9OfQzkl_YXl_B1_EEVDv4',
  authDomain: 'kan-tag-manager-backend.firebaseapp.com',
  projectId: 'kan-tag-manager-backend',
  storageBucket: 'kan-tag-manager-backend.firebasestorage.app',
  messagingSenderId: '643695827033',
  appId: '1:643695827033:web:65ce3f62822d2adfce3948',
})
const db = getFirestore(app)

mkdirSync(OUT_DIR, { recursive: true })
for (const name of ['shiplist', 'eventmap', 'maintable']) {
  const snap = await getDocs(collection(db, name))
  const docs = snap.docs.map((d) => ({ _id: d.id, ...d.data() }))
  writeFileSync(join(OUT_DIR, `${name}.json`), JSON.stringify(docs, null, 1))
  console.log(`${name}: ${docs.length} docs`)
}
process.exit(0)
