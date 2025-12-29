<template>
  <div>
    <div v-if="loading">読み込み中...</div>
    <table v-else class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100 sticky top-0 z-50">
        <tr>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px', boxSizing: 'border-box' }" class="border text-left align-top bg-gray-100">図鑑ID</th>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '120px', minWidth: '120px', boxSizing: 'border-box' }" class="border text-left align-top bg-gray-100">艦種</th>
          <th :style="{ ...cellStyle, ...headerStyle, width: '210px', minWidth: '210px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="searchQuery.trim() ? 'bg-gray-300' : 'bg-gray-100'">
            <div>艦名</div>
            <span
              @click="toggleSearch($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="検索"
              ref="searchIconRef"
            >
              <svg v-if="!searchQuery.trim()" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
            </span>
          </th>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '165px', minWidth: '165px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="classSearchQuery.trim() ? 'bg-gray-300' : 'bg-gray-100'">
            <div>艦型・艦番</div>
            <span
              @click="toggleClassSearch($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="検索"
              ref="classSearchIconRef"
            >
              <svg v-if="!classSearchQuery.trim()" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
            </span>
          </th>
          <th v-if="props.displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '55px', minWidth: '55px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="speedFilterValue ? 'bg-gray-300' : 'bg-gray-100'">
            <div>速力</div>
            <span
              @click="toggleSpeedFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="speedIconRef"
            >
              <svg v-if="!speedFilterValue" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ship in filteredShips"
          :key="`${ship.orig}_${ship.shipIndex}`"
          :style="{ ...rowStyle, ...rowBoxSizing }"
          class="hover:bg-gray-100"
          :class="getRowClass(ship.orig, ship.shipIndex)"
        >
          <td v-if="props.displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.libraryId }}</td>
          <td v-if="props.displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.shipType }}</td>
          <td :style="cellStyle" class="border">
            <div class="flex items-center gap-2">
              <!-- Increment/Decrement buttons -->
              <div class="flex flex-row gap-1" @click.stop>
                <button
                  @click="incrementShip(ship.orig)"
                  class="w-[18px] h-5 flex items-center justify-center text-base font-bold text-gray-500 hover:text-gray-700 leading-none"
                  title="所持数+1"
                >+</button>
                <button
                  @click="decrementShip(ship.orig)"
                  class="w-[18px] h-5 flex items-center justify-center text-base font-bold text-gray-500 hover:text-gray-700 leading-none"
                  title="所持数-1"
                >-</button>
              </div>
              <!-- Ship name with ownership indicators -->
              <div class="flex-1 flex items-center justify-between">
                 <!-- Name Display -->
                 <div class="cursor-pointer flex-grow" @click.stop="openModal(ship.orig)">
                    <span :class="{ 'line-through text-gray-400': ship.ownershipCount === 0 }">
                      {{ getDisplayShip(ship).name }}
                    </span>
                    <span v-if="ship.ownershipCount === 0" class="text-gray-400 text-xs ml-1">(未着任)</span>
                    <span v-else-if="ship.shipIndex > 0" class="text-gray-400 text-xs ml-1">({{ ship.shipIndex + 1 }}隻目)</span>
                 </div>
                 <!-- Variant Selector Toggle -->
                 <span
                    @click.stop="toggleVariantPopup($event, ship)"
                    class="cursor-pointer text-gray-500 hover:text-gray-700 select-none text-xs w-6 h-5 flex items-center justify-center"
                    title="改装段階変更"
                 >▼</span>
              </div>
            </div>
          </td>
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

    <!-- Filter Popups using common component -->
    <FilterPopup
      :show="showSearchInput"
      :position="searchPopupPosition"
      type="input"
      title="艦名で検索"
      :modelValue="searchQuery"
      placeholder="艦名を入力..."
      @apply="(value) => { searchQuery = value as string; showSearchInput = false }"
      @clear="() => { searchQuery = ''; showSearchInput = false }"
      @close="showSearchInput = false"
      ref="searchPopupRef"
    />

    <FilterPopup
      :show="showClassSearchInput"
      :position="classSearchPopupPosition"
      type="input"
      title="艦型・艦番で検索"
      :modelValue="classSearchQuery"
      placeholder="艦型・艦番を入力..."
      @apply="(value) => { classSearchQuery = value as string; showClassSearchInput = false }"
      @clear="() => { classSearchQuery = ''; showClassSearchInput = false }"
      @close="showClassSearchInput = false"
      ref="classSearchPopupRef"
    />

    <FilterPopup
      :show="showSpeedFilter"
      :position="speedFilterPosition"
      type="radio"
      title="速力で絞り込み"
      :modelValue="speedFilterValue"
      :options="['低', '高']"
      @apply="(value) => { speedFilterValue = value as string; showSpeedFilter = false }"
      @clear="() => { speedFilterValue = ''; showSpeedFilter = false }"
      @close="showSpeedFilter = false"
      ref="speedPopupRef"
    />

    <!-- Variant Selection Popup -->
    <div
      v-if="showVariantPopup"
      class="fixed z-[100] bg-white border border-gray-300 shadow-lg rounded p-2 text-sm max-h-60 overflow-y-auto"
      :style="{ top: `${variantPopupPosition.y}px`, left: `${variantPopupPosition.x}px` }"
      ref="variantPopupRef"
    >
      <div
        v-for="variant in currentVariants"
        :key="variant.id"
        class="cursor-pointer hover:bg-gray-100 p-1 rounded whitespace-nowrap"
        @click="selectVariant(variant)"
      >
        {{ variant.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { Ship, ExpandedShip, TagManagement } from '@/types/interfaces'
import { TABLE_STYLE } from '@/constants/tableStyle'
import FilterPopup from '@/components/common/FilterPopup.vue'

const props = withDefaults(defineProps<{
  ships: ExpandedShip[]
  loading?: boolean
  targetHeaderHeight?: number
  hasFiltersSelected: boolean
  displayMode: 'detail' | 'nameOnly'
  selectedEventId: number | null
  tagManagementData: Map<string, TagManagement>
  theme?: 'light' | 'dark' | 'gradient'
  incrementShipCount?: (orig: number) => Promise<void>
  decrementShipCount?: (orig: number) => Promise<void>
  allShips?: Ship[]
}>(), {
  theme: 'light', // Default if not provided (though App always provides it)
  allShips: () => []
})

const emit = defineEmits<{
  (e: 'select', orig: number): void
  (e: 'filter-change', filteredShips: ExpandedShip[], isFiltering: boolean): void
  (e: 'increment-ship', orig: number): void
  (e: 'decrement-ship', orig: number): void
}>()

function openModal(orig: number) {
  emit('select', orig)
}

function incrementShip(orig: number) {
  emit('increment-ship', orig)
}

function decrementShip(orig: number) {
  emit('decrement-ship', orig)
}

const showSearchInput = ref(false)
const searchQuery = ref('')
const searchPopupPosition = ref({ x: 0, y: 0 })
const searchIconRef = ref<HTMLElement | null>(null)
const searchPopupRef = ref<HTMLElement | null>(null)

const showClassSearchInput = ref(false)
const classSearchQuery = ref('')
const classSearchPopupPosition = ref({ x: 0, y: 0 })
const classSearchIconRef = ref<HTMLElement | null>(null)
const classSearchPopupRef = ref<HTMLElement | null>(null)

const showSpeedFilter = ref(false)
const speedFilterValue = ref('')
const speedFilterPosition = ref({ x: 0, y: 0 })
const speedIconRef = ref<HTMLElement | null>(null)
const speedPopupRef = ref<HTMLElement | null>(null)

const closeAllPopups = () => {
  showSearchInput.value = false
  showClassSearchInput.value = false
  showSpeedFilter.value = false
  showVariantPopup.value = false
}

function toggleSearch(event: MouseEvent) {
  const willOpen = !showSearchInput.value
  if (willOpen) closeAllPopups()
  showSearchInput.value = willOpen

  if (showSearchInput.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    searchPopupPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

function toggleClassSearch(event: MouseEvent) {
  const willOpen = !showClassSearchInput.value
  if (willOpen) closeAllPopups()
  showClassSearchInput.value = willOpen

  if (showClassSearchInput.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    classSearchPopupPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

function toggleSpeedFilter(event: MouseEvent) {
  const willOpen = !showSpeedFilter.value
  if (willOpen) closeAllPopups()
  showSpeedFilter.value = willOpen

  if (showSpeedFilter.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    speedFilterPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

// Variant Selection Logic
const showVariantPopup = ref(false)
const variantPopupPosition = ref({ x: 0, y: 0 })
const variantPopupRef = ref<HTMLElement | null>(null)
const currentVariants = ref<Ship[]>([])
const currentTargetKey = ref<string>('')

// Map to store temporary display overrides: "orig_shipIndex" -> Ship
const displayOverrides = ref<Map<string, Ship>>(new Map())

const getDisplayShip = (ship: ExpandedShip): Ship => {
  const key = `${ship.orig}_${ship.shipIndex}`
  return displayOverrides.value.get(key) || ship
}

const toggleVariantPopup = (event: MouseEvent, ship: ExpandedShip) => {
  const willOpen = !showVariantPopup.value || currentTargetKey.value !== `${ship.orig}_${ship.shipIndex}`

  if (willOpen) {
    closeAllPopups()

    // Set target
    currentTargetKey.value = `${ship.orig}_${ship.shipIndex}`

    // Find variants
    const variants = props.allShips.filter(s => s.orig === ship.orig)
      .sort((a, b) => a.updateLevel - b.updateLevel)

    if (variants.length === 0) {
      // Fallback if allShips not provided or found
      currentVariants.value = [ship]
    } else {
      currentVariants.value = variants
    }

    // Position
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    variantPopupPosition.value = {
      x: rect.right + 5, // Position to the right of the button
      y: rect.top
    }

    // Adjust if off screen (simple check)
    if (variantPopupPosition.value.x + 150 > window.innerWidth) {
        variantPopupPosition.value.x = rect.left - 150
    }

    showVariantPopup.value = true
  } else {
    showVariantPopup.value = false
    currentTargetKey.value = ''
  }
}

const selectVariant = (variant: Ship) => {
  if (currentTargetKey.value) {
    displayOverrides.value.set(currentTargetKey.value, variant)
  }
  showVariantPopup.value = false
  currentTargetKey.value = ''
}

// Close popup when clicking outside

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement

  // Handle Name Search Popup
  if (showSearchInput.value && searchPopupRef.value) {
    const clickedIcon = searchIconRef.value?.contains(target)
    const clickedPopup = (searchPopupRef.value as any).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSearchInput.value = false
    }
  }

  // Handle Class Search Popup
  if (showClassSearchInput.value && classSearchPopupRef.value) {
    const clickedIcon = classSearchIconRef.value?.contains(target)
    const clickedPopup = (classSearchPopupRef.value as any).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showClassSearchInput.value = false
    }
  }

  // Handle Speed Filter Popup
  if (showSpeedFilter.value && speedPopupRef.value) {
    const clickedIcon = speedIconRef.value?.contains(target)
    const clickedPopup = (speedPopupRef.value as any).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSpeedFilter.value = false
    }
  }

  // Handle Variant Popup
  if (showVariantPopup.value && variantPopupRef.value) {
     if (!variantPopupRef.value.contains(target)) {
        // Also check if we clicked on a toggle button?
        // Actually the toggle logic handles self-clicks (willOpen check).
        // But if we click outside, we need to close.
        // We need to ensure we don't close if we just clicked the toggle button that opened it.
        // But checking !contains(popup) is usually enough if the toggle button is outside.
        // Wait, if I click the SAME toggle button, the toggle logic runs.
        // If I click ANYWHERE else, this runs.
        // So we should be careful not to double-close or interfere.
        // Simple approach: close if not in popup. The toggle button click will be handled by its own handler?
        // No, document click happens after.
        // So if I click the toggle button, it might toggle ON, then document click toggles OFF.
        // We should stop propagation on the toggle button click? Use @click.stop on the button.
        // The button has @click.stop.
        showVariantPopup.value = false
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
    // Apply name filter
    if (hasNameFilter) {
      const nameMatch = ship.name.toLowerCase().includes(nameQuery)
      const kanaMatch = ship.read_kana?.toLowerCase().includes(nameQuery) ?? false
      const kataMatch = ship.read_kata?.toLowerCase().includes(nameQuery) ?? false
      const romaji1Match = ship.read_romaji1?.toLowerCase().includes(nameQuery) ?? false
      const romaji2Match = ship.read_romaji2?.toLowerCase().includes(nameQuery) ?? false

      if (!nameMatch && !kanaMatch && !kataMatch && !romaji1Match && !romaji2Match) {
        return false
      }
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

// Get row class based on tag flags
const getRowClass = (orig: number, shipIndex: number) => {
  const key = `${orig}_${shipIndex}`
  const tagData = props.tagManagementData.get(key)
  if (!tagData) return ''

  // Assigned flag takes priority
  if (tagData.assigned) {
    if (props.theme === 'dark' || props.theme === 'gradient') {
      return 'row-assigned-dark'
    }
    return 'row-assigned-light'
  }

  // Preserve flag
  if (tagData.preserve) {
    if (props.theme === 'dark' || props.theme === 'gradient') {
      return 'row-preserve-dark'
    }
    return 'row-preserve-light'
  }

  return ''
}

// Static object for box-sizing
const rowBoxSizing: CSSProperties = { boxSizing: 'border-box' }

const rowStyle: CSSProperties = {
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

<style scoped>
/* Fix properties for Firefox sticky header compatibility */
table {
  border-collapse: separate !important;
  border-spacing: 0;
  border-top: 1px solid #d1d5db !important;
  border-left: 1px solid #d1d5db !important;
  border-right: 0 !important;
  border-bottom: 0 !important;
}

th, td {
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 1px solid #d1d5db !important;
  border-right: 1px solid #d1d5db !important;
  border-bottom: 1px solid #d1d5db !important;
}

/* Optimization: Row Highlight Classes */
.row-assigned-light {
  background-color: #e5e7eb; /* gray-200 */
}
.row-assigned-dark {
  background-color: #4b5563 !important; /* gray-600 */
  color: #f3f4f6 !important; /* gray-100 */
}

.row-preserve-light {
  background-color: #dbeafe; /* blue-100 */
}
.row-preserve-dark {
  background-color: #1e40af !important; /* blue-800 */
  color: #dbeafe !important; /* blue-100 */
}
</style>
