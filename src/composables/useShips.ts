import { ref, computed, watch } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Ship, ExpandedShip } from '@/types/interfaces'
import {
  getAllShipOwnership,
  saveShipOwnership
} from '@/utils/indexedDB'

export function useShips() {
  const allShips = ref<Ship[]>([])
  const uniqueOrigs = ref<Ship[]>([])
  const filters = ref<{ id: number; label: string }[]>([])
  const selectedFilterIds = ref<number[]>([])

  // Ship ownership data (orig -> count)
  const shipOwnershipMap = ref<Map<number, number>>(new Map())

  // Search state
  const filteredShipsFromSearch = ref<ExpandedShip[]>([])
  const isSearchActive = ref(false)

  const fetchShips = async () => {
    const snap = await getDocs(collection(db, 'shiplist'))
    allShips.value = snap.docs.map((doc) => {
      const ship = doc.data() as Ship
      return { ...ship }
    })
    getUniqueOrigs()
  }

  const fetchFilters = async () => {
    const snap = await getDocs(collection(db, 'filter'))
    filters.value = snap.docs
      .map((doc) => {
        const data = doc.data()
        return { id: Number(data.filterId), label: data.filtertype_jp }
      })
      .filter((f) => !isNaN(f.id))
      .sort((a, b) => a.id - b.id)
  }

  const getUniqueOrigs = () => {
    const map = new Map<number, Ship>()
    for (const ship of allShips.value) {
      if (!map.has(ship.orig) || ship.id < (map.get(ship.orig)?.id ?? Infinity)) {
        map.set(ship.orig, ship)
      }
    }
    uniqueOrigs.value = Array.from(map.values()).sort((a, b) => {
      const fa = a.filterId ?? 0
      const fb = b.filterId ?? 0
      return fa !== fb ? fa - fb : (a.libraryId || 0) - (b.libraryId || 0)
    })
  }

  // Load ship ownership data from IndexedDB
  const loadShipOwnership = async () => {
    try {
      const allOwnership = await getAllShipOwnership()
      const ownershipMap = new Map<number, number>()
      allOwnership.forEach((ownership) => {
        ownershipMap.set(ownership.orig, ownership.count)
      })
      shipOwnershipMap.value = ownershipMap
    } catch (error) {
      console.error('Error loading ship ownership:', error)
    }
  }

  // Increment ship count (max 30)
  const incrementShipCount = async (orig: number) => {
    const currentCount = shipOwnershipMap.value.get(orig) || 0
    if (currentCount >= 30) return  // Max limit

    const newCount = currentCount + 1
    await saveShipOwnership({ orig, count: newCount })
    shipOwnershipMap.value.set(orig, newCount)
  }

  // Decrement ship count (min 0)
  const decrementShipCount = async (orig: number) => {
    const currentCount = shipOwnershipMap.value.get(orig) || 0
    if (currentCount <= 0) return  // Min limit

    const newCount = currentCount - 1
    await saveShipOwnership({ orig, count: newCount })
    shipOwnershipMap.value.set(orig, newCount)
  }

  // Get ownership count for a ship
  // Default to 1 if no data is found (as per user request)
  const getOwnershipCount = (orig: number): number => {
    if (!shipOwnershipMap.value.has(orig)) {
      return 1
    }
    return shipOwnershipMap.value.get(orig) || 0
  }

  // Expand ships based on ownership count
  // If count = 0, show as unowned (1 row)
  // If count = 1, show as single ship (1 row, index 0)
  // If count = 2+, show multiple rows (index 0, 1, 2, ...)
  const expandShips = (ships: Ship[]): ExpandedShip[] => {
    const expanded: ExpandedShip[] = []

    for (const ship of ships) {
      const count = getOwnershipCount(ship.orig)

      if (count === 0) {
        // Show unowned ship
        expanded.push({
          ...ship,
          shipIndex: 0,
          ownershipCount: 0
        })
      } else {
        // Show owned ships (1 or more)
        for (let i = 0; i < count; i++) {
          expanded.push({
            ...ship,
            shipIndex: i,
            ownershipCount: count
          })
        }
      }
    }

    return expanded
  }

  const ships = computed(() => {
    if (selectedFilterIds.value.length === 0) return []
    return uniqueOrigs.value
      .filter((ship) => selectedFilterIds.value.includes(ship.filterId))
      .sort((a, b) => {
        const fa = a.filterId ?? 0
        const fb = b.filterId ?? 0
        return fa !== fb ? fa - fb : (a.libraryId || 0) - (b.libraryId || 0)
      })
  })

  // Expanded ships for display
  const expandedShips = computed(() => {
    return expandShips(ships.value)
  })

  const shipsToDisplay = computed(() => {
    if (!isSearchActive.value || filteredShipsFromSearch.value.length === 0) {
      return expandedShips.value
    }
    const searchedOrigs = new Set(filteredShipsFromSearch.value.map(s => s.orig))
    return expandedShips.value.filter(ship => searchedOrigs.has(ship.orig))
  })

  const toggleFilter = (id: number) => {
    const index = selectedFilterIds.value.indexOf(id)
    if (index > -1) selectedFilterIds.value.splice(index, 1)
    else selectedFilterIds.value.push(id)
  }

  const toggleAllFilters = () => {
    if (isAllSelected.value) selectedFilterIds.value = []
    else selectedFilterIds.value = filters.value.map((f) => f.id)
  }

  const isAllSelected = computed(() => {
    return selectedFilterIds.value.length === filters.value.length && filters.value.length > 0
  })

  const handleShipFilterChange = (filtered: ExpandedShip[], isActive: boolean) => {
    filteredShipsFromSearch.value = filtered
    isSearchActive.value = isActive
  }

  // Watch for changes in allShips and reload ownership
  watch(allShips, async () => {
    await loadShipOwnership()
  })

  return {
    allShips,
    uniqueOrigs,
    filters,
    selectedFilterIds,
    ships,
    expandedShips,
    shipsToDisplay,
    fetchShips,
    fetchFilters,
    toggleFilter,
    toggleAllFilters,
    isAllSelected,
    handleShipFilterChange,
    filteredShipsFromSearch,
    isSearchActive,
    loadShipOwnership,
    incrementShipCount,
    decrementShipCount,
    getOwnershipCount,
    shipOwnershipMap
  }
}
