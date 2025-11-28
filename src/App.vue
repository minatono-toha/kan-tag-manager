<template>
  <div class="app-container" :class="`theme-${theme}`">
    <!-- イベント選択 -->
    <div class="sticky top-0 bg-white z-20 shadow-md border-b">
      <div class="p-4">
        <EventSelect
          :selectedEventId="selectedEventId"
          :theme="theme"
          @event-selected="handleEventSelected"
          @theme-change="handleThemeChange"
        />
      </div>
    </div>

    <!-- タブ -->
    <ShipFilterTabs
      :filters="filters"
      :selectedFilterIds="selectedFilterIds"
      :isAllSelected="isAllSelected"
      @toggle-filter="toggleFilter"
      @toggle-all="toggleAllFilters"
    />

    <!-- メインコンテンツ：ここにスクロール管理を集約 -->
    <div
      class="main-scroll-container overflow-y-auto h-[calc(100vh-200px)] p-4"
      ref="scrollRef"
      @scroll="onScroll"
    >
      <div class="main-content flex gap-4">
        <!-- 艦船一覧（左側） -->
        <div class="list-container" :class="{ 'flex-1': shipListDisplayMode === 'detail', 'flex-none w-auto': shipListDisplayMode === 'nameOnly' }">
          <ShipListTable
            :ships="sortedShipsFromAttackTable.length > 0 ? sortedShipsFromAttackTable : ships"
            :loading="loading"
            :targetHeaderHeight="attackTableHeaderHeight"
            :hasFiltersSelected="selectedFilterIds.length > 0"
            @select="openModal"
            @filter-change="handleShipFilterChange"
            @display-mode-change="handleDisplayModeChange"
          />
        </div>

        <!-- 特攻情報（右側） -->
        <div class="attack-container flex-1">
          <AttackTable
            v-if="selectedEventId"
            :filteredUniqueOrigs="shipsToDisplay"
            :selectedEventId="selectedEventId!"
            @update-sorted-ships="handleSortedShipsUpdate"
            @loading="handleLoading"
            @header-height-change="handleHeaderHeightChange"
          />
          <div v-else class="p-4 text-center text-gray-500">
            イベントを選択してください
          </div>
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
import EventSelect from './components/eventselect/EventSelect.vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default defineComponent({
  components: { ShipFilterTabs, ShipListTable, ShipModal, AttackTable, EventSelect },
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
    const selectedEventId = ref<number | null>(null)
    const loading = ref(false)
    const theme = ref<'light' | 'dark' | 'gradient'>('light')

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'gradient') => {
      theme.value = newTheme
      // Save to localStorage for persistence
      localStorage.setItem('app-theme', newTheme)
    }

    // Load theme from localStorage on mount
    const loadTheme = () => {
      const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | 'gradient' | null
      if (savedTheme) {
        theme.value = savedTheme
      }
    }
    const attackTableHeaderHeight = ref<number | undefined>(undefined)
    const filteredShipsFromSearch = ref<Ship[]>([])
    const isSearchActive = ref(false)
    const shipListDisplayMode = ref<'detail' | 'nameOnly'>('detail')

    const handleDisplayModeChange = (mode: 'detail' | 'nameOnly') => {
      shipListDisplayMode.value = mode
    }

    const handleHeaderHeightChange = (height: number) => {
      attackTableHeaderHeight.value = height
    }

    const handleLoading = (isLoading: boolean) => {
      loading.value = isLoading
    }

    const handleSortedShipsUpdate = (updated: Ship[]) => {
      sortedShipsFromAttackTable.value = updated
    }

    const handleEventSelected = (eventId: number) => {
      console.log('App: handleEventSelected called with:', eventId)
      selectedEventId.value = eventId
      console.log('App: selectedEventId updated to:', selectedEventId.value)
    }

    const handleShipFilterChange = (filtered: Ship[], isActive: boolean) => {
      filteredShipsFromSearch.value = filtered
      isSearchActive.value = isActive
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
      loadTheme()
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
      selectedEventId,
      handleEventSelected,
      loading,
      handleLoading,
      attackTableHeaderHeight,
      handleHeaderHeightChange,
      shipsToDisplay,
      handleShipFilterChange,
      theme,
      handleThemeChange,
      shipListDisplayMode,
      handleDisplayModeChange,
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
  min-width: 0; /* Enable scrolling inside flex item */
}

.main-scroll-container {
  max-height: calc(100vh - 200px); /* イベント選択とタブ分除く */
}
</style>
