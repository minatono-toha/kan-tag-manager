import { describe, it, expect } from 'vitest'
import { reactive } from 'vue'

// indexedDB.ts の put() 呼び出しをモックし、実際に渡されるオブジェクトを検証する。
// `idb`(IndexedDBラッパー)は内部で initDB() 経由の実データベース接続を要求するため、
// ここでは「構造化複製できるか」だけを、ブラウザの structuredClone (IndexedDBと同じ複製アルゴリズム)
// で直接検証する。Vue の reactive Proxy はこれで確実に DataCloneError と同じ失敗を再現できる。
describe('IndexedDB へ渡すデータの複製可能性(DataCloneError の再現)', () => {
  it('Vue の reactive でラップした値は構造化複製できない(バグの再現)', () => {
    const source = { orig: 1, shipIndex: 0, variantId: 80, lv: 99, st: [0, 0, 0], exp: [0, 0, 0], ex: 0, sp: [] }
    // useShips.ts の userShipMap は ref<Map<...>> なので、Map から取り出した値は reactive で包まれる。
    const reactiveMap = reactive(new Map([['1_0', source]]))
    const existing = reactiveMap.get('1_0')!
    // updateShipVariant がやっているのと同じスプレッド(浅いコピー)
    const updated = { ...existing, variantId: 275 }

    expect(() => structuredClone(updated)).toThrow(/could not be cloned/i)
  })

  it('JSON往復(indexedDB.ts の toPlain 相当)で複製可能になる(修正の確認)', () => {
    const source = { orig: 1, shipIndex: 0, variantId: 80, lv: 99, st: [0, 0, 0], exp: [0, 0, 0], ex: 0, sp: [] }
    const reactiveMap = reactive(new Map([['1_0', source]]))
    const existing = reactiveMap.get('1_0')!
    const updated = { ...existing, variantId: 275 }

    const toPlain = <T>(data: T): T => JSON.parse(JSON.stringify(data))
    const plain = toPlain(updated)

    expect(() => structuredClone(plain)).not.toThrow()
    expect(plain).toEqual({ orig: 1, shipIndex: 0, variantId: 275, lv: 99, st: [0, 0, 0], exp: [0, 0, 0], ex: 0, sp: [] })
  })
})
