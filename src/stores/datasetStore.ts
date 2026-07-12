import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  setActiveDBName,
  getActiveDBName,
  resetDBConnection,
  getAllTagManagementForEvent,
  deleteDatabase,
  initDB,
  getAllUserShips,
  saveUserShipsBulk,
  saveTagManagementBulk,
  clearStores,
} from '@/utils/indexedDB'
import type { TagManagement, Ship, UserShip } from '@/types/interfaces'
import {
  generateFleetAnalysisJSON,
  parseFleetAnalysisJSON,
  type FleetAnalysisShip,
} from '@/utils/jsonUtils'
import type { ImportMode } from '@/types/ui'

interface Dataset {
  id: string
  name: string
  createdAt: number
}

const STORAGE_KEY_DATASETS = 'kan-tag-datasets'

type FleetTagDef = { tagId: number; tagName: string }

export interface ImportFleetOptions {
  fileContent: string
  newDatasetName: string
  allShips: Ship[]
  selectedEventId: number
  tagMap: Record<number, FleetTagDef>
  stageTagMap: Record<string, FleetTagDef[]>
  mode: 'overwrite' | 'new'
}

export const useDatasetStore = defineStore('dataset', () => {
  const datasets = ref<Dataset[]>([])
  const activeDatasetId = ref<string>('')

  const loadDatasets = () => {
    const stored = localStorage.getItem(STORAGE_KEY_DATASETS)
    let restored: Dataset[] | null = null
    if (stored) {
      // 値が壊れていてもアプリが起動不能にならないようにする
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          restored = parsed
        }
      } catch (e) {
        console.error('datasetStore: Failed to parse stored dataset list, resetting', e)
      }
    }
    if (restored) {
      datasets.value = restored
    } else {
      const defaultDs = { id: 'KanTagManagerDB', name: 'Default', createdAt: Date.now() }
      datasets.value = [defaultDs]
      localStorage.setItem(STORAGE_KEY_DATASETS, JSON.stringify(datasets.value))
    }

    const currentDB = getActiveDBName()
    if (!datasets.value.find((d) => d.id === currentDB)) {
      const newDs = { id: currentDB, name: 'Imported/Legacy', createdAt: Date.now() }
      datasets.value.push(newDs)
      localStorage.setItem(STORAGE_KEY_DATASETS, JSON.stringify(datasets.value))
    }
    activeDatasetId.value = currentDB
  }

  const saveDatasetsList = () => {
    localStorage.setItem(STORAGE_KEY_DATASETS, JSON.stringify(datasets.value))
  }

  const addDataset = (name: string, idOverride?: string) => {
    const id = idOverride || `KanTagManagerDB_${Date.now()}`
    const newDs = { id, name, createdAt: Date.now() }
    datasets.value.push(newDs)
    saveDatasetsList()
    return id
  }

  // Returns true when the caller should reload the page (active dataset changed).
  const deleteDataset = async (id: string): Promise<boolean> => {
    if (datasets.value.length <= 1) return false

    const isActive = id === activeDatasetId.value

    if (isActive) {
      const fallback = datasets.value.find((d) => d.id !== id)
      if (!fallback) {
        console.error('datasetStore: No fallback dataset found')
        return false
      }

      try {
        await resetDBConnection()
        setActiveDBName(fallback.id)
        await deleteDatabase(id)
        datasets.value = datasets.value.filter((d) => d.id !== id)
        saveDatasetsList()
        return true
      } catch (e) {
        console.error('datasetStore: Error deleting active dataset:', e)
        datasets.value = datasets.value.filter((d) => d.id !== id)
        saveDatasetsList()
        return true
      }
    }

    try {
      await deleteDatabase(id)
      datasets.value = datasets.value.filter((d) => d.id !== id)
      saveDatasetsList()
    } catch (e) {
      console.error('datasetStore: Error deleting inactive dataset:', e)
    }
    return false
  }

  // Switches DB and asks the caller to reload to reset all stores.
  const switchDataset = async (id: string): Promise<void> => {
    await resetDBConnection()
    setActiveDBName(id)
    activeDatasetId.value = id
  }

  const renameDataset = (id: string, newName: string) => {
    const ds = datasets.value.find((d) => d.id === id)
    if (ds) {
      ds.name = newName
      saveDatasetsList()
    }
  }

  const importDataset = async (options: ImportFleetOptions): Promise<void> => {
    const {
      fileContent,
      newDatasetName,
      allShips,
      selectedEventId,
      stageTagMap,
      mode,
    } = options
    const parsed = parseFleetAnalysisJSON(fileContent)

    const originalDB = getActiveDBName()
    const newId = mode === 'new' ? addDataset(newDatasetName) : originalDB

    try {
      await resetDBConnection()
      setActiveDBName(newId)

      await initDB()
      if (mode === 'overwrite') {
        await clearStores(['tagManagement', 'userShips'])
      }

      const bannerToOrig = new Map<number, number>()
      for (const s of allShips) {
        if (s.bannerId) bannerToOrig.set(s.bannerId, s.orig)
      }

      const globalIndexMap = new Map<number, number>()
      const userShipBatch: UserShip[] = []
      const tagBatch: TagManagement[] = []

      for (const p of parsed) {
        const orig = bannerToOrig.get(p.ship_id)
        if (!orig) continue

        const currentIndex = globalIndexMap.get(orig) || 0
        globalIndexMap.set(orig, currentIndex + 1)

        userShipBatch.push({
          uniqueId: p.id,
          orig,
          shipIndex: currentIndex,
          variantId: p.ship_id,
          lv: p.lv,
          st: p.st,
          exp: p.exp,
          ex: p.ex,
          sp: p.sp,
        })

        if (selectedEventId) {
          let foundStage = ''
          let foundTagName = ''
          for (const [stage, tags] of Object.entries(stageTagMap)) {
            const tag = tags.find((t) => t.tagId === p.area)
            if (tag) {
              foundStage = stage
              foundTagName = tag.tagName || ''
              break
            }
          }

          tagBatch.push({
            eventId: selectedEventId,
            orig,
            shipIndex: currentIndex,
            assigned: p.area > 0,
            targetStage: foundStage && foundTagName ? `${foundStage} (${foundTagName})` : foundStage,
            tagId: p.area,
            preserve: false,
            comment: '',
          })
        }
      }

      await Promise.all([
        saveUserShipsBulk(userShipBatch),
        saveTagManagementBulk(tagBatch),
      ])
    } catch (e) {
      console.error('Import failed', e)
      await resetDBConnection()
      setActiveDBName(originalDB)
      if (mode === 'new') {
        await deleteDatabase(newId)
        datasets.value = datasets.value.filter((d) => d.id !== newId)
        saveDatasetsList()
      }
      throw e
    }
  }

  const exportDataset = async (
    _allShips: Ship[],
    selectedEventId: number,
  ) => {
    const userShips = await getAllUserShips()
    const eventTags = await getAllTagManagementForEvent(selectedEventId)
    const tagManagementMap = new Map<string, TagManagement>()
    for (const t of eventTags) tagManagementMap.set(`${t.orig}_${t.shipIndex}`, t)

    let maxId = 0
    for (const ship of userShips) {
      if (ship.uniqueId && ship.uniqueId > maxId) maxId = ship.uniqueId
    }

    const result: FleetAnalysisShip[] = []
    for (const ship of userShips) {
      const key = `${ship.orig}_${ship.shipIndex}`
      const area = tagManagementMap.get(key)?.tagId || 0

      let shipId = ship.uniqueId
      if (!shipId) {
        maxId += 1
        shipId = maxId
      }

      result.push({
        id: shipId,
        ship_id: ship.variantId,
        lv: ship.lv,
        st: ship.st,
        exp: ship.exp,
        area,
        ex: ship.ex,
        sp: ship.sp,
      })
    }

    return generateFleetAnalysisJSON(result)
  }

  const importShipCsv = async (
    csvContent: string,
    mode: ImportMode | 'overwrite' | 'new',
    allShips: Ship[],
    newDatasetName?: string,
  ): Promise<{ success: number; excluded: string[] }> => {
    const rawNames = csvContent
      .split(/[\r\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s)

    const nameToShip = new Map<string, Ship>()
    for (const s of allShips) {
      if (s.name && !nameToShip.has(s.name)) nameToShip.set(s.name, s)
    }

    const shipVariantsByOrig = new Map<number, number[]>()
    const unmatchedCounts = new Map<string, number>()
    let successCount = 0

    for (const name of rawNames) {
      const ship = nameToShip.get(name)
      if (ship) {
        const list = shipVariantsByOrig.get(ship.orig) || []
        list.push(ship.bannerId)
        shipVariantsByOrig.set(ship.orig, list)
        successCount++
      } else {
        unmatchedCounts.set(name, (unmatchedCounts.get(name) || 0) + 1)
      }
    }

    const excluded: string[] = []
    unmatchedCounts.forEach((count, name) => excluded.push(`${name} (${count}隻)`))

    let targetDBId = activeDatasetId.value
    if (mode === 'new') {
      const name = newDatasetName || `CSV Import ${new Date().toLocaleString()}`
      targetDBId = addDataset(name)
      await resetDBConnection()
      setActiveDBName(targetDBId)
      await initDB()
    } else {
      await initDB()
      await clearStores(['userShips', 'tagManagement'])
    }

    const batch: UserShip[] = []
    for (const [orig, variants] of shipVariantsByOrig) {
      for (let i = 0; i < variants.length; i++) {
        batch.push({
          orig,
          shipIndex: i,
          variantId: variants[i],
          lv: 99,
          st: [0, 0, 0, 0, 0, 0, 0],
          exp: [0, 0, 0],
          ex: 0,
          sp: [],
        })
      }
    }
    await saveUserShipsBulk(batch)

    return { success: successCount, excluded }
  }

  return {
    datasets,
    activeDatasetId,
    loadDatasets,
    addDataset,
    deleteDataset,
    switchDataset,
    renameDataset,
    importDataset,
    exportDataset,
    importShipCsv,
  }
})
