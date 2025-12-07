<template>
  <div>
    <div v-if="loading">読み込み中...</div>
    <table v-else class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px', boxSizing: 'border-box' }" class="border text-left align-top">図鑑ID</th>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '80px', minWidth: '80px', boxSizing: 'border-box' }" class="border text-left align-top">艦種</th>
          <th :style="{ ...cellStyle, ...headerStyle, width: '160px', minWidth: '160px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="{ 'bg-gray-300': searchQuery.trim() }">
            <div>艦名</div>
            <span
              @click="toggleSearch($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="検索"
              ref="searchIconRef"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </th>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '160px', minWidth: '160px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="{ 'bg-gray-300': classSearchQuery.trim() }">
            <div>艦型・艦番</div>
            <span
              @click="toggleClassSearch($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="検索"
              ref="classSearchIconRef"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </th>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="{ 'bg-gray-300': speedFilterValue }">
            <div>速力</div>
            <span
              @click="toggleSpeedFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="speedIconRef"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ship in filteredShips"
          :key="ship.id"
          :style="{ ...rowStyle, ...getRowBackgroundStyle(ship.orig), height: `${TABLE_STYLE.rowHeight}px`, boxSizing: 'border-box' }"
          class="hover:bg-gray-100 cursor-pointer"
          @click="openModal(ship.orig)"
        >
          <td v-if="props.displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.libraryId }}</td>
          <td v-if="props.displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.shipType }}</td>
          <td :style="cellStyle" class="border">{{ ship.name }}</td>
          <td v-if="props.displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.class }}</td>
          <td v-if="props.displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.speed }}</td>
        </tr>
        <tr v-if="filteredShips.length === 0">
          <td :colspan="props.displayMode === 'detail' ? 5 : 1" :style="cellStyle" class="border text-center py-4 text-gray-500">
            {{ emptyStateMessage }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Name search popup -->
    <div
      v-if="showSearchInput"
      ref="searchPopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-50"
      :style="{ top: searchPopupPosition.y + 'px', left: searchPopupPosition.x + 'px' }"
      @click.stop
    >
      <div class="font-bold mb-2">艦名で検索</div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="艦名を入力..."
        class="w-full px-2 py-1 border border-gray-300 rounded mb-2"
        autofocus
      />
      <button
        @click="clearSearch"
        class="text-sm text-blue-600 hover:underline"
      >
        クリア
      </button>
    </div>

    <!-- Class search popup -->
    <div
      v-if="showClassSearchInput"
      ref="classSearchPopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-50"
      :style="{ top: classSearchPopupPosition.y + 'px', left: classSearchPopupPosition.x + 'px' }"
      @click.stop
    >
      <div class="font-bold mb-2">艦型・艦番で検索</div>
      <input
        v-model="classSearchQuery"
        type="text"
        placeholder="艦型・艦番を入力..."
        class="w-full px-2 py-1 border border-gray-300 rounded mb-2"
        autofocus
      />
      <button
        @click="clearClassSearch"
        class="text-sm text-blue-600 hover:underline"
      >
        クリア
      </button>
    </div>

    <!-- Speed filter popup -->
    <div
      v-if="showSpeedFilter"
      ref="speedPopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-50"
      :style="{ top: speedFilterPosition.y + 'px', left: speedFilterPosition.x + 'px' }"
      @click.stop
    >
      <div class="font-bold mb-2">速力で絞り込み</div>
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            value="低"
            v-model="speedFilterValue"
            class="mr-2"
          />
          <span>低</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            value="高"
            v-model="speedFilterValue"
            class="mr-2"
          />
          <span>高</span>
        </label>
        <button
          @click="clearSpeedFilter"
          class="mt-2 text-sm text-blue-600 hover:underline"
        >
          クリア
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { Ship, TagManagement } from '@/types/interfaces'
import { TABLE_STYLE } from '@/constants/tableStyle'

const props = defineProps<{
  ships: Ship[]
  loading?: boolean
  targetHeaderHeight?: number
  hasFiltersSelected: boolean
  displayMode: 'detail' | 'nameOnly'
  selectedEventId: number | null
  tagManagementData: Map<number, TagManagement>
}>()

const emit = defineEmits<{
  (e: 'select', orig: number): void
  (e: 'filter-change', filteredShips: Ship[], isFiltering: boolean): void
}>()

function openModal(orig: number) {
  emit('select', orig)
}

const showSearchInput = ref(false)
const searchQuery = ref('')
const searchPopupPosition = ref({ x: 0, y: 0 })
const searchIconRef = ref<HTMLElement | null>(null)
const searchPopupRef = ref<HTMLElement | null>(null)

function toggleSearch(event: MouseEvent) {
  event.stopPropagation()
  showSearchInput.value = !showSearchInput.value
  if (showSearchInput.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    searchPopupPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

function clearSearch() {
  searchQuery.value = ''
  showSearchInput.value = false
}

const showClassSearchInput = ref(false)
const classSearchQuery = ref('')
const classSearchPopupPosition = ref({ x: 0, y: 0 })
const classSearchIconRef = ref<HTMLElement | null>(null)
const classSearchPopupRef = ref<HTMLElement | null>(null)

function toggleClassSearch(event: MouseEvent) {
  event.stopPropagation()
  showClassSearchInput.value = !showClassSearchInput.value
  if (showClassSearchInput.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    classSearchPopupPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

function clearClassSearch() {
  classSearchQuery.value = ''
  showClassSearchInput.value = false
}

const showSpeedFilter = ref(false)
const speedFilterValue = ref('')
const speedFilterPosition = ref({ x: 0, y: 0 })
const speedIconRef = ref<HTMLElement | null>(null)

function toggleSpeedFilter(event: MouseEvent) {
  event.stopPropagation()
  showSpeedFilter.value = !showSpeedFilter.value
  if (showSpeedFilter.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    speedFilterPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

function clearSpeedFilter() {
  speedFilterValue.value = ''
  showSpeedFilter.value = false
}

// Close popup when clicking outside
const speedPopupRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement

  // Handle Name Search Popup
  if (showSearchInput.value && searchPopupRef.value) {
    const clickedIcon = searchIconRef.value?.contains(target)
    const clickedPopup = searchPopupRef.value.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSearchInput.value = false
    }
  }

  // Handle Class Search Popup
  if (showClassSearchInput.value && classSearchPopupRef.value) {
    const clickedIcon = classSearchIconRef.value?.contains(target)
    const clickedPopup = classSearchPopupRef.value.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showClassSearchInput.value = false
    }
  }

  // Handle Speed Filter Popup
  if (showSpeedFilter.value && speedPopupRef.value) {
    const clickedIcon = speedIconRef.value?.contains(target)
    const clickedPopup = speedPopupRef.value.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSpeedFilter.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const emptyStateMessage = computed(() => {
  if (!props.hasFiltersSelected) {
    return '艦種を選択してください'
  }
  return '該当なし'
})

const filteredShips = computed(() => {
  // Single-pass filter for better performance
  const hasNameFilter = searchQuery.value.trim()
  const hasClassFilter = classSearchQuery.value.trim()
  const hasSpeedFilter = speedFilterValue.value

  // If no filters active, return original array
  if (!hasNameFilter && !hasClassFilter && !hasSpeedFilter) {
    return props.ships
  }

  // Prepare filter values once
  const nameQuery = hasNameFilter ? searchQuery.value.toLowerCase() : ''
  const classQuery = hasClassFilter ? classSearchQuery.value.toLowerCase() : ''

  // Single pass through the array
  return props.ships.filter(ship => {
    // Apply name filter
    if (hasNameFilter && !ship.name.toLowerCase().includes(nameQuery)) {
      return false
    }
    // Apply class filter
    if (hasClassFilter && !ship.class.toLowerCase().includes(classQuery)) {
      return false
    }
    // Apply speed filter
    if (hasSpeedFilter && ship.speed !== speedFilterValue.value) {
      return false
    }
    return true
  })
})

// Debounced watch to reduce parent update frequency
// Debounced watch to reduce parent update frequency
watchDebounced(
  filteredShips,
  (newFilteredShips) => {
    const isFiltering = !!(searchQuery.value.trim() || classSearchQuery.value.trim() || speedFilterValue.value)
    emit('filter-change', newFilteredShips, isFiltering)
  },
  { debounce: 150, maxWait: 300 }
)

// Get row background style based on tag flags
const getRowBackgroundStyle = (orig: number) => {
  // Access reactive tagManagementData directly from props (Vue unwraps refs)
  const tagData = props.tagManagementData.get(orig)

  // If no tag data, return default
  if (!tagData) return {}

  // Assigned flag takes priority
  if (tagData.assigned) {
    return { backgroundColor: '#e5e7eb' } // gray-200
  }

  // Preserve flag
  if (tagData.preserve) {
    return { backgroundColor: '#dbeafe' } // blue-100
  }

  // Default (no special background)
  return {}
}

const rowStyle = {
  height: `${TABLE_STYLE.rowHeight}px`,
  fontSize: TABLE_STYLE.fontSize,
}

const cellStyle = {
  padding: TABLE_STYLE.padding,
  whiteSpace: TABLE_STYLE.whiteSpace,
}

const headerStyle = computed(() => ({
  height: props.targetHeaderHeight ? `${props.targetHeaderHeight}px` : `${TABLE_STYLE.headerHeight}px`,
  fontSize: TABLE_STYLE.fontSize,
}))
</script>

<style scoped></style>
