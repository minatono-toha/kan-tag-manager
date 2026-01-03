<template>
  <div>
    <div v-if="loading">読み込み中...</div>
    <table v-else class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100 sticky top-0 z-50">
        <tr>
          <th v-if="displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px', boxSizing: 'border-box' }" class="border text-left align-top bg-gray-100">図鑑ID</th>
          <th v-if="displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '120px', minWidth: '120px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="shipTypeFilter.length > 0 ? 'bg-gray-300' : 'bg-gray-100'">
            <div>艦種</div>
            <span
              @click="toggleShipTypeFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="shipTypeIconRef"
            >
              <svg v-if="shipTypeFilter.length === 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
            </span>
          </th>
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
          <th v-if="displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '165px', minWidth: '165px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="classSearchQuery.trim() ? 'bg-gray-300' : 'bg-gray-100'">
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
          <th v-if="displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '55px', minWidth: '55px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="speedFilterValue ? 'bg-gray-300' : 'bg-gray-100'">
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
          v-memo="[
            ship.orig,
            ship.shipIndex,
            ship.ownershipCount,
            getDisplayShip(ship).id,
            displayMode,
            theme,
            getRowClass(ship.orig, ship.shipIndex)
          ]"
          :style="{ ...rowStyle, ...rowBoxSizing }"
          class="hover:bg-gray-100"
          :class="getRowClass(ship.orig, ship.shipIndex)"
        >
          <td v-if="displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.libraryId }}</td>
          <td v-if="displayMode === 'detail'" :style="cellStyle" class="border">{{ getDisplayShip(ship).shipType }}</td>
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
                 <div class="cursor-pointer flex-grow" @click.stop="openModal(ship.orig, ship.shipIndex)">
                    <span :class="{ 'line-through text-gray-400': ship.ownershipCount === 0 }">
                      {{ getDisplayShip(ship).name }}
                    </span>
                    <span v-if="ship.ownershipCount === 0" class="text-gray-400 text-xs ml-1">(0隻:未着任)</span>
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
          <td v-if="displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.class }}</td>
          <td v-if="displayMode === 'detail'" :style="cellStyle" class="border">{{ ship.speed }}</td>
        </tr>
        <tr v-if="filteredShips.length === 0">
          <td :colspan="displayMode === 'detail' ? 5 : 1" :style="cellStyle" class="border text-center py-4 text-gray-500">
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

    <FilterPopup
      :show="showShipTypeFilter"
      :position="shipTypeFilterPosition"
      type="checkbox"
      title="艦種で絞り込み"
      :modelValue="shipTypeFilter"
      :options="uniqueShipTypes"
      @apply="(value) => { shipTypeFilter = value as string[]; showShipTypeFilter = false }"
      @clear="() => { shipTypeFilter = []; showShipTypeFilter = false }"
      @close="showShipTypeFilter = false"
      ref="shipTypePopupRef"
    />

    <!-- Variant Selection Popup -->
    <div
      v-if="showVariantPopup"
      class="fixed z-[100] bg-white border border-gray-300 shadow-lg rounded p-2 text-sm max-h-60 overflow-y-auto"
      :style="{ top: `${variantPopupPosition.y}px`, left: `${variantPopupPosition.x}px` }"
      ref="variantPopupRef"
      @click.stop
    >
      <div
        v-for="variant in currentVariants"
        :key="variant.id"
        class="cursor-pointer hover:bg-gray-100 p-1 rounded whitespace-nowrap focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        tabindex="0"
        @click="selectVariant(variant)"
        @keydown.enter="selectVariant(variant)"
        @keydown.space.prevent="selectVariant(variant)"
      >
        {{ variant.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
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
  allShips?: Ship[]
  variantMap: Map<string, number>
  showUnownedShips: boolean
}>(), {
  theme: 'light',
  allShips: () => []
})

const emit = defineEmits<{
  (e: 'select', orig: number, shipIndex: number): void
  (e: 'filter-change', filteredShips: ExpandedShip[], isFiltering: boolean): void
  (e: 'increment-ship', orig: number): void
  (e: 'decrement-ship', orig: number): void
  (e: 'update-variant', orig: number, shipIndex: number, variantId: number): void
}>()

