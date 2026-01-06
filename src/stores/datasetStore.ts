import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  setActiveDBName,
  getActiveDBName,
  resetDBConnection,
  initDB,
  saveShipOwnership,
  saveTagManagement,
  saveShipMetadata,
  saveShipVariantOverride,
  getAllShipOwnership,
  getAllTagManagementForEvent,
  getAllShipMetadata,
  deleteDatabase,
  getShipOwnership,
  getAllTagManagement,
  getAllShipVariantOverrides
} from '@/utils/indexedDB'
import type { TagManagement, ShipOwnership, ShipVariantOverride, ExpandedShip, Ship } from '@/types/interfaces'
import type { ExternalShipMetadata } from '@/utils/indexedDB'
import { generateFleetAnalysisJSON, parseFleetAnalysisJSON, type FleetAnalysisShip } from '@/utils/jsonUtils'
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
    if (!datasets.value.find(d => d.id === currentDB)) {
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
        const fallback = datasets.value.find(d => d.id !== id)
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
            datasets.value = datasets.value.filter(d => d.id !== id)
            saveDatasetsList()

            // Reload
            window.location.reload()
        } catch (e) {
            console.error('datasetStore: Error deleting active dataset:', e)
            alert('削除中にエラーが発生しましたが、リストからは削除します。')
            // Remove from list anyway to prevent stuck state
            datasets.value = datasets.value.filter(d => d.id !== id)
            saveDatasetsList()
            window.location.reload()
        }

    } else {
        try {
            await deleteDatabase(id)
            datasets.value = datasets.value.filter(d => d.id !== id)
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

  // Import Logic
  const importDataset = async (
    fileContent: string,
    newDatasetName: string,
    allShips: Ship[],
    selectedEventId: number,
    tagMap: Record<number, { tagId: number, tagName: string }>, // tagId -> TagDef
    stageTagMap: Record<string, { tagId: number }[]> // stage -> Tags
  ) => {
    const parsed = parseFleetAnalysisJSON(fileContent)

    // Create new dataset
    const newId = addDataset(newDatasetName)

    // Temporarily switch DB context to new ID (without reloading yet)
    // We must be careful here. simpler to just set active DB name, initDB will pick it up.
    // But we need to switch BACK if we fail, or just proceed to reload.
    // Let's decided to switch to it permanently upon success.
    const originalDB = getActiveDBName()

    try {
      await resetDBConnection()
      setActiveDBName(newId)

      // 1. Process Ships (Ownership) and Metadata
      // Group by bannerId (ship_id)
      const shipsByBanner = new Map<number, FleetAnalysisShip[]>()
      for (const p of parsed) {
        if (!shipsByBanner.has(p.ship_id)) shipsByBanner.set(p.ship_id, [])
        shipsByBanner.get(p.ship_id)?.push(p)
      }

      // Map bannerId to orig
      // allShips has bannerId and orig
      const bannerToOrig = new Map<number, number>()
      allShips.forEach(s => {
        if (s.bannerId) bannerToOrig.set(s.bannerId, s.orig)
      })

      // We need to handle ship counting.
      // Fleet Analysis lists INDIVIDUAL ships.
      // Our app stores count per orig.
      const ownershipMap = new Map<number, number>() // orig -> count

      for (const [bannerId, shipInstances] of shipsByBanner) {
        const orig = bannerToOrig.get(bannerId)
        if (!orig) {
          console.warn(`Unknown ship_id (bannerId): ${bannerId}`)
          continue
        }

        // Count total for this orig
        // Note: Different bannerIds might map to SAME orig (e.g. Kai vs Kai Ni often share orig? No, usually distinct in KC logic but our app groups by orig)
        // Wait, "orig" is usually the base ID.
        // If we have multiple bannerIds mapping to same orig, we sum them up?
        // Yes, likely.

        const currentCount = ownershipMap.get(orig) || 0
        ownershipMap.set(orig, currentCount + shipInstances.length)

        // Process each instance for Tags and Metadata
        // We need to assign them index 0, 1, 2...
        // But we might be mixing bannerIds for the same orig.
        // We need a global counter for this orig across all bannerIds.
      }

      // Re-loop to save data using correct indices
      const globalIndexMap = new Map<number, number>() // orig -> nextIndex

      for (const p of parsed) {
        const orig = bannerToOrig.get(p.ship_id)
        if (!orig) continue

        const currentIndex = globalIndexMap.get(orig) || 0
        globalIndexMap.set(orig, currentIndex + 1)

        // Save Metadata
        const metadata: ExternalShipMetadata = {
            orig,
            shipIndex: currentIndex,
            lv: p.lv,
            st: p.st,
            exp: p.exp,
            ex: p.ex,
            sp: p.sp
        }
        await saveShipMetadata(metadata)

        // Save Tag Mapping
        // p.area is tagId.
        if (p.area > 0 && selectedEventId) {
             // Find stage for this tagId
             // Reverse look up stageTagMap
             // stageTagMap: "E-1" -> [{tagId: 101, ...}, ...]
             let foundStage = ''
             for (const [stage, tags] of Object.entries(stageTagMap)) {
                  if (tags.some(t => t.tagId === p.area)) {
                      foundStage = stage
                      break
                  }
             }

             if (foundStage) {
                 const tagData: TagManagement = {
                     eventId: selectedEventId,
                     orig,
                     shipIndex: currentIndex,
                     assigned: true,
                     targetStage: foundStage,
                     preserve: false,
                     comment: ''
                 }
                 await saveTagManagement(tagData)
             }
        }
      }

      // Save Ownership
      for (const [orig, count] of ownershipMap) {
          await saveShipOwnership({ orig, count })
      }

      // We are done.
      // Reload to switch
      window.location.reload()

    } catch (e) {
        console.error("Import failed", e)
        // Revert
        await resetDBConnection()
        setActiveDBName(originalDB)
        // Maybe delete the partial DB?
        await deleteDatabase(newId)
        // Remove from list
        datasets.value = datasets.value.filter(d => d.id !== newId)
        saveDatasetsList()
        throw e
    }
  }

  // Export Logic
  const exportDataset = async (
    allShips: Ship[],
    selectedEventId: number,
    stageTagMap: Record<string, { tagId: number }[]> // stage -> Tags
  ) => {
    // 1. Get all Ownerships
    const ownerships = await getAllShipOwnership()

    // 2. Get all Tags for current event logic (we primarily want the tagId)
    // Actually we need to export ALL ships based on ownership, and attach tags if exists.
    // Tag data is stored by `${eventId}_${orig}_${shipIndex}` OR we can just get all tags.
    const allTags = await getAllTagManagement() // This gets ALL events. Using specific event ID is better if we only export current event state?
    // User request: "Import needed for ship_id and area. Area is firestore tagId."
    // If we export, we should export the state of the CURRENT event, right?
    // "area" usually implies the current event color.
    // If the user wants to backup their WHOLE database (all events), Fleet Analysis format might not support multiple events simultaneously easily (it has only one 'area').
    // Usually Fleet Analysis is for the *active* event.
    // So we will filter tags by `selectedEventId`.

    // 3. Get all Metadata
    const allMetadata = await getAllShipMetadata()
    const metadataMap = new Map<string, ExternalShipMetadata>()
    allMetadata.forEach(m => metadataMap.set(`${m.orig}_${m.shipIndex}`, m))

    // 4. Get all Tags for this event
    const eventTags = await getAllTagManagementForEvent(selectedEventId)
    const tagMap = new Map<string, TagManagement>()
    eventTags.forEach(t => tagMap.set(`${t.orig}_${t.shipIndex}`, t))

    // 5. Construct JSON
    const result: FleetAnalysisShip[] = []

    // Helper to find bannerId from orig
    // allShips has many entries for same orig (variants).
    // Which bannerId to use?
    // Fleet Analysis usually expects the *specific* ID (Kai Ni, etc).
    // But our app primarily tracks `orig`.
    // However, we do store `ShipVariantOverride`.
    // We should check if there is an override. If so, use that variant's ID.
    // If not, use the default (or highest level) bannerId for that orig?
    // Use `allShips` to find default.
    // We need `ShipVariantOverride` store.

    const variants = await getAllShipVariantOverrides()
    const variantMap = new Map<string, number>() // orig_index -> variantId
    variants.forEach(v => variantMap.set(`${v.orig}_${v.shipIndex}`, v.variantId))

    // Look up default bannerId for orig (e.g. max Id or just any)
    const origToBannerDefault = new Map<number, number>()
    allShips.forEach(s => {
       // We prefer the one that matches orig if possible, or just the first one.
       if (!origToBannerDefault.has(s.orig)) {
           origToBannerDefault.set(s.orig, s.id) // s.id is bannerId/shipId
       }
    })

    for (const owner of ownerships) {
        for (let i = 0; i < owner.count; i++) {
            const key = `${owner.orig}_${i}`

            // Determine Banner ID
            let shipId = variantMap.get(key)
            if (!shipId) {
                shipId = origToBannerDefault.get(owner.orig)
            }
            if (!shipId) shipId = owner.orig // Fallback

            // Determine Area (Tag)
            let area = 0
            const tagData = tagMap.get(key)
            if (tagData && tagData.targetStage && tagData.assigned) {
                // Map stage to tagId
                const tags = stageTagMap[tagData.targetStage]
                if (tags && tags.length > 0) {
                    area = tags[0].tagId
                }
            }

            // Get Metadata
            const meta = metadataMap.get(key)

            const entry: FleetAnalysisShip = {
                id: i + 1, // Arbitrary unique ID for the session? Or just ignore
                ship_id: shipId,
                lv: meta?.lv ?? 99, // Default to 99 if missing? or 1?
                st: meta?.st ?? [0,0,0,0,0,0,0],
                exp: meta?.exp ?? [0, 0, 0],
                area: area,
                ex: meta?.ex ?? 0,
                sp: meta?.sp ?? []
            }
            // If we have preserved unknown fields, we could add them, but Typescript limits us.
            // For now, adhere to interface.

            result.push(entry)
        }
    }

    return generateFleetAnalysisJSON(result)
  }

  // csv import logic
  const importShipCsv = async (
    csvContent: string,
    mode: 'overwrite' | 'new',
    allShips: Ship[],
    newDatasetName?: string
  ): Promise<{ success: number, excluded: string[] }> => {

    console.log('importShipCsv called')
    // 1. Parse CSV
    const rawNames = csvContent.split(/[\r\n,]+/).map(s => s.trim()).filter(s => s)
    console.log(`Parsed ${rawNames.length} names from CSV`)

    // 2. Prepare Name Matcher
    const nameToShip = new Map<string, Ship>()
    if (!allShips || allShips.length === 0) {
        console.error('CRITICAL: allShips passed to importShipCsv is empty or undefined!')
    }

    allShips.forEach(s => {
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
        // Zero out existing ownership for origs we are about to overwrite?
        // Or zero out EVERYTHING?
        // "Overwrite current tab" implies replacing everything or merging?
        // Usually file import implies replacing the state with the file content.
        // But if the file only contains "Yamato", do we delete "Musashi"?
        // The modal says "Overwrite current tab data". It usually implies full replacement for the entities involved or full replacement of the dataset.
        // For existing export/import, we replace everything.
        // Let's assume we should clear ownerships for ships NOT in the CSV?
        // Or just overwrite the ones IN the CSV?
        // User said "Overwrite current tab".
        // Let's stick to safe approach: Only update (overwrite) ships present in CSV.
        // Actually, if I import a list, I expect my list to match the import.
        // Existing logic in previous step was:
        /*
          const existing = await getAllShipOwnership()
          for (const e of existing) {
              if (!finalOwnership.has(e.orig)) {
                   await saveShipOwnership({ orig: e.orig, count: 0 })
              }
          }
        */
        // This clears ownership for ships not in CSV. So it matches "Full Replacement".
        // I will keep this logic.

        const existing = await getAllShipOwnership()
        for (const e of existing) {
            if (!shipVariantsByOrig.has(e.orig)) {
                 await saveShipOwnership({ orig: e.orig, count: 0 })
            }
        }
    }

    // Save New Data
    for (const [orig, variants] of shipVariantsByOrig) {
        // Save Ownership count
        await saveShipOwnership({ orig, count: variants.length })

        // Save Variant Overrides
        // We use index matching the array order
        for (let i = 0; i < variants.length; i++) {
             // We need to save the specific variant ID for this index
             await saveShipVariantOverride({
                 orig,
                 shipIndex: i,
                 variantId: variants[i]
             })
        }
        console.log(`Saved orig ${orig} with ${variants.length} ships. Variant IDs: ${variants.join(', ')}`)
    }
    console.log('Ownership and Variants saved.')
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
    importDataset,
    exportDataset,
    importShipCsv
  }
})
