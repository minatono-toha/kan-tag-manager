import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useShips } from './useShips'
import type { Ship, UserShip } from '@/types/interfaces'

// jsdom には IndexedDB が無い。実際の永続化に近い形(保存した内容がそのまま読める)で
// フェイクしないと、loadUserShips() が常に空を返して直前の increment を打ち消してしまう
// (実際に一度それでハマった)。
const store = new Map<string, UserShip>()
vi.mock('@/utils/indexedDB', () => ({
  saveUserShip: vi.fn(async (data: UserShip) => {
    store.set(`${data.orig}_${data.shipIndex}`, { ...data })
  }),
  getAllUserShips: vi.fn(async () => Array.from(store.values())),
  deleteUserShip: vi.fn(async (orig: number, shipIndex: number) => {
    store.delete(`${orig}_${shipIndex}`)
  }),
}))

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 240, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 440, filterId: 1, name: 'Iowa', orig: 240, class: 'Iowa級1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

describe('着任済み艦の改装段階変更(App.vue の handleSafeUpdateVariant 相当を再現)', () => {
  it('変更後、expandedShips 経由で新しい variantId が引ける', async () => {
    const { allShips, uniqueOrigs, selectedFilterIds, expandedShips, userShipMap, incrementShipCount, updateShipVariant } = useShips()

    const iowa = makeShip({ name: 'Iowa', bannerId: 440, updateLevel: 0 })
    const iowaKai = makeShip({ name: 'Iowa改', bannerId: 360, updateLevel: 1 })
    allShips.value = [iowa, iowaKai]
    await nextTick()
    await flush() // watch(allShips, loadUserShips) を確実に片付ける

    uniqueOrigs.value = [iowa] // getUniqueOrigs() 相当(isBaseFormOf の結果、代表は Iowa)
    selectedFilterIds.value = [iowa.filterId]

    await incrementShipCount(iowa.spGroupId) // 着任 (orig=240, shipIndex=0)

    // handleSafeUpdateVariant の最初のガード
    const before = expandedShips.value.find((s) => s.orig === iowa.spGroupId && s.shipIndex === 0)
    expect(before, 'このガードが undefined を返すと、クリックしても何も起きない').toBeTruthy()
    expect(before?.ownershipCount).toBe(1)

    // 変更(Iowa → Iowa改)
    await updateShipVariant(iowa.spGroupId, 0, iowaKai.bannerId)

    // getDisplayShip 相当: variantMap(= userShipMap から作る shipVariantMap)に新しい bannerId が入っているか
    const key = `${iowa.spGroupId}_0`
    expect(userShipMap.value.get(key)?.variantId).toBe(iowaKai.bannerId)

    // 変更後も expandedShips から同じキーで引けるか(表の行がそのまま更新されるはず)
    const after = expandedShips.value.find((s) => s.orig === iowa.spGroupId && s.shipIndex === 0)
    expect(after).toBeTruthy()
  })
})
