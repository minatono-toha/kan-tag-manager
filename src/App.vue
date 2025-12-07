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
      class="main-scroll-container overflow-y-auto overflow-x-auto h-[calc(100vh-200px)] p-4"
      ref="scrollRef"
      @scroll="onScroll"
      :style="{ fontSize: `${scaleFactor * 100}%` }"
    >
      <div class="main-content flex gap-4">
        <!-- 札管理（左側） -->
        <div class="tag-manage-container flex-none flex flex-col" ref="tagManageContainerRef">
          <TagManageTitle />
          <div class="flex-grow">
            <TagManageTable
              :ships="sortedShipsFromAttackTable.length > 0 ? sortedShipsFromAttackTable : ships"
              :sourceShips="ships"
              :selectedEventId="selectedEventId"
              :loading="loading"
              :targetHeaderHeight="attackTableHeaderHeight"
              :tagManagementData="tagManagementData"
              :stageOptions="stageOptions"
              :updateTagManagement="updateTagManagement"
              @filter-change="handleTagFilterChange"
            />
          </div>
        </div>

        <!-- 艦船一覧（中央） -->
        <div class="list-container flex flex-col" :class="{ 'flex-1': shipListDisplayMode === 'detail', 'flex-none w-auto': shipListDisplayMode === 'nameOnly' }" ref="shipListContainerRef">
          <ShipListTitle
            @display-mode-change="handleDisplayModeChange"
          />
          <div class="flex-grow">
            <ShipListTable
              :ships="tagFilterActive ? filteredShipsFromTagTable : (sortedShipsFromAttackTable.length > 0 ? sortedShipsFromAttackTable : ships)"
              :loading="loading"
              :targetHeaderHeight="attackTableHeaderHeight"
              :hasFiltersSelected="selectedFilterIds.length > 0"
              :displayMode="shipListDisplayMode"
              :selectedEventId="selectedEventId"
              :tagManagementData="tagManagementData"
              @select="openModal"
              @filter-change="handleShipFilterChange"
            />
          </div>
        </div>

        <!-- 特攻情報（右側） -->
        <div class="attack-container flex-1 flex flex-col" ref="attackContainerRef">
          <AttackTitle
            v-if="selectedEventId"
            :sortByMode="attackSortByMode"
            :isAllExpanded="attackIsAllExpanded"
            @toggle-sort-mode="handleToggleSortMode"
            @toggle-all-stages="handleToggleAllStages"
          />
          <div class="flex-grow">
            <AttackTable
              v-if="selectedEventId"
              :filteredUniqueOrigs="tagFilterActive ? filteredShipsFromTagTable : ships"
              :selectedEventId="selectedEventId!"
              @update-sorted-ships="handleSortedShipsUpdate"
              @loading="handleLoading"
              @header-height-change="handleHeaderHeightChange"
              @update-sort-mode="handleSortModeUpdate"
              @update-is-all-expanded="handleIsAllExpandedUpdate"
              ref="attackTableRef"
            />
            <div v-else class="p-4 text-center text-gray-500">
              イベントを選択してください
            </div>
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
import { defineComponent, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Ship } from '@/types/interfaces'
import ShipFilterTabs from './components/ship/ShipFilterTabs.vue'
import ShipListTitle from './components/ship/ShipListTitle.vue'
import ShipListTable from './components/ship/ShipListTable.vue'
import ShipModal from './components/ship/ShipModal.vue'
import AttackTitle from './components/attack/AttackTitle.vue'
import AttackTable from './components/attack/AttackTable.vue'
import TagManageTitle from './components/tag-manage/TagManageTitle.vue'
import TagManageTable from './components/tag-manage/TagManageTable.vue'
import EventSelect from './components/eventselect/EventSelect.vue'
import { useTheme } from '@/composables/useTheme'
import { useShips } from '@/composables/useShips'
import { useTagManagement } from '@/composables/useTagManagement'

