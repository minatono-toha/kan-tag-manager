// stores/filterStore.ts
import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase' // firebase 初期化ファイル

interface Filter {
  filtertype_jp: string
  filtertype_en: string
  filterId: number
}

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filters: [] as { filtertype_jp: string; filterId: number }[],
    activeFilters: [] as number[], // アクティブな filterId の配列
  }),
  actions: {
    async fetchFilters() {
      const querySnapshot = await getDocs(collection(db, 'filter'))
      this.filters = querySnapshot.docs.map((doc) => doc.data() as Filter)
    },
    toggleFilter(id: number) {
      if (this.activeFilters.includes(id)) {
        this.activeFilters = this.activeFilters.filter((f) => f !== id)
      } else {
        this.activeFilters.push(id)
      }
    },
  },
})
