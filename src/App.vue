<template>
  <div class="app-container">
    <!-- タブ -->
    <div class="sticky top-0 bg-white z-10 shadow-md">
      <ShipFilterTabs
        :filters="filters"
        :selectedFilterIds="selectedFilterIds"
        :isAllSelected="isAllSelected"
        @toggle-filter="toggleFilter"
        @toggle-all="toggleAllFilters"
      />
    </div>

    <!-- メインコンテンツ：ここにスクロール管理を集約 -->
    <div
      class="main-scroll-container overflow-y-auto h-[calc(100vh-60px)] p-4"
      ref="scrollRef"
      @scroll="onScroll"
    >
      <div class="main-content flex gap-4">
        <!-- 艦船一覧（左側） -->
        <div class="list-container flex-1">
          <ShipListTable
            :ships="sortedShipsFromAttackTable.length > 0 ? sortedShipsFromAttackTable : ships"
            @select="openModal"
          />
        </div>

        <!-- 特攻情報（右側） -->
        <div class="attack-container flex-1">
          <AttackTable
            :filteredUniqueOrigs="ships"
            @update-sorted-ships="handleSortedShipsUpdate"
          />
        </div>
      </div>
    </div>

    <!-- モーダル -->
    <ShipModal
      v-if="modalVisible"
      :ships="modalShips"
      :modalVisible="modalVisible"
      :selectedShipOrig="modalShips.length ? modalShips[0].orig : null"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { Ship } from '@/types/interfaces'
import ShipFilterTabs from './components/ship/ShipFilterTabs.vue'
import ShipListTable from './components/ship/ShipListTable.vue'
import ShipModal from './components/ship/ShipModal.vue'
import AttackTable from './components/attack/AttackTable.vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default defineComponent({
  components: { ShipFilterTabs, ShipListTable, ShipModal, AttackTable },
  setup() {
    const allShips = ref<Ship[]>([])
    const uniqueOrigs = ref<Ship[]>([])
    const modalShips = ref<Ship[]>([])
    const modalVisible = ref(false)

    const filters = ref<{ id: number; label: string }[]>([])
    const selectedFilterIds = ref<number[]>([])
    const scrollRef = ref<HTMLElement | null>(null)
    const scrollPositions = ref<{ [key: string]: number }>({})

    const sortedShipsFromAttackTable = ref<Ship[]>([])

    const handleSortedShipsUpdate = (updated: Ship[]) => {
      sortedShipsFromAttackTable.value = updated
    }

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
        return fa !== fb ? fa - fb : a.id - b.id
      })
    }

    const ships = computed(() => {
      if (selectedFilterIds.value.length === 0) return []
      return uniqueOrigs.value
        .filter((ship) => selectedFilterIds.value.includes(ship.filterId))
        .sort((a, b) => {
          const fa = a.filterId ?? 0
          const fb = b.filterId ?? 0
          return fa !== fb ? fa - fb : a.id - b.id
        })
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

    const openModal = (orig: number) => {
      modalVisible.value = true
      modalShips.value = allShips.value
        .filter((ship) => ship.orig === orig)
        .sort((a, b) => a.updateLevel - b.updateLevel)
    }

    const closeModal = () => {
      modalVisible.value = false
      modalShips.value = []
    }

    const onScroll = () => {
      if (scrollRef.value) {
        const scrollTop = scrollRef.value.scrollTop
        scrollPositions.value = { ...scrollPositions.value, main: scrollTop }
      }
    }

    onMounted(() => {
      fetchShips()
      fetchFilters()
    })

    return {
      filters,
      selectedFilterIds,
      isAllSelected,
      toggleFilter,
      toggleAllFilters,
      ships,
      modalShips,
      modalVisible,
      openModal,
      closeModal,
      scrollRef,
      scrollPositions,
      onScroll,
      sortedShipsFromAttackTable,
      handleSortedShipsUpdate,
    }
  },
})
</script>

<style scoped>
.main-content {
  display: flex;
  gap: 20px;
}

.list-container,
.attack-container {
  flex: 1;
}

.main-scroll-container {
  max-height: calc(100vh - 60px); /* タブ分除く */
}
</style>
