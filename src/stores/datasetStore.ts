import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  setActiveDBName,
  getActiveDBName,
  resetDBConnection,

  saveTagManagement,
  getAllTagManagementForEvent,
  deleteDatabase,
  initDB,
  saveUserShip,
  getAllUserShips,
} from '@/utils/indexedDB'
import type {
  TagManagement,
  Ship,
  UserShip,
} from '@/types/interfaces'
import {
  generateFleetAnalysisJSON,
  parseFleetAnalysisJSON,
  type FleetAnalysisShip,
} from '@/utils/jsonUtils'
// Note: We can't use useTagManagement directly inside a store action easily because it expects refs.
// We will implement tag mapping logic separately.

interface Dataset {
  id: string
  name: string
  createdAt: number
}

const STORAGE_KEY_DATASETS = 'kan-tag-datasets'

export const useDatasetStore = defineStore('dataset', () => {
  const datasets = ref<Dataset[]>([])
  const activeDatasetId = ref<string>('')

  // Initialize
  const loadDatasets = () => {
    const stored = localStorage.getItem(STORAGE_KEY_DATASETS)
    if (stored) {
      datasets.value = JSON.parse(stored)
    } else {
      // Create default if none
      const defaultDs = { id: 'KanTagManagerDB', name: 'Default', createdAt: Date.now() }
      datasets.value = [defaultDs]
      localStorage.setItem(STORAGE_KEY_DATASETS, JSON.stringify(datasets.value))
    }

    const currentDB = getActiveDBName()
    // Ensure current DB is in the list (migration safety)
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

  const deleteDataset = async (id: string) => {
    if (datasets.value.length <= 1) {
      return
    }

    const isActive = id === activeDatasetId.value

    if (isActive) {
      const fallback = datasets.value.find((d) => d.id !== id)
      if (!fallback) {
        console.error('datasetStore: No fallback dataset found')
        return
      }

      // Switch context first (persistently)
      try {
        await resetDBConnection()
        setActiveDBName(fallback.id)

        // Delete the target
        await deleteDatabase(id)

        // Remove from list
        datasets.value = datasets.value.filter((d) => d.id !== id)
        saveDatasetsList()

        // Reload
        window.location.reload()
      } catch (e) {
        console.error('datasetStore: Error deleting active dataset:', e)
        alert('削除中にエラーが発生しましたが、リストからは削除します。')
        // Remove from list anyway to prevent stuck state
        datasets.value = datasets.value.filter((d) => d.id !== id)
        saveDatasetsList()
        window.location.reload()
      }
    } else {
      try {
        await deleteDatabase(id)
        datasets.value = datasets.value.filter((d) => d.id !== id)
        saveDatasetsList()
      } catch (e) {
        console.error('datasetStore: Error deleting inactive dataset:', e)
      }
    }
  }

  const switchDataset = async (id: string) => {
    await resetDBConnection()
    setActiveDBName(id)
    activeDatasetId.value = id
    // Reload page to reset all stores and states cleanly
    window.location.reload()
  }

  const renameDataset = (id: string, newName: string) => {
    const ds = datasets.value.find((d) => d.id === id)
    if (ds) {
      ds.name = newName
      saveDatasetsList()
    }
  }

  // Import Logic
  const importDataset = async (
    fileContent: string,
    newDatasetName: string,
    allShips: Ship[],
    selectedEventId: number,
    tagMap: Record<number, { tagId: number; tagName: string }>, // tagId -> TagDef
    stageTagMap: Record<string, { tagId: number; tagName: string }[]>, // stage -> Tags with names
    mode: 'overwrite' | 'new' = 'new',
  ) => {
    const parsed = parseFleetAnalysisJSON(fileContent)

    let newId = ''
    const originalDB = getActiveDBName()

    if (mode === 'new') {
      newId = addDataset(newDatasetName)
    } else {
      newId = originalDB
    }

    try {
      await resetDBConnection()
      setActiveDBName(newId)

      const db = await initDB()
      if (mode === 'overwrite') {
        // Clear existing data in the current DB
        await db.clear('tagManagement')
        await db.clear('userShips')
      }

      // 1. Process Ships and Metadata into UserShips
      // Group by bannerId (ship_id)
      const shipsByBanner = new Map<number, FleetAnalysisShip[]>()
      for (const p of parsed) {
        if (!shipsByBanner.has(p.ship_id)) shipsByBanner.set(p.ship_id, [])
        shipsByBanner.get(p.ship_id)?.push(p)
      }

      // Map bannerId to orig
      const bannerToOrig = new Map<number, number>()
      allShips.forEach((s) => {
        if (s.bannerId) bannerToOrig.set(s.bannerId, s.orig)
      })

      // Track how many ships of each orig we have processed to assign shipIndex
      const globalIndexMap = new Map<number, number>() // orig -> nextIndex

      for (const p of parsed) {
        const orig = bannerToOrig.get(p.ship_id)
        if (!orig) continue

        const currentIndex = globalIndexMap.get(orig) || 0
        globalIndexMap.set(orig, currentIndex + 1)

        // Create UserShip
        const userShip: UserShip = {
          orig,
          shipIndex: currentIndex,
          variantId: p.ship_id,
          lv: p.lv,
          st: p.st,
          exp: p.exp,
          ex: p.ex,
          sp: p.sp,
        }
        await saveUserShip(userShip)

        // Save Tag Mapping
        // p.area is tagId
        if (selectedEventId) {
          // Find stage for this tagId
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

          // Save TagManagement (without metadata)
          const tagData: TagManagement = {
            eventId: selectedEventId,
            orig,
            shipIndex: currentIndex,
            assigned: p.area > 0,
            targetStage: foundStage && foundTagName ? `${foundStage} (${foundTagName})` : foundStage,
            tagId: p.area,
            preserve: false,
            comment: '',
          }
          await saveTagManagement(tagData)
        }
      }

      // We are done.
      // Reload to switch
      window.location.reload()
    } catch (e) {
      console.error('Import failed', e)
      // Revert
      await resetDBConnection()
      setActiveDBName(originalDB)
      // Maybe delete the partial DB?
      await deleteDatabase(newId)
      // Remove from list
      datasets.value = datasets.value.filter((d) => d.id !== newId)
      saveDatasetsList()
      throw e
    }
  }

  // Export Logic
  const exportDataset = async (
    allShips: Ship[],
    selectedEventId: number,
  ) => {
    // 1. Get all UserShips (contains lv, st, variantId)
    const userShips = await getAllUserShips()

    // 2. Get all Tags for this event
    const eventTags = await getAllTagManagementForEvent(selectedEventId)
    const tagManagementMap = new Map<string, TagManagement>()
    eventTags.forEach((t) => tagManagementMap.set(`${t.orig}_${t.shipIndex}`, t))

    // 3. Construct JSON
    const result: FleetAnalysisShip[] = []

    for (const ship of userShips) {
      const key = `${ship.orig}_${ship.shipIndex}`
      const tagData = tagManagementMap.get(key)
      const area = tagData?.tagId || 0

      console.log(`[Area Debug] ship ${ship.orig}[${ship.shipIndex}]: tagId=${area}`)

      const entry: FleetAnalysisShip = {
        id: ship.shipIndex + 1, // Note: This might need to be global serial? Fleet analysis likely just needs generic unique ID or order.
        ship_id: ship.variantId,
        lv: ship.lv,
        st: ship.st,
        exp: ship.exp,
        area: area,
        ex: ship.ex,
        sp: ship.sp,
      }

      result.push(entry)
    }

    // Sort by id for stability?
    // UserShips come from DB.getAll is undefined order usually.
    // So we just return 0 to keep original order (which is userShip load order).
    result.sort(() => {
        return 0
    })

    return generateFleetAnalysisJSON(result)
  }

  // csv import logic
  const importShipCsv = async (
    csvContent: string,
    mode: 'overwrite' | 'new',
    allShips: Ship[],
    newDatasetName?: string,
  ): Promise<{ success: number; excluded: string[] }> => {
    console.log('importShipCsv called')
    // 1. Parse CSV
    const rawNames = csvContent
      .split(/[\r\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s)
    console.log(`Parsed ${rawNames.length} names from CSV`)

    // 2. Prepare Name Matcher
    const nameToShip = new Map<string, Ship>()
    if (!allShips || allShips.length === 0) {
      console.error('CRITICAL: allShips passed to importShipCsv is empty or undefined!')
    }

    allShips.forEach((s) => {
      if (s.name && !nameToShip.has(s.name)) {
        nameToShip.set(s.name, s)
      }
    })
    console.log(`Loaded ${nameToShip.size} unique ship names for matching`)

    // 3. Process Names
    const shipVariantsByOrig = new Map<number, number[]>() // orig -> [variantId, variantId...]
    const excluded: string[] = []
    let successCount = 0

    // Count occurrences for reporting excluded
    const unmatchedCounts = new Map<string, number>()

    for (const name of rawNames) {
      const ship = nameToShip.get(name)
      if (ship) {
        const list = shipVariantsByOrig.get(ship.orig) || []
        list.push(ship.id)
        shipVariantsByOrig.set(ship.orig, list)
        successCount++
      } else {
        unmatchedCounts.set(name, (unmatchedCounts.get(name) || 0) + 1)
      }
    }

    unmatchedCounts.forEach((count, name) => {
      console.warn(`Name unmatched: ${name}`)
      excluded.push(`${name} (${count}隻)`)
    })

    console.log(`Match success: ${successCount}, Excluded: ${excluded.length}`)

    // 4. Update Database
    let targetDBId = activeDatasetId.value

    if (mode === 'new') {
      const name = newDatasetName || `CSV Import ${new Date().toLocaleString()}`
      targetDBId = addDataset(name)
      console.log(`Created new dataset: ${targetDBId} (${name})`)
      await resetDBConnection()
      setActiveDBName(targetDBId)
    } else {
      console.log(`Overwriting current dataset: ${targetDBId}`)
      // Clear all existing data
      const db = await initDB()
      await db.clear('userShips')
      await db.clear('tagManagement')
    }

    // Save New Data
    for (const [orig, variants] of shipVariantsByOrig) {
      // Create UserShip entries
      for (let i = 0; i < variants.length; i++) {
        const userShip: UserShip = {
          orig,
          shipIndex: i,
          variantId: variants[i],
          lv: 99,
          st: [0, 0, 0, 0, 0, 0, 0],
          exp: [0, 0, 0],
          ex: 0,
          sp: [],
        }
        await saveUserShip(userShip)
      }
      console.log(
        `Saved orig ${orig} with ${variants.length} ships. Variant IDs: ${variants.join(', ')}`,
      )
    }
    console.log('Ownership and Variants saved (normalized).')
    // Note: Reload is handled by the UI component after result confirmation

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
