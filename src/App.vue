<template>
  <div class="app-container" :class="`theme-${theme}`">
    <!-- イベント選択 & タブ (固定ヘッダー) -->
    <div class="sticky top-0 bg-white z-20 shadow-md border-b">
      <div class="px-1 pt-0.5 pb-0.5">
        <EventSelect
          :selectedEventId="selectedEventId"
          :theme="theme"
          @event-selected="handleEventSelected"
          @theme-change="handleThemeChange"
        />
      </div>

      <!-- タブ and Theme Selector -->
      <div class="flex items-end justify-between pb-1 px-1 -mt-[5px]">
        <ShipFilterTabs
          :filters="filters"
          :selectedFilterIds="selectedFilterIds"
          :isAllSelected="isAllSelected"
          :theme="theme"
          @toggle-filter="toggleFilter"
          @toggle-all="toggleAllFilters"
        />
        <ThemeSelector :currentTheme="theme" @theme-change="handleThemeChange" />
      </div>
    </div>

    <!-- メインコンテンツ：ここにスクロール管理を集約 -->
    <div
      class="main-scroll-container overflow-y-auto overflow-x-auto h-[calc(100vh-200px)] px-1 pb-1"
      ref="scrollRef"
      @scroll="onScroll"
      :style="{ fontSize: `${scaleFactor * 100}%` }"
    >
      <div class="main-content flex gap-10">
        <!-- 札管理（左側） -->
        <div
          class="tag-manage-container flex-none flex flex-col"
          ref="tagManageContainerRef"
          :class="{ 'check-only': tagManageDisplayMode === 'checkOnly' }"
        >
          <!-- Spacer to align with other tables -->
           <TableTitle title="制御札管理" type="tag" />
          <div class="p-1 pb-0">
            <div class="flex items-center mb-1 flex-nowrap" style="min-height: 44px;">
               <button
                @click="handleTagManageDisplayModeChange(tagManageDisplayMode === 'detail' ? 'checkOnly' : 'detail')"
                class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap"
              >
                {{ tagManageDisplayMode === 'detail' ? 'チェックのみ' : '詳細表示' }}
              </button>
            </div>
          </div>
          <div class="flex-grow">
            <TagManageTable
              :ships="finalShips"
              :sourceShips="shipsToDisplay"
              :selectedEventId="selectedEventId"
              :loading="loading"
              :targetHeaderHeight="attackTableHeaderHeight"
              :tagManagementData="tagManagementData"
              :stageOptions="stageOptions"
              :stageTagMap="stageTagMap"
              :tagMap="tagMap"
              :updateTagManagement="updateTagManagement"
              :displayMode="tagManageDisplayMode"
              :theme="theme"
              @filter-change="handleTagFilterChange"
            />
          </div>
        </div>

        <!-- 艦船一覧（中央） -->
        <div class="list-container flex flex-col" :class="{ 'flex-1': shipListDisplayMode === 'detail', 'flex-none w-auto': shipListDisplayMode === 'nameOnly' }" ref="shipListContainerRef">
             <TableTitle title="艦船情報" type="ship" />
          <div class="p-1 pb-0">
            <div class="flex items-center mb-1 flex-nowrap" style="min-height: 44px;">
              <button
                @click="handleDisplayModeChange(shipListDisplayMode === 'detail' ? 'nameOnly' : 'detail')"
                class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap"
              >
                {{ shipListDisplayMode === 'detail' ? '艦名のみ' : '詳細表示' }}
              </button>
            </div>
          </div>
          <div class="flex-grow">
            <ShipListTable
              :ships="finalShips"
              :loading="loading"
              :targetHeaderHeight="attackTableHeaderHeight"
              :hasFiltersSelected="selectedFilterIds.length > 0"
              :displayMode="shipListDisplayMode"
              :selectedEventId="selectedEventId"
              :tagManagementData="tagManagementData"
              :theme="theme"
              @select="openModal"
              @filter-change="handleSafeShipFilterChange"
            />
          </div>
        </div>

        <!-- 特攻情報（右側） -->
        <div class="attack-container flex-1 flex flex-col" ref="attackContainerRef">
             <TableTitle v-if="selectedEventId" title="海域特攻情報" type="attack" />
          <div v-if="selectedEventId" class="p-1 pb-0">
            <div class="flex items-center mb-1 flex-nowrap" style="min-height: 44px;">
              <button
                @click="handleToggleSortMode"
                class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap mr-2"
              >
                {{ attackSortByMode === 'area' ? '札で並べ替え' : '海域で並べ替え' }}
              </button>
              <button
                @click="handleToggleAllStages"
                class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap"
              >
                {{ attackIsAllExpanded ? '全格納' : '全展開' }}
              </button>
            </div>
          </div>
          <div class="flex-grow">
            <AttackTable
              v-if="selectedEventId"
              :filteredUniqueOrigs="tagFilterActive ? filteredShipsFromTagTable : shipsToDisplay"
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

    <!-- フッター -->
    <footer class="bg-gray-50 border-t border-gray-300 py-4 px-6 text-center">
      <div class="text-xs text-gray-500 space-y-1">
        <p>本サイトは、ゲーム内イベントの攻略支援を目的とした非公式サイトです。</p>
        <p>バナー等ゲーム内で使用されている画像は、著作権法第32条に基づき、説明・識別のために必要最小限の範囲で引用しています。</p>
        <p>画像の著作権は、DMM GAMES様および原著作物の権利者に帰属します。</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import { Ship } from '@/types/interfaces'
