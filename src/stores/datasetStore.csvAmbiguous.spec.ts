import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Ship } from '@/types/interfaces'

const saveUserShipsBulk = vi.fn()
const clearStores = vi.fn()

vi.mock('@/utils/indexedDB', () => ({
  setActiveDBName: vi.fn(),
  getActiveDBName: vi.fn(() => 'KanTagManagerDB'),
  resetDBConnection: vi.fn(),
  getAllTagManagementForEvent: vi.fn(async () => []),
  deleteDatabase: vi.fn(),
  initDB: vi.fn(async () => undefined),
  getAllUserShips: vi.fn(async () => []),
  saveUserShipsBulk: (...args: unknown[]) => saveUserShipsBulk(...args),
  saveTagManagementBulk: vi.fn(),
  clearStores: (...args: unknown[]) => clearStores(...args),
}))

import { useDatasetStore } from './datasetStore'

// マスタから必要な項目だけ抜き出したテスト用の艦データ。
const ship = (p: Partial<Ship> & Pick<Ship, 'name' | 'bannerId' | 'orig' | 'updateLevel'>): Ship =>
  ({ spGroupId: p.orig, shipType: '', ...p }) as Ship

const GLORIOUS_BB = ship({ name: 'Glorious', bannerId: 1022, orig: 612, updateLevel: 0 })
const GLORIOUS_CV = ship({
  name: 'Glorious',
  bannerId: 1027,
  orig: 612,
  spGroupId: 9741,
  updateLevel: 1,
})
const GLORIOUS_KAI_BB = ship({ name: 'Glorious 改(戦)', bannerId: 740, orig: 612, updateLevel: 3 })
const GLORIOUS_KAI_CV = ship({
  name: 'Glorious 改(航)',
  bannerId: 741,
  orig: 612,
  spGroupId: 9741,
  updateLevel: 2,
})
// 同一グループだが形態で詳細表示が変わるため、こちらも選択式にしている艦
const SOYA_0 = ship({ name: '宗谷', bannerId: 699, orig: 408, updateLevel: 0, shipType: '特務艦' })
const SOYA_1 = ship({
  name: '宗谷',
  bannerId: 645,
  orig: 408,
  updateLevel: 1,
  shipType: '灯台補給船',
})
const SOYA_2 = ship({
  name: '宗谷',
  bannerId: 650,
  orig: 408,
  updateLevel: 2,
  shipType: '南極観測船',
})

const ALL_SHIPS = [
  GLORIOUS_CV,
  GLORIOUS_KAI_CV,
  GLORIOUS_KAI_BB,
  GLORIOUS_BB,
  SOYA_1,
  SOYA_2,
  SOYA_0,
]

describe('importShipCsv の艦種選択(Glorious)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    saveUserShipsBulk.mockClear()
    clearStores.mockClear()
  })

  it('Glorious は所持数ぶん都度選択を求め、選んだ艦種で取り込む', async () => {
    const store = useDatasetStore()
    const prompts: { name: string; index: number; total: number; candidates: number[] }[] = []

    const result = await store.importShipCsv(
      'Glorious\n雪風\nGlorious',
      'overwrite',
      ALL_SHIPS,
      undefined,
      async (p) => {
        prompts.push({
          name: p.name,
          index: p.index,
          total: p.total,
          candidates: p.candidates.map((c) => c.bannerId),
        })
        // 1隻目は巡洋戦艦、2隻目は正規空母
        return p.index === 1 ? 1022 : 1027
      },
    )

    expect(prompts).toEqual([
      { name: 'Glorious', index: 1, total: 2, candidates: [1022, 1027] },
      { name: 'Glorious', index: 2, total: 2, candidates: [1022, 1027] },
    ])
    expect(result).toEqual({ success: 2, excluded: ['雪風 (1隻)'] })

    const saved = saveUserShipsBulk.mock.calls[0][0]
    expect(saved).toEqual([
      expect.objectContaining({ orig: 612, variantId: 1022 }),
      expect.objectContaining({ orig: 9741, variantId: 1027 }),
    ])
  })

  it('艦これ表記の「Glorious改」も艦種選択の対象になる', async () => {
    const store = useDatasetStore()
    const names: string[] = []

    const result = await store.importShipCsv(
      'Glorious改',
      'overwrite',
      ALL_SHIPS,
      undefined,
      async (p) => {
        names.push(p.name)
        return 741
      },
    )

    expect(names).toEqual(['Glorious改'])
    expect(result).toEqual({ success: 1, excluded: [] })
    expect(saveUserShipsBulk.mock.calls[0][0]).toEqual([
      expect.objectContaining({ orig: 9741, variantId: 741 }),
    ])
  })

  it('選択をキャンセルすると null を返し、DBを一切変更しない', async () => {
    const store = useDatasetStore()

    const result = await store.importShipCsv(
      'Glorious\nGlorious',
      'overwrite',
      ALL_SHIPS,
      undefined,
      async () => null,
    )

    expect(result).toBeNull()
    expect(clearStores).not.toHaveBeenCalled()
    expect(saveUserShipsBulk).not.toHaveBeenCalled()
  })

  it('宗谷は3形態の選択を求め、選んだ形態で取り込む', async () => {
    const store = useDatasetStore()
    const candidates: { shipType: string; updateLevel: number }[] = []

    const result = await store.importShipCsv(
      '宗谷',
      'overwrite',
      ALL_SHIPS,
      undefined,
      async (p) => {
        candidates.push(
          ...p.candidates.map((c) => ({ shipType: c.shipType, updateLevel: c.updateLevel })),
        )
        return 650
      },
    )

    // 表示順は 特務艦(0) → 灯台補給船(1) → 南極観測船(2)
    expect(candidates).toEqual([
      { shipType: '特務艦', updateLevel: 0 },
      { shipType: '灯台補給船', updateLevel: 1 },
      { shipType: '南極観測船', updateLevel: 2 },
    ])
    expect(result).toEqual({ success: 1, excluded: [] })
    expect(saveUserShipsBulk.mock.calls[0][0]).toEqual([
      expect.objectContaining({ orig: 408, variantId: 650 }),
    ])
  })
})
