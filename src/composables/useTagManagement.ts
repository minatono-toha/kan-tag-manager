import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { ExpandedShip, TagManagement } from '@/types/interfaces'
import { db } from '@/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import {
  saveTagManagement,
  getAllTagManagementForEvent
} from '@/utils/indexedDB'

export interface TagDef {
  tagId: number
  tagName: string
  tagColor: string
}

export function useTagManagement(selectedEventId: Ref<number | null>, ships: Ref<ExpandedShip[]>) {
  // Key format: `${orig}_${shipIndex}`
  const tagManagementData = ref<Map<string, TagManagement>>(new Map())
  const stageOptions = ref<string[]>([])
  const stageTagMap = ref<Record<string, TagDef[]>>({})
  const tagMap = ref<Record<number, TagDef>>({})
  const loading = ref(false)

  // Fetch stage options and tags from eventmap and tags collections
  const fetchData = async (eventId: number) => {
    if (!eventId) return

    try {
      loading.value = true

      // 1. Fetch tags
      const tagsQ = query(collection(db, 'tags'), where('eventId', '==', eventId))
      const tagsSnap = await getDocs(tagsQ)
      const tMap: Record<number, TagDef> = {}
      tagsSnap.forEach((doc) => {
        const data = doc.data()
        const id = Number(data.tagId)
        if (!isNaN(id) && id !== 0) {
          tMap[id] = {
            tagId: id,
            tagName: data.tagName || '',
            tagColor: data.tagColor || '',
          }
        }
      })
      tagMap.value = tMap

      // 2. Fetch eventmap (stages)
      const mapQ = query(collection(db, 'eventmap'), where('eventId', '==', eventId))
      const mapSnap = await getDocs(mapQ)

      const stages = new Set<string>()
      const sTagMap: Record<string, TagDef[]> = {}

      mapSnap.forEach((doc) => {
        const data = doc.data()
        if (data.stage) {
          stages.add(data.stage)

          // Collect tags for this stage
          const tagsForStage: TagDef[] = []
          ;[data.tagId1, data.tagId2, data.tagId3, data.tagId4].forEach(rawId => {
            const id = Number(rawId)
            if (!isNaN(id) && id !== 0 && tMap[id]) {
              tagsForStage.push(tMap[id])
            }
          })

          // Deduplicate based on tagId
          const uniqueTags = tagsForStage.filter((tag, index, self) =>
            index === self.findIndex((t) => t.tagId === tag.tagId)
          )

          if (uniqueTags.length > 0) {
             sTagMap[data.stage] = uniqueTags
          }
        }
      })

      stageTagMap.value = sTagMap

      // Sort stages (E-1, E-2-1, E-2-2, etc.)
      stageOptions.value = Array.from(stages).sort((a, b) => {
        const aParts = a.replace('E-', '').split('-').map(Number)
        const bParts = b.replace('E-', '').split('-').map(Number)

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aVal = aParts[i] || 0
          const bVal = bParts[i] || 0
          if (aVal !== bVal) return aVal - bVal
        }
        return 0
      })
    } catch (error) {
      console.error('Error fetching stage and tag options:', error)
    } finally {
        loading.value = false
    }
  }

  // Load tag management data from IndexedDB
  const loadTagManagementData = async (eventId: number, shipList: ExpandedShip[]) => {
    if (!eventId || shipList.length === 0) {
      tagManagementData.value.clear()
      return
    }

    loading.value = true
    try {
      const allData = await getAllTagManagementForEvent(eventId)
      const dataMap = new Map<string, TagManagement>()

      // Create map from loaded data (key: `${orig}_${shipIndex}`)
      allData.forEach((item) => {
        const key = `${item.orig}_${item.shipIndex}`
        dataMap.set(key, item)
      })

      // For ships without data, create default entries
      shipList.forEach((ship) => {
        const key = `${ship.orig}_${ship.shipIndex}`
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            eventId,
            orig: ship.orig,
            shipIndex: ship.shipIndex,
            assigned: false,
            preserve: false,
            targetStage: '',
            tagId: 0,
            comment: ''
          })
        }
      })

      tagManagementData.value = dataMap
    } catch (error) {
      console.error('Error loading tag management data:', error)
    } finally {
      loading.value = false
    }
  }

  // Database save: Debounced to avoid excessive writes
  const dbSaveDebounced = useDebounceFn(async (data: TagManagement) => {
    try {
      await saveTagManagement(data)
    } catch (error) {
      console.error('Error saving tag management data to IndexedDB:', error)
    }
  }, 1000)

  // Update tag management data (Immediate UI feedback + debounced DB save)
  const updateTagManagement = async (data: TagManagement) => {
    console.log(`[useTagManagement] updateTagManagement: key=${data.orig}_${data.shipIndex}, tagId=${data.tagId}, assigned=${data.assigned}`)

    // 1. Update local state immediately for instant UI feedback
    const key = `${data.orig}_${data.shipIndex}`
    // Create a new map reference to trigger reactivity if using ref(Map)
    const newMap = new Map(tagManagementData.value)
    newMap.set(key, data)
    tagManagementData.value = newMap

    // 2. Queue background save to IndexedDB
    dbSaveDebounced(data)
  }

  // Get tag management data for a specific ship instance (with default values)
  const getTagManagementForShip = (orig: number, shipIndex: number): TagManagement => {
    const key = `${orig}_${shipIndex}`
    const existing = tagManagementData.value.get(key)
    if (existing) return existing

    // Return default values
    return {
      eventId: selectedEventId.value || 0,
      orig,
      shipIndex,
      assigned: false,
      preserve: false,
      targetStage: '',
      tagId: 0,
      comment: ''
    }
  }

  // Watch for event changes
  watch(() => selectedEventId.value, async (newEventId) => {
    if (newEventId) {
      await fetchData(newEventId)
      await loadTagManagementData(newEventId, ships.value)
    } else {
      stageOptions.value = []
      stageTagMap.value = {}
      tagMap.value = {}
      tagManagementData.value.clear()
    }
  })

  // Watch for ship changes
  watch(() => ships.value, async (newShips) => {
    if (selectedEventId.value && newShips.length > 0) {
      await loadTagManagementData(selectedEventId.value, newShips)
    }
  })

  return {
    tagManagementData,
    stageOptions,
    stageTagMap,
    tagMap,
    loading,
    fetchData,
    loadTagManagementData,
    updateTagManagement,
    getTagManagementForShip
  }
}