function openModal(orig: number, shipIndex: number) {
  emit('select', orig, shipIndex)
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

const showShipTypeFilter = ref(false)
const shipTypeFilter = ref<string[]>([])
const shipTypeFilterPosition = ref({ x: 0, y: 0 })
const shipTypeIconRef = ref<HTMLElement | null>(null)
const shipTypePopupRef = ref<HTMLElement | null>(null)

const closeAllPopups = () => {
  showSearchInput.value = false
  showClassSearchInput.value = false
  showSpeedFilter.value = false
  showShipTypeFilter.value = false
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

function toggleShipTypeFilter(event: MouseEvent) {
  const willOpen = !showShipTypeFilter.value
  if (willOpen) closeAllPopups()
  showShipTypeFilter.value = willOpen

  if (showShipTypeFilter.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    shipTypeFilterPosition.value = {
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
const currentTarget = ref<{ orig: number; shipIndex: number } | null>(null)

const getDisplayShip = (ship: ExpandedShip): Ship => {
  const key = `${ship.orig}_${ship.shipIndex}`
  const variantId = props.variantMap.get(key)
  if (variantId) {
    const variant = props.allShips.find(s => s.id === variantId)
    if (variant) return variant
  }
  return ship
}

const toggleVariantPopup = (event: MouseEvent, ship: ExpandedShip) => {
  const isSameTarget = currentTarget.value?.orig === ship.orig && currentTarget.value?.shipIndex === ship.shipIndex
  const willOpen = !showVariantPopup.value || !isSameTarget

  if (willOpen) {
    closeAllPopups()

    // Set target
    currentTarget.value = { orig: ship.orig, shipIndex: ship.shipIndex }

    // Find variants
    const variants = props.allShips.filter(s => s.orig === ship.orig)
      .sort((a, b) => a.updateLevel - b.updateLevel)

    if (variants.length === 0) {
      currentVariants.value = [ship]
    } else {
      currentVariants.value = variants
    }

    // Position
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    variantPopupPosition.value = {
      x: rect.right + 5,
      y: rect.top
    }

    // Adjust if off screen
    if (variantPopupPosition.value.x + 150 > window.innerWidth) {
        variantPopupPosition.value.x = rect.left - 150
    }

    showVariantPopup.value = true
  } else {
    showVariantPopup.value = false
    currentTarget.value = null
  }
}

const selectVariant = (variant: Ship) => {
  if (currentTarget.value) {
    emit('update-variant', currentTarget.value.orig, currentTarget.value.shipIndex, variant.id)
  }
  showVariantPopup.value = false
  currentTarget.value = null
}

// Close popup when clicking outside

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement

  if (showSearchInput.value && searchPopupRef.value) {
    const clickedIcon = searchIconRef.value?.contains(target)
    const clickedPopup = (searchPopupRef.value as any).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSearchInput.value = false
    }
  }

  if (showClassSearchInput.value && classSearchPopupRef.value) {
    const clickedIcon = classSearchIconRef.value?.contains(target)
    const clickedPopup = (classSearchPopupRef.value as any).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showClassSearchInput.value = false
    }
  }

  if (showSpeedFilter.value && speedPopupRef.value) {
    const clickedIcon = speedIconRef.value?.contains(target)
    const clickedPopup = (speedPopupRef.value as any).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSpeedFilter.value = false
    }
  }

  if (showShipTypeFilter.value && shipTypePopupRef.value) {
    const clickedIcon = shipTypeIconRef.value?.contains(target)
    const clickedPopup = (shipTypePopupRef.value as any).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showShipTypeFilter.value = false
    }
  }

  if (showVariantPopup.value && variantPopupRef.value) {
     if (!variantPopupRef.value.contains(target)) {
        showVariantPopup.value = false
     }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (event: KeyboardEvent) => {
  if (showVariantPopup.value && variantPopupRef.value) {
    if (event.key === 'Escape') {
      showVariantPopup.value = false
    } else if (event.key === 'Tab') {
      const focusable = Array.from(variantPopupRef.value.querySelectorAll('[tabindex="0"]')) as HTMLElement[]
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
  }
}

watch(showVariantPopup, (newShow) => {
  if (newShow) {
    document.addEventListener('keydown', handleKeydown)
    setTimeout(() => {
      if (variantPopupRef.value) {
        const first = variantPopupRef.value.querySelector('[tabindex="0"]') as HTMLElement
        first?.focus()
      }
    }, 0)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

const emptyStateMessage = computed(() => {
  if (!props.hasFiltersSelected) {
    return '艦種を選択してください'
  }
  return '該当なし'
})

const uniqueShipTypes = computed(() => {
  const types = new Set<string>()
  props.ships.forEach(ship => {
    const displayShip = getDisplayShip(ship)
    if (displayShip.shipType) {
      types.add(displayShip.shipType)
    }
  })
  return Array.from(types).sort()
})

const filteredShips = computed(() => {
  const hasNameFilter = searchQuery.value.trim()
  const hasClassFilter = classSearchQuery.value.trim()
  const hasSpeedFilter = speedFilterValue.value
  const hasShipTypeFilter = shipTypeFilter.value.length > 0
  const hasUnownedFilter = !props.showUnownedShips

  if (!hasNameFilter && !hasClassFilter && !hasSpeedFilter && !hasShipTypeFilter && !hasUnownedFilter) {
    return props.ships
  }

  const nameQuery = hasNameFilter ? searchQuery.value.toLowerCase() : ''
  const classQuery = hasClassFilter ? classSearchQuery.value.toLowerCase() : ''

  return props.ships.filter(ship => {
    if (hasUnownedFilter && ship.ownershipCount === 0) {
      return false
    }

    const displayShip = getDisplayShip(ship)

    if (hasNameFilter) {
      const nameMatch = displayShip.name.toLowerCase().includes(nameQuery)
      const kanaMatch = displayShip.read_kana?.toLowerCase().includes(nameQuery) ?? false
      const kataMatch = displayShip.read_kata?.toLowerCase().includes(nameQuery) ?? false
      const romaji1Match = displayShip.read_romaji1?.toLowerCase().includes(nameQuery) ?? false
      const romaji2Match = displayShip.read_romaji2?.toLowerCase().includes(nameQuery) ?? false

      if (!nameMatch && !kanaMatch && !kataMatch && !romaji1Match && !romaji2Match) {
        return false
      }
    }
    if (hasClassFilter && !displayShip.class.toLowerCase().includes(classQuery)) {
      return false
    }
    if (hasSpeedFilter && displayShip.speed !== speedFilterValue.value) {
      return false
    }
    if (hasShipTypeFilter && !shipTypeFilter.value.includes(displayShip.shipType)) {
      return false
    }
    return true
  })
})

watchDebounced(
  filteredShips,
  (newFilteredShips) => {
    const isFiltering = !!(searchQuery.value.trim() || classSearchQuery.value.trim() || speedFilterValue.value || shipTypeFilter.value.length > 0 || !props.showUnownedShips)
    emit('filter-change', newFilteredShips, isFiltering)
  },
  { debounce: 150, maxWait: 300 }
)

const getRowClass = (orig: number, shipIndex: number) => {
  const key = `${orig}_${shipIndex}`
  const tagData = props.tagManagementData.get(key)
  if (!tagData) return ''

  if (tagData.assigned) {
    if (props.theme === 'dark' || props.theme === 'gradient') {
      return 'row-assigned-dark'
    }
    return 'row-assigned-light'
  }

  if (tagData.preserve) {
    if (props.theme === 'dark' || props.theme === 'gradient') {
      return 'row-preserve-dark'
    }
    return 'row-preserve-light'
  }

  return ''
}

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

.row-assigned-light {
  background-color: #e5e7eb;
}
.row-assigned-dark {
  background-color: #4b5563 !important;
  color: #f3f4f6 !important;
}

.row-preserve-light {
  background-color: #dbeafe;
}
.row-preserve-dark {
  background-color: #1e40af !important;
  color: #dbeafe !important;
}
</style>
