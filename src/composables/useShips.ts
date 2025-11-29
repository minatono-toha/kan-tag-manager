import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Ship } from '@/types/interfaces'

export function useShips() {
  const allShips = ref<Ship[]>([])
  const uniqueOrigs = ref<Ship[]>([])
  const filters = ref<{ id: number; label: string }[]>([])
  const selectedFilterIds = ref<number[]>([])

  // Search state
  const filteredShipsFromSearch = ref<Ship[]>([])
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

  const shipsToDisplay = computed(() => {
    if (!isSearchActive.value || filteredShipsFromSearch.value.length === 0) {
      return ships.value
    }
    const searchedOrigs = new Set(filteredShipsFromSearch.value.map(s => s.orig))
    return ships.value.filter(ship => searchedOrigs.has(ship.orig))
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

  const handleShipFilterChange = (filtered: Ship[], isActive: boolean) => {
    filteredShipsFromSearch.value = filtered
    isSearchActive.value = isActive
  }

  return {
    allShips,
    uniqueOrigs,
    filters,
    selectedFilterIds,
    ships,
    shipsToDisplay,
    fetchShips,
    fetchFilters,
    toggleFilter,
    toggleAllFilters,
    isAllSelected,
    handleShipFilterChange,
    filteredShipsFromSearch,
    isSearchActive
  }
}