import ShipFilterTabs from './components/ship/ShipFilterTabs.vue'
import TableTitle from './components/common/TableTitle.vue'
import ShipListTable from './components/ship/ShipListTable.vue'
import ShipModal from './components/ship/ShipModal.vue'
import AttackTable from './components/attack/AttackTable.vue'
import TagManageTable from './components/tag-manage/TagManageTable.vue'
import EventSelect from './components/eventselect/EventSelect.vue'
import ThemeSelector from './components/theme/ThemeSelector.vue'
import { useTheme } from '@/composables/useTheme'
import { useShips } from '@/composables/useShips'
import { useTagManagement } from '@/composables/useTagManagement'

export default defineComponent({
  components: {
    ShipFilterTabs,
    TableTitle,
    ShipListTable,
    ShipModal,
    AttackTable,
    TagManageTable,
    EventSelect,
    ThemeSelector
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
      filteredShipsFromSearch,
      isSearchActive
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
    const { tagManagementData, stageOptions, stageTagMap, tagMap, updateTagManagement } = useTagManagement(selectedEventId, uniqueOrigs)

    // Store filtered ships from tag management table
    const filteredShipsFromTagTable = ref<Ship[]>([])
    const tagFilterActive = ref(false)

    const handleTagFilterChange = (filteredShips: Ship[], isFiltering: boolean) => {
      filteredShipsFromTagTable.value = filteredShips
      tagFilterActive.value = isFiltering
    }

    // Loop prevention: Only update if IDs change or length changes
    const handleSafeShipFilterChange = (filtered: Ship[], isActive: boolean) => {
      // If active state changes, update immediately
      if (isSearchActive.value !== isActive) {
        handleShipFilterChange(filtered, isActive)
        return
      }

      // If length differs, update
      if (filteredShipsFromSearch.value.length !== filtered.length) {
        handleShipFilterChange(filtered, isActive)
        return
      }

      // Check for ID mismatch (order matters if we want to preserve sort?
      // Actually ShipListTable output determines 'filteredShipsFromSearch'.
      // If we want to accept Sorted feedback, we should allow order change?
      // If Input changes order, Output changes order.
      // If we update 'filteredShipsFromSearch', AttackTable updates.
      // So yes, we should allow order updates but ensure stability.

      // Optimized check: Compare IDs manually to avoid JSON.stringify overhead
      const currentShips = filteredShipsFromSearch.value
      const len = currentShips.length

      for (let i = 0; i < len; i++) {
        if (currentShips[i].orig !== filtered[i].orig) {
          handleShipFilterChange(filtered, isActive)
          return
        }
      }
    }

    const handleDisplayModeChange = (mode: 'detail' | 'nameOnly') => {
      shipListDisplayMode.value = mode
    }

    const tagManageDisplayMode = ref<'detail' | 'checkOnly'>('detail')
    const handleTagManageDisplayModeChange = (mode: 'detail' | 'checkOnly') => {
      tagManageDisplayMode.value = mode
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
      stageTagMap,
      tagMap,
      updateTagManagement,
      filteredShipsFromTagTable,
      tagFilterActive,
      handleTagFilterChange,
      filteredShipsFromSearch,
      isSearchActive,
      handleSafeShipFilterChange,
      tagManageDisplayMode,
      handleTagManageDisplayModeChange,
      finalShips: computed(() => {
        // If sorting is active (via AttackTable), use the sorted list.
        if (sortedShipsFromAttackTable.value.length > 0) {
          return sortedShipsFromAttackTable.value
        }
        // If sorted list is empty but tag filter is active, it means the filter matched 0 items.
        // In this case we should return empty list.
        if (tagFilterActive.value) {
          return []
        }
        // Fallback to base display list (Search + Category Filter)
        return shipsToDisplay.value
      })
    }
  },
})
</script>

<style>
@import '@/assets/zoom-responsive.css';

.main-content {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap; /* Prevent wrapping - always horizontal */
}

/* Set minimum widths for each container to prevent overlap */
.tag-manage-container {
  min-width: 390px; /* 80 + 60 + 100 + 150 columns */
}
.tag-manage-container.check-only {
  min-width: 140px; /* 60 + 60 + padding */
}

.list-container {
  min-width: 160px; /* Name only mode minimum */
}

.list-container.flex-1 {
  min-width: 560px; /* Detail mode minimum (60 + 120 + 160 + 165 + 55) */
}

.attack-container {
  flex: 1;
  min-width: 400px; /* Minimum width for attack table */
}
</style>
