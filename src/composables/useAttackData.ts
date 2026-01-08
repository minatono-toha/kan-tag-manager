import { ref, computed, watch } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import type { ShipWithSpAttack, Event, ExpandedShip } from '@/types/interfaces'
import type { Ref } from 'vue'

export function useAttackData(selectedEventId: Ref<number | null>, filteredUniqueOrigs: Ref<ExpandedShip[]>) {
  const eventMaps = ref<Event[]>([])
  const tagMap = ref<Record<number, { tagName: string; tagColor: string }>>({})
  const shipsWithSpAttack = ref<ShipWithSpAttack[]>([])
  const loading = ref(false)
  const spAttackCache = ref<Record<number, Record<string, number>>>({})

  // Sorting
  const sortKey = ref<string | null>(null)
  const sortOrder = ref<'asc' | 'desc'>('desc')
  const sortByMode = ref<'area' | 'tag'>('area')

  // Expansion states
  const expandedStageNums = ref<number[]>([])
  const expandedTagIds = ref<number[]>([])

  const fetchEventMaps = async () => {
    if (!selectedEventId.value) return
    const q = query(collection(db, 'eventmap'), where('eventId', '==', selectedEventId.value))
    const snap = await getDocs(q)
    eventMaps.value = snap.docs.map((doc) => doc.data() as Event)
    expandedStageNums.value = []
  }

  const fetchTags = async () => {
    if (!selectedEventId.value) return
    const q = query(collection(db, 'tags'), where('eventId', '==', selectedEventId.value))
    const snap = await getDocs(q)
    const map: Record<number, { tagName: string; tagColor: string }> = {}
    snap.forEach((doc) => {
      const data = doc.data()
      if (typeof data.tagId === 'number') {
        map[data.tagId] = {
          tagName: data.tagName,
          tagColor: data.tagColor,
        }
      }
    })
    tagMap.value = map
    expandedTagIds.value = []
  }

  const fetchAllSpAttackData = async () => {
    if (!selectedEventId.value) return
    loading.value = true
    try {
      await fetchEventMaps()
      await fetchTags()
      const q = query(collection(db, 'maintable'), where('eventId', '==', selectedEventId.value))
      const snap = await getDocs(q)
      const results: Record<number, Record<string, number>> = {}
      snap.forEach((doc) => {
        const data = doc.data()
        // No need to check eventId here as query already filtered it
        const orig: number = data.orig
        results[orig] = {}
        for (const map of eventMaps.value) {
          const mapKey = `mapId_${map.mapId}`
          if (typeof data[mapKey] === 'number') {
            results[orig][mapKey] = data[mapKey]
          }
        }
      })
      spAttackCache.value = results
      updateShipsWithSpAttack()
    } finally {
      loading.value = false
    }
  }

  const updateShipsWithSpAttack = () => {
    shipsWithSpAttack.value = filteredUniqueOrigs.value.map((ship) => ({
      ...ship,
      spAttackData: spAttackCache.value[ship.orig] || {},
    }))
  }

  const sortedShips = computed(() => {
    if (!sortKey.value) {
      return [...shipsWithSpAttack.value].sort((a, b) => {
        const fa = a.filterId ?? 0
        const fb = b.filterId ?? 0
        if (fa !== fb) return fa - fb
        return (a.libraryId || 0) - (b.libraryId || 0)
      })
    }
    return [...shipsWithSpAttack.value].sort((a, b) => {
      const aVal = a.spAttackData[sortKey.value!]
      const bVal = b.spAttackData[sortKey.value!]
      const aNum = typeof aVal === 'number' ? aVal : -Infinity
      const bNum = typeof bVal === 'number' ? bVal : -Infinity
      return sortOrder.value === 'asc' ? aNum - bNum : bNum - aNum
    })
  })

  const stageGroups = computed(() => {
    const groups: { stageNum: number; maps: Event[] }[] = []
    const mapByStage: Record<number, Event[]> = {}
    for (const map of eventMaps.value) {
      if (!mapByStage[map.stageNum]) mapByStage[map.stageNum] = []
      mapByStage[map.stageNum].push(map)
    }
    Object.keys(mapByStage)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((stageNum) => {
        // Sort maps by mapId in ascending order
        const sortedMaps = mapByStage[Number(stageNum)].sort((a, b) => a.mapId - b.mapId)
        groups.push({ stageNum: Number(stageNum), maps: sortedMaps })
      })
    return groups
  })

  const tagGroups = computed(() => {
    const groups: { tagId: number; tagName: string; tagColor: string; maps: Event[] }[] = []
    const tagIds = Object.keys(tagMap.value).map(Number).sort((a, b) => a - b)

    for (const tagId of tagIds) {
      const mapsForTag = eventMaps.value.filter(map => {
         return [map.tagId1, map.tagId2, map.tagId3, map.tagId4].includes(tagId)
      })

      if (mapsForTag.length > 0) {
         mapsForTag.sort((a, b) => {
           if (a.stageNum !== b.stageNum) return a.stageNum - b.stageNum
           return a.mapId - b.mapId
         })

         groups.push({
           tagId,
           tagName: tagMap.value[tagId].tagName,
           tagColor: tagMap.value[tagId].tagColor,
           maps: mapsForTag
         })
      }
    }
    return groups
  })

  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      if (sortOrder.value === 'desc') {
        sortOrder.value = 'asc'
      } else if (sortOrder.value === 'asc') {
        sortKey.value = null
      }
    } else {
      sortKey.value = key
      sortOrder.value = 'desc'
    }
  }

  const toggleStage = (stageNum: number) => {
    const idx = expandedStageNums.value.indexOf(stageNum)
    if (idx >= 0) {
      expandedStageNums.value.splice(idx, 1)
    } else {
      expandedStageNums.value.push(stageNum)
    }
  }

  const toggleTag = (tagId: number) => {
    const idx = expandedTagIds.value.indexOf(tagId)
    if (idx >= 0) {
      expandedTagIds.value.splice(idx, 1)
    } else {
      expandedTagIds.value.push(tagId)
    }
  }

  const toggleSortMode = () => {
    sortByMode.value = sortByMode.value === 'area' ? 'tag' : 'area'
  }

  const isExpanded = (stageNum: number) => expandedStageNums.value.includes(stageNum)
  const isTagExpanded = (tagId: number) => expandedTagIds.value.includes(tagId)

  // Expand/Collapse All Logic
  const isAllExpanded = computed(() => {
    if (sortByMode.value === 'area') {
      if (stageGroups.value.length === 0) return false
      return stageGroups.value.every(group => expandedStageNums.value.includes(group.stageNum))
    } else {
      if (tagGroups.value.length === 0) return false
      return tagGroups.value.every(group => expandedTagIds.value.includes(group.tagId))
    }
  })

  const toggleAllStages = () => {
    if (sortByMode.value === 'area') {
      if (isAllExpanded.value) {
        // Collapse all
        expandedStageNums.value = []
      } else {
        // Expand all
        expandedStageNums.value = stageGroups.value.map(group => group.stageNum)
      }
    } else {
      if (isAllExpanded.value) {
        // Collapse all
        expandedTagIds.value = []
      } else {
        // Expand all
        expandedTagIds.value = tagGroups.value.map(group => group.tagId)
      }
    }
  }

  watch(() => filteredUniqueOrigs.value, updateShipsWithSpAttack)
  watch(() => selectedEventId.value, () => {
    if (selectedEventId.value) {
      fetchAllSpAttackData()
    }
  })

  return {
    eventMaps,
    tagMap,
    shipsWithSpAttack,
    loading,
    sortKey,
    sortOrder,
    sortByMode,
    expandedStageNums,
    expandedTagIds,
    sortedShips,
    stageGroups,
    tagGroups,
    fetchAllSpAttackData,
    sortBy,
    toggleStage,
    toggleTag,
    toggleSortMode,
    isExpanded,
    isTagExpanded,
    toggleAllStages,
    isAllExpanded
  }
}
