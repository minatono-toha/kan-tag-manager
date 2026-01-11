<template>
  <div>
    <div v-if="loading">読み込み中...</div>
    <table v-else class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100 sticky top-0 z-10">
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
              <SearchIcon v-if="shipTypeFilter.length === 0" />
              <FilterIcon v-else />
            </span>
          </th>
          <th :style="{ ...cellStyle, ...headerStyle, width: '250px', minWidth: '250px', boxSizing: 'border-box' }" class="border text-left align-top relative pb-6" :class="searchQuery.trim() ? 'bg-gray-300' : 'bg-gray-100'">
            <div>艦名</div>
            <span
              @click="toggleSearch($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="検索"
              ref="searchIconRef"
            >
              <SearchIcon v-if="!searchQuery.trim()" />
              <FilterIcon v-else />
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
              <SearchIcon v-if="!classSearchQuery.trim()" />
              <FilterIcon v-else />
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
              <SearchIcon v-if="!speedFilterValue" />
              <FilterIcon v-else />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ship in ships"
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
      class="fixed z-[100] shadow-lg rounded p-2 text-sm max-h-60 overflow-y-auto border"
      :class="popupContainerClass"
      :style="{ top: `${variantPopupPosition.y}px`, left: `${variantPopupPosition.x}px` }"
      ref="variantPopupRef"
      @click.stop
    >
      <div
        v-for="variant in currentVariants"
        :key="variant.id"
        class="cursor-pointer p-1 rounded whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-blue-500"
        :class="[
          popupItemClass,
          { 'opacity-50 cursor-not-allowed': currentTarget && isVariantDisabled(getDisplayShip(currentTarget.ship).name, variant.name) }
        ]"
        :title="currentTarget && isVariantDisabled(getDisplayShip(currentTarget.ship).name, variant.name) ? '改装元と特攻倍率が異なるため、改装後の行を参照してください' : ''"
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
import SearchIcon from '@/components/common/SearchIcon.vue'
import FilterIcon from '@/components/common/FilterIcon.vue'
import { useFilterPopupManager } from '@/composables/useFilterPopup'
import { SP_ATTACK_EXCEPTION_SHIPS } from '@/components/attack/SPAttackException'

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
  sourceShips: ExpandedShip[]
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

// Filter popup management
const filterManager = useFilterPopupManager()

const searchPopup = filterManager.register()
const searchQuery = ref('')

const classSearchPopup = filterManager.register()
const classSearchQuery = ref('')

const speedPopup = filterManager.register()
const speedFilterValue = ref('')

const shipTypePopup = filterManager.register()
const shipTypeFilter = ref<string[]>([])

// Explicitly declare ref types for FilterPopup components
const searchPopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)
const classSearchPopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)
const speedPopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)
const shipTypePopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)

// Destructure for compatibility with existing template
const showSearchInput = searchPopup.show
const searchPopupPosition = searchPopup.position
const searchIconRef = searchPopup.iconRef

const showClassSearchInput = classSearchPopup.show
const classSearchPopupPosition = classSearchPopup.position
const classSearchIconRef = classSearchPopup.iconRef

const showSpeedFilter = speedPopup.show
const speedFilterPosition = speedPopup.position
const speedIconRef = speedPopup.iconRef

const showShipTypeFilter = shipTypePopup.show
const shipTypeFilterPosition = shipTypePopup.position
const shipTypeIconRef = shipTypePopup.iconRef

function toggleSearch(event: MouseEvent) {
  searchPopup.toggle(event)
}

function toggleClassSearch(event: MouseEvent) {
  classSearchPopup.toggle(event)
}

function toggleSpeedFilter(event: MouseEvent) {
  speedPopup.toggle(event)
}

function toggleShipTypeFilter(event: MouseEvent) {
  shipTypePopup.toggle(event)
}

// Helper to close all popups including variant popup
const closeAllPopups = () => {
  filterManager.closeAll()
  showVariantPopup.value = false
}

// Variant Selection Logic
const showVariantPopup = ref(false)
const variantPopupPosition = ref({ x: 0, y: 0 })
const variantPopupRef = ref<HTMLElement | null>(null)
const currentVariants = ref<Ship[]>([])
const currentTarget = ref<{ orig: number; shipIndex: number; ship: ExpandedShip } | null>(null)

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
    currentTarget.value = { orig: ship.orig, shipIndex: ship.shipIndex, ship }

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


const isVariantDisabled = (rowShipName: string, variantName: string): boolean => {
  // 例外リストに含まれる艦の場合、名称が部分一致しないバリエーションは選択不可とする
  if (SP_ATTACK_EXCEPTION_SHIPS.some(ex => rowShipName.includes(ex))) {
    return !variantName.includes(rowShipName)
  }
  return false
}

const selectVariant = (variant: Ship) => {
  if (currentTarget.value) {
    const rowShip = currentTarget.value.ship
    if (isVariantDisabled(getDisplayShip(rowShip).name, variant.name)) {
      return
    }
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
    const clickedPopup = searchPopupRef.value.popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSearchInput.value = false
    }
  }

  if (showClassSearchInput.value && classSearchPopupRef.value) {
    const clickedIcon = classSearchIconRef.value?.contains(target)
    const clickedPopup = classSearchPopupRef.value.popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showClassSearchInput.value = false
    }
  }

  if (showSpeedFilter.value && speedPopupRef.value) {
    const clickedIcon = speedIconRef.value?.contains(target)
    const clickedPopup = speedPopupRef.value.popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showSpeedFilter.value = false
    }
  }

  if (showShipTypeFilter.value && shipTypePopupRef.value) {
    const clickedIcon = shipTypeIconRef.value?.contains(target)
    const clickedPopup = shipTypePopupRef.value.popupRef?.contains(target)
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
    return props.sourceShips
  }

  const nameQuery = hasNameFilter ? searchQuery.value.toLowerCase() : ''
  const classQuery = hasClassFilter ? classSearchQuery.value.toLowerCase() : ''

  return props.sourceShips.filter(ship => {
    if (hasUnownedFilter && ship.ownershipCount === 0) {
      return false
    }

    const displayShip = getDisplayShip(ship)

    if (hasNameFilter) {
      const nameMatch = displayShip.name.toLowerCase().includes(nameQuery)
      const kanaMatch = ship.read_kana?.toLowerCase().includes(nameQuery) ?? false
      const kataMatch = ship.read_kata?.toLowerCase().includes(nameQuery) ?? false
      const romaji1Match = ship.read_romaji1?.toLowerCase().includes(nameQuery) ?? false
      const romaji2Match = ship.read_romaji2?.toLowerCase().includes(nameQuery) ?? false

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

const popupContainerClass = computed(() => {
  if (props.theme === 'dark' || props.theme === 'gradient') {
    return 'bg-gray-800 border-gray-600 text-gray-100'
  }
  return 'bg-white border-gray-300 text-gray-900'
})

const popupItemClass = computed(() => {
  if (props.theme === 'dark' || props.theme === 'gradient') {
    return 'hover:bg-gray-700 focus:bg-gray-700'
  }
  return 'hover:bg-gray-100 focus:bg-gray-100'
})
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
