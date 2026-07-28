import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Ship, TagManagement, UserShip } from '@/types/interfaces'
import type { FleetAnalysisShip } from '@/utils/jsonUtils'

const saveTagManagementBulk = vi.fn()
const userShips: UserShip[] = []
const eventTags: TagManagement[] = []

vi.mock('@/utils/indexedDB', () => ({
  setActiveDBName: vi.fn(),
  getActiveDBName: vi.fn(() => 'KanTagManagerDB'),
  resetDBConnection: vi.fn(),
  getAllTagManagementForEvent: vi.fn(async () => eventTags),
  deleteDatabase: vi.fn(),
  initDB: vi.fn(async () => undefined),
  getAllUserShips: vi.fn(async () => userShips),
  saveUserShipsBulk: vi.fn(),
  saveTagManagementBulk: (...args: unknown[]) => saveTagManagementBulk(...args),
  clearStores: vi.fn(),
}))

import { useDatasetStore } from './datasetStore'

const EVENT_ID = 3
const YUKIKAZE = { name: '雪風', bannerId: 20, orig: 20, spGroupId: 20, shipType: '駆逐艦' } as Ship

// 同じ札(tagId 5)が E-4-1 と E-4-3 の両方で使われる状況。札だけでは海域を特定できない。
const STAGE_TAG_MAP = {
  'E-4-1': [{ tagId: 5, tagName: '第三艦隊' }],
  'E-4-3': [{ tagId: 5, tagName: '第三艦隊' }],
}
const STAGE_OPTIONS = ['E-4-1', 'E-4-2', 'E-4-3']

const userShip = (p: Partial<UserShip> = {}): UserShip => ({
  uniqueId: 101,
  orig: 20,
  shipIndex: 0,
  variantId: 20,
  lv: 99,
  st: [0, 0, 0, 0, 0, 0, 0],
  exp: [0, 0, 0],
  ex: 0,
  sp: [],
  ...p,
})

const tagManagement = (p: Partial<TagManagement> = {}): TagManagement => ({
  eventId: EVENT_ID,
  orig: 20,
  shipIndex: 0,
  assigned: true,
  preserve: false,
  targetStage: 'E-4-3 (第三艦隊)',
  tagId: 5,
  comment: '',
  ...p,
})

const fleetShip = (p: Partial<FleetAnalysisShip> = {}): FleetAnalysisShip => ({
  id: 101,
  ship_id: 20,
  lv: 99,
  st: [0, 0, 0, 0, 0, 0, 0],
  exp: [0, 0, 0],
  area: 5,
  ex: 0,
  sp: [],
  ktm_assigned: true,
  ...p,
})

const setDB = (ships: UserShip[], tags: TagManagement[]) => {
  userShips.splice(0, userShips.length, ...ships)
  eventTags.splice(0, eventTags.length, ...tags)
}

const importJson = async (ships: FleetAnalysisShip[]) => {
  const store = useDatasetStore()
  await store.importDataset({
    fileContent: JSON.stringify(ships),
    newDatasetName: '',
    allShips: [YUKIKAZE],
    selectedEventId: EVENT_ID,
    tagMap: { 5: { tagId: 5, tagName: '第三艦隊' } },
    stageTagMap: STAGE_TAG_MAP,
    stageOptions: STAGE_OPTIONS,
    mode: 'overwrite',
  })
  return saveTagManagementBulk.mock.calls[0][0] as TagManagement[]
}

describe('艦隊分析コードの割当先海域(ktm_stage)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    saveTagManagementBulk.mockClear()
    setDB([], [])
  })

  it('エクスポート時に割当先の海域を出力する(札名は含めない)', async () => {
    setDB([userShip()], [tagManagement()])
    const exported: FleetAnalysisShip[] = JSON.parse(
      await useDatasetStore().exportDataset([], EVENT_ID),
    )
    expect(exported[0]).toMatchObject({ area: 5, ktm_assigned: true, ktm_stage: 'E-4-3' })
  })

  it('割当先が未設定なら ktm_stage を出力しない', async () => {
    setDB([userShip()], [tagManagement({ assigned: false, targetStage: '', tagId: 0 })])
    const exported: FleetAnalysisShip[] = JSON.parse(
      await useDatasetStore().exportDataset([], EVENT_ID),
    )
    expect(exported[0].ktm_stage).toBeUndefined()
  })

  it('インポート時は ktm_stage の海域を復元する(札から推測しない)', async () => {
    const saved = await importJson([fleetShip({ ktm_stage: 'E-4-3' })])
    expect(saved[0]).toMatchObject({ targetStage: 'E-4-3', tagId: 5, assigned: true })
  })

  it('ktm_stage が無いコード(ゲーム由来)は従来どおり札から海域を推測する', async () => {
    const saved = await importJson([fleetShip({ ktm_assigned: undefined })])
    expect(saved[0]).toMatchObject({ targetStage: 'E-4-1', tagId: 5 })
  })

  it('ktm_stage の海域にその札が無ければ札から推測する', async () => {
    const saved = await importJson([fleetShip({ ktm_stage: 'E-4-2' })])
    expect(saved[0]).toMatchObject({ targetStage: 'E-4-1', tagId: 5 })
  })

  it('札を選ばず海域だけ決めていた場合も海域を復元する', async () => {
    const saved = await importJson([fleetShip({ area: 0, ktm_assigned: false, ktm_stage: 'E-4-2' })])
    expect(saved[0]).toMatchObject({ targetStage: 'E-4-2', tagId: 0, assigned: false })
  })
})
