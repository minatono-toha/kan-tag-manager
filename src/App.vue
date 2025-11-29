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
import { defineComponent, ref, onMounted } from 'vue'
import { Ship } from '@/types/interfaces'
import ShipFilterTabs from './components/ship/ShipFilterTabs.vue'
import ShipListTable from './components/ship/ShipListTable.vue'
import ShipModal from './components/ship/ShipModal.vue'
import AttackTable from './components/attack/AttackTable.vue'
import EventSelect from './components/eventselect/EventSelect.vue'
import { useTheme } from '@/composables/useTheme'
import { useShips } from '@/composables/useShips'

export default defineComponent({
  components: { ShipFilterTabs, ShipListTable, ShipModal, AttackTable, EventSelect },
  setup() {
    const { theme, handleThemeChange } = useTheme()
    const {
      allShips,
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
    } = useShips()

    const modalShips = ref<Ship[]>([])
    const modalVisible = ref(false)
    const scrollRef = ref<HTMLElement | null>(null)
    const scrollPositions = ref<{ [key: string]: number }>({})

    const sortedShipsFromAttackTable = ref<Ship[]>([])
    const selectedEventId = ref<number | null>(null)
    const loading = ref(false)
    const attackTableHeaderHeight = ref<number | undefined>(undefined)
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
