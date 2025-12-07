import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Ship, TagManagement } from '@/types/interfaces'
import { db } from '@/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import {
  saveTagManagement,
  getTagManagement,
  getAllTagManagementForEvent
} from '@/utils/indexedDB'

export function useTagManagement(selectedEventId: Ref<number | null>, ships: Ref<Ship[]>) {
  const tagManagementData = ref<Map<number, TagManagement>>(new Map())
  const stageOptions = ref<string[]>([])
  const loading = ref(false)

  // Fetch stage options from eventmap collection
  const fetchStageOptions = async (eventId: number) => {
    if (!eventId) return

    try {
      const q = query(collection(db, 'eventmap'), where('eventId', '==', eventId))
      const snap = await getDocs(q)

      const stages = new Set<string>()
      snap.forEach((doc) => {
        const data = doc.data()
        if (data.stage) {
          stages.add(data.stage)
        }
      })

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
      console.error('Error fetching stage options:', error)
    }
  }

  // Load tag management data from IndexedDB
  const loadTagManagementData = async (eventId: number, shipList: Ship[]) => {
    if (!eventId || shipList.length === 0) {
      tagManagementData.value.clear()
      return
    }

    loading.value = true
    try {
      const allData = await getAllTagManagementForEvent(eventId)
      const dataMap = new Map<number, TagManagement>()

      // Create map from loaded data
      allData.forEach((item) => {
        dataMap.set(item.orig, item)
      })

      // For ships without data, create default entries
      shipList.forEach((ship) => {
        if (!dataMap.has(ship.orig)) {
          dataMap.set(ship.orig, {
            eventId,
            orig: ship.orig,
            assigned: false,
            preserve: false,
            targetStage: '',
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

  // Update tag management data in IndexedDB
  const updateTagManagement = async (data: TagManagement) => {
    try {
      await saveTagManagement(data)
      // Update local map
      tagManagementData.value.set(data.orig, data)
    } catch (error) {
      console.error('Error saving tag management data:', error)
    }
  }

  // Get tag management data for a specific ship (with default values)
  const getTagManagementForShip = (orig: number): TagManagement => {
    const existing = tagManagementData.value.get(orig)
    if (existing) return existing

    // Return default values
    return {
      eventId: selectedEventId.value || 0,
      orig,
      assigned: false,
      preserve: false,
      targetStage: '',
      comment: ''
    }
  }

  // Watch for event changes
  watch(() => selectedEventId.value, async (newEventId) => {
    if (newEventId) {
      await fetchStageOptions(newEventId)
      await loadTagManagementData(newEventId, ships.value)
    } else {
      stageOptions.value = []
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
    loading,
    fetchStageOptions,
    loadTagManagementData,
    updateTagManagement,
    getTagManagementForShip
  }
}
