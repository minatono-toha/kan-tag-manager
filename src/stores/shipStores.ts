// stores/shipStore.ts
import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { useFilterStore } from '@/stores/filterStore'

export interface Ship {
  id: number
  individualId: number
  name: string
  orig: string
  class: string
  shipType: string
  speed: string
  banner: string
  filterId: number[]
}

export const useShipStore = defineStore('ship', {
  state: () => ({
    ships: [] as Ship[],
  }),
  actions: {
    async fetchShips() {
      const querySnapshot = await getDocs(collection(db, 'shiplist'))
      this.ships = querySnapshot.docs.map((doc) => doc.data() as Ship)
    },
  },
  getters: {
    filteredShips(state) {
      const filterStore = useFilterStore()
      if (filterStore.activeFilters.length === 0) return []
      return state.ships.filter((ship) =>
        ship.filterId.some((id) => filterStore.activeFilters.includes(id)),
      )
    },
    groupedByOrig(state): Record<string, Ship[]> {
      return state.ships.reduce(
        (acc, ship) => {
          if (!acc[ship.orig]) acc[ship.orig] = []
          acc[ship.orig].push(ship)
          return acc
        },
        {} as Record<string, Ship[]>,
      )
    },
  },
})
