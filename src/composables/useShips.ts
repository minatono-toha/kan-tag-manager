import { ref, computed, watch } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Ship, ExpandedShip, UserShip } from '@/types/interfaces'
import {
  saveUserShip,
  getAllUserShips,
  deleteUserShip
} from '@/utils/indexedDB'

// --- Singleton State ---
const allShips = ref<Ship[]>([])
const uniqueOrigs = ref<Ship[]>([])
const filters = ref<{ id: number; label: string }[]>([])
const selectedFilterIds = ref<number[]>([])

// UserShip data: Map<string, UserShip> where key is `${orig}_${shipIndex}`
// We also maintain a count map for performance: Map<orig, count>
const userShipMap = ref<Map<string, UserShip>>(new Map())
const ownershipCountMap = ref<Map<number, number>>(new Map())

// Search state
const filteredShipsFromSearch = ref<ExpandedShip[]>([])
const isSearchActive = ref(false)
// -----------------------

export function useShips() {

  const fetchShips = async (force = false) => {
    if (!force && allShips.value.length > 0) return

    const snap = await getDocs(collection(db, 'shiplist'))
    allShips.value = snap.docs.map((doc) => {
      const ship = doc.data() as Ship
      return { ...ship }
    })
    getUniqueOrigs()
  }

  const fetchFilters = async (force = false) => {
    if (!force && filters.value.length > 0) return

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

  // Load UserShips from IndexedDB
  const loadUserShips = async () => {
    try {
      const allData = await getAllUserShips()
      const uMap = new Map<string, UserShip>()
      const cMap = new Map<number, number>()

      allData.forEach((ship) => {
        uMap.set(`${ship.orig}_${ship.shipIndex}`, ship)
        cMap.set(ship.orig, (cMap.get(ship.orig) || 0) + 1)
      })

      userShipMap.value = uMap
      ownershipCountMap.value = cMap
    } catch (error) {
      console.error('Error loading user ships:', error)
    }
  }

  // Helper to construct a new UserShip
  const createDefaultUserShip = (orig: number, index: number): UserShip => {
    // Find default variant (base ship)
    const baseShip = uniqueOrigs.value.find(s => s.orig === orig)
    const variantId = baseShip ? baseShip.id : orig

    return {
      orig,
      shipIndex: index,
      variantId,
      lv: 99,
      st: [0,0,0,0,0,0,0],
      exp: [0,0,0],
      ex: 0,
      sp: []
    }
  }

  // Increment ship count (max 30)
  const incrementShipCount = async (orig: number) => {
    const currentCount = getOwnershipCount(orig)
    if (currentCount >= 30) return

    const newIndex = currentCount // 0-based index
    const newUserShip = createDefaultUserShip(orig, newIndex)

    await saveUserShip(newUserShip)

    // Update local state
    userShipMap.value.set(`${orig}_${newIndex}`, newUserShip)
    ownershipCountMap.value.set(orig, currentCount + 1)
  }

  // Decrement ship count (min 0)
  const decrementShipCount = async (orig: number) => {
    const currentCount = getOwnershipCount(orig)
    if (currentCount <= 0) return

    const lastIndex = currentCount - 1
    await deleteUserShip(orig, lastIndex)

    // Update local state
    userShipMap.value.delete(`${orig}_${lastIndex}`)
    ownershipCountMap.value.set(orig, currentCount - 1)
  }

  // Update ship variant
  const updateShipVariant = async (orig: number, shipIndex: number, variantId: number) => {
    const key = `${orig}_${shipIndex}`
    const existing = userShipMap.value.get(key)

    if (existing) {
      const updated = { ...existing, variantId }
      await saveUserShip(updated)
      userShipMap.value.set(key, updated)
    } else {
      // Should not happen if strictly counting, but safety fallback
      const newUserShip = createDefaultUserShip(orig, shipIndex)
      newUserShip.variantId = variantId
      await saveUserShip(newUserShip)
      userShipMap.value.set(key, newUserShip)
    }
  }

  // Get ownership count for a ship
  const getOwnershipCount = (orig: number): number => {
    return ownershipCountMap.value.get(orig) || 0
  }

  // Expand ships based on ownership count
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
      .filter((ship) => {
        // 1. Basic check: Does the original ship match?
        if (selectedFilterIds.value.includes(ship.filterId)) return true

        // 2. Extended check: Does any owned variant match?
        const count = getOwnershipCount(ship.orig)
        if (count > 0) {
           for (let i = 0; i < count; i++) {
             const key = `${ship.orig}_${i}`
             const userShip = userShipMap.value.get(key)
             if (userShip) {
               const variant = allShips.value.find(s => s.id === userShip.variantId)
               if (variant && selectedFilterIds.value.includes(variant.filterId)) {
                 return true
               }
             }
           }
        }
        return false
      })
      .sort((a, b) => {
        const fa = a.filterId ?? 0
        const fb = b.filterId ?? 0
        return fa !== fb ? fa - fb : (a.libraryId || 0) - (b.libraryId || 0)
      })
  })

  // Expanded ships for display
  const expandedShips = computed(() => {
    const expanded = expandShips(ships.value)

    if (selectedFilterIds.value.length === 0) return expanded

    return expanded.filter(ship => {
      // Resolve the actual ship type being displayed
      let currentFilterId = ship.filterId
      const key = `${ship.orig}_${ship.shipIndex}`
      const userShip = userShipMap.value.get(key)

      if (userShip) {
        // Check local override
        const variant = allShips.value.find(s => s.id === userShip.variantId)
        if (variant) {
          currentFilterId = variant.filterId
        }
      }

      return selectedFilterIds.value.includes(currentFilterId)
    })
  })

  const shipsToDisplay = computed(() => {
    if (!isSearchActive.value) {
      return expandedShips.value
    }
    return filteredShipsFromSearch.value
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

  // Watch for changes in allShips and reload
  watch(allShips, async () => {
    await loadUserShips()
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
    loadUserShips,
    incrementShipCount,
    decrementShipCount,
    getOwnershipCount,
    userShipMap,
    updateShipVariant
  }
}