export default defineComponent({
  components: {
    ShipFilterTabs,
    ShipListTitle,
    ShipListTable,
    ShipModal,
    AttackTitle,
    AttackTable,
    TagManageTitle,
    TagManageTable,
    EventSelect
  },
  setup() {
    const { theme, handleThemeChange } = useTheme()
    const {
      allShips,
      uniqueOrigs, // Add this
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

    // Refs for table containers
    const tagManageContainerRef = ref<HTMLElement | null>(null)
    const shipListContainerRef = ref<HTMLElement | null>(null)
    const attackContainerRef = ref<HTMLElement | null>(null)

    const sortedShipsFromAttackTable = ref<Ship[]>([])
    const selectedEventId = ref<number | null>(null)
    const loading = ref(false)
    const attackTableHeaderHeight = ref<number | undefined>(undefined)
    const shipListDisplayMode = ref<'detail' | 'nameOnly'>('detail')
    const attackSortByMode = ref<string>('area')
    const attackIsAllExpanded = ref<boolean>(false)

    // Dynamic scaling
    const scaleFactor = ref(1)

    // Initialize tag management with uniqueOrigs (all ships) instead of filtered ships
    // This prevents reloading tag data every time filters change
    const { tagManagementData, stageOptions, updateTagManagement } = useTagManagement(selectedEventId, uniqueOrigs)

    // Store filtered ships from tag management table
    const filteredShipsFromTagTable = ref<Ship[]>([])
    const tagFilterActive = ref(false)

    const handleTagFilterChange = (filteredShips: Ship[], isFiltering: boolean) => {
      filteredShipsFromTagTable.value = filteredShips
      tagFilterActive.value = isFiltering
    }

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
      selectedEventId.value = eventId
    }

    const handleSortModeUpdate = (mode: string) => {
      attackSortByMode.value = mode
    }

    const handleIsAllExpandedUpdate = (expanded: boolean) => {
      attackIsAllExpanded.value = expanded
    }

    const attackTableRef = ref<any>(null)

    const handleToggleSortMode = () => {
      if (attackTableRef.value?.toggleSortMode) {
        attackTableRef.value.toggleSortMode()
      }
    }

    const handleToggleAllStages = () => {
      if (attackTableRef.value?.toggleAllStages) {
        attackTableRef.value.toggleAllStages()
      }
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

    // Handle window resize (includes zoom changes)
    const handleResize = () => {
      // Calculate scale factor based on window width
      // Base width 1500px, min scale 0.7, max scale 1.0
      const baseWidth = 1500
      const currentWidth = window.innerWidth
      scaleFactor.value = Math.max(0.7, Math.min(1, currentWidth / baseWidth))
    }

    onMounted(() => {
      fetchShips()
      fetchFilters()

      // Add resize event listener for zoom changes
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      // Remove resize event listener
      window.removeEventListener('resize', handleResize)
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
      attackSortByMode,
      attackIsAllExpanded,
      handleToggleSortMode,
      handleToggleAllStages,
      attackTableRef,
      handleSortModeUpdate,
      handleIsAllExpandedUpdate,
      tagManageContainerRef,
      shipListContainerRef,
      attackContainerRef,
      scaleFactor,
      tagManagementData,
      stageOptions,
      updateTagManagement,
      filteredShipsFromTagTable,
      tagFilterActive,
      handleTagFilterChange,
    }
  },
})
</script>

<style>
@import '@/assets/zoom-responsive.css';

.main-content {
  display: flex;
  gap: 20px;
  flex-wrap: nowrap; /* Prevent wrapping - always horizontal */
}

/* Set minimum widths for each container to prevent overlap */
.tag-manage-container {
  min-width: 390px; /* 80 + 60 + 100 + 150 columns */
}

.list-container {
  min-width: 160px; /* Name only mode minimum */
}

.list-container.flex-1 {
  min-width: 520px; /* Detail mode minimum (60 + 80 + 160 + 160 + 60) */
}

.attack-container {
  flex: 1;
  min-width: 400px; /* Minimum width for attack table */
}
</style>
