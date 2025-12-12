<template>
  <div>
      <div v-if="loading" class="p-4">読み込み中...</div>
      <table v-else class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100 sticky top-0 z-50" ref="theadRef">
        <tr>
          <th :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px' }" class="border text-left align-top relative pb-6" :class="assignedFilter !== null ? 'bg-gray-300' : 'bg-gray-100'">
            割当済
            <span
              @click="toggleAssignedFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="assignedIconRef"
            >
              <svg v-if="assignedFilter === null" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
            </span>
          </th>
          <th :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px' }" class="border text-left align-top relative pb-6" :class="preserveFilter !== null ? 'bg-gray-300' : 'bg-gray-100'">
            温存
            <span
              @click="togglePreserveFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="preserveIconRef"
            >
              <svg v-if="preserveFilter === null" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
            </span>
          </th>
          <th v-if="displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '100px', minWidth: '100px' }" class="border text-left align-top relative pb-6" :class="targetStageFilter.length > 0 ? 'bg-gray-300' : 'bg-gray-100'">
            割当先
            <span
              @click="toggleTargetStageFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="targetStageIconRef"
            >
              <svg v-if="targetStageFilter.length === 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
            </span>
          </th>
          <th v-if="displayMode === 'detail'" :style="{ ...cellStyle, ...headerStyle, width: '150px', minWidth: '150px' }" class="border text-left align-top relative pb-6" :class="commentFilter.length > 0 ? 'bg-gray-300' : 'bg-gray-100'">
            コメント
            <span
              @click="toggleCommentFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="commentIconRef"
            >
              <svg v-if="commentFilter.length === 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          v-for="ship in displayedShips"
          :key="ship.orig"
          :style="{ ...rowStyle, ...getRowBackgroundStyle(ship.orig), height: `${TABLE_STYLE.rowHeight}px`, boxSizing: 'border-box' }"
          class="hover:bg-gray-100"
        >
          <!-- 割当済 -->
          <td :style="cellStyle" class="border text-center cursor-pointer" @click="toggleAssigned(ship.orig)">
            <input
              type="checkbox"
              :checked="getTagData(ship.orig).assigned"
              class="pointer-events-none"
            />
          </td>
          <!-- 温存 -->
          <td :style="cellStyle" class="border text-center cursor-pointer" @click="togglePreserve(ship.orig)">
            <input
              type="checkbox"
              :checked="getTagData(ship.orig).preserve"
              class="pointer-events-none"
            />
          </td>
          <!-- 割当先 -->
          <td v-if="displayMode === 'detail'" :style="cellStyle" class="border text-center relative">
            <div
              class="w-full h-full px-1 py-0 text-sm border-0 bg-transparent cursor-pointer flex items-center justify-center min-h-[20px]"
              :style="{ fontSize: TABLE_STYLE.fontSize }"
              @click.stop="openStageSelector($event, ship.orig)"
            >
              {{ getTagData(ship.orig).targetStage || '-' }}
            </div>
          </td>
          <!-- コメント -->
          <td v-if="displayMode === 'detail'" :style="cellStyle" class="border">
            <input
              type="text"
              :value="getTagData(ship.orig).comment"
              @input="handleCommentChange(ship.orig, ($event.target as HTMLInputElement).value)"
              class="w-full px-1 py-0 text-sm border-0 bg-transparent"
              :style="{ fontSize: TABLE_STYLE.fontSize }"
              placeholder=""
            />
          </td>
        </tr>
        <tr v-if="displayedShips.length === 0">
          <td :colspan="displayMode === 'detail' ? 4 : 2" :style="cellStyle" class="border text-center py-4 text-gray-500">
            {{ emptyStateMessage }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Assigned Filter Popup -->
    <div
      v-if="showAssignedFilter"
      ref="assignedPopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-50"
      :style="{ top: assignedFilterPosition.y + 'px', left: assignedFilterPosition.x + 'px' }"
      @click.stop
    >
      <div class="font-bold mb-2">割当済で絞り込み</div>
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :value="true"
            v-model="tempAssignedFilter"
            class="mr-2"
          />
          <span>選択済</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :value="false"
            v-model="tempAssignedFilter"
            class="mr-2"
          />
          <span>未選択</span>
        </label>
        <div class="flex items-center justify-between mt-2">
          <button
            @click="clearAssignedFilter"
            class="text-xs text-gray-500 hover:underline"
          >
            クリア
          </button>
          <button
            @click="applyAssignedFilter"
            class="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Preserve Filter Popup -->
    <div
      v-if="showPreserveFilter"
      ref="preservePopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-50"
      :style="{ top: preserveFilterPosition.y + 'px', left: preserveFilterPosition.x + 'px' }"
      @click.stop
    >
      <div class="font-bold mb-2">温存で絞り込み</div>
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :value="true"
            v-model="tempPreserveFilter"
            class="mr-2"
          />
          <span>選択済</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :value="false"
            v-model="tempPreserveFilter"
            class="mr-2"
          />
          <span>未選択</span>
        </label>
        <div class="flex items-center justify-between mt-2">
          <button
            @click="clearPreserveFilter"
            class="text-xs text-gray-500 hover:underline"
          >
            クリア
          </button>
          <button
            @click="applyPreserveFilter"
            class="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Target Stage Filter Popup -->
    <div
      v-if="showTargetStageFilter"
      ref="targetStagePopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-50 max-h-80 overflow-y-auto"
      :style="{ top: targetStageFilterPosition.y + 'px', left: targetStageFilterPosition.x + 'px' }"
      @click.stop
    >
      <div class="font-bold mb-2">割当先で絞り込み</div>
      <div class="space-y-1">
        <label v-for="stage in uniqueTargetStages" :key="stage" class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            :value="stage"
            v-model="tempTargetStageFilter"
            class="mr-2"
          />
          <span class="text-sm font-normal">{{ stage }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            :value="''"
            v-model="tempTargetStageFilter"
            class="mr-2"
          />
          <span class="text-sm font-normal">(空白)</span>
        </label>
        <div class="flex items-center justify-between mt-2">
          <button
            @click="clearTargetStageFilter"
            class="text-xs text-gray-500 hover:underline"
          >
            クリア
          </button>
          <button
            @click="applyTargetStageFilter"
            class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Comment Filter Popup -->
    <div
      v-if="showCommentFilter"
      ref="commentPopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-50 max-h-80 overflow-y-auto"
      :style="{ top: commentFilterPosition.y + 'px', left: commentFilterPosition.x + 'px' }"
      @click.stop
    >
      <div class="font-bold mb-2">コメントで絞り込み</div>
      <div class="space-y-1">
        <label v-for="comment in uniqueComments" :key="comment" class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            :value="comment"
            v-model="tempCommentFilter"
            class="mr-2"
          />
          <span class="text-sm font-normal">{{ comment }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            :value="''"
            v-model="tempCommentFilter"
            class="mr-2"
          />
          <span class="text-sm font-normal">(空白)</span>
        </label>
        <div class="flex items-center justify-between mt-2">
          <button
            @click="clearCommentFilter"
            class="text-xs text-gray-500 hover:underline"
          >
            クリア
          </button>
          <button
            @click="applyCommentFilter"
            class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Stage Selection Popup (Cascading Style) -->
    <!-- Main Menu: List of Areas -->
    <div
      v-if="showStageSelectorPopup"
      ref="stageSelectorPopupRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded py-1 z-50 overflow-y-auto"
      :style="{ top: stageSelectorPosition.y + 'px', left: stageSelectorPosition.x + 'px', maxHeight: '300px', width: '120px' }"
      @click.stop
    >
      <div
        v-for="area in uniqueAreas"
        :key="area"
        class="px-2 py-1 cursor-pointer text-sm flex justify-between items-center relative group hover:bg-gray-100"
        @mouseenter="handleAreaHover($event, area)"
        @click="handleAreaClick($event, area)"
        :class="{ 'bg-gray-100': hoveredArea === area }"
      >
        <span>{{ area }}</span>
        <span class="text-gray-400 text-xs ml-2">▶</span>
      </div>
       <!-- Option to clear selection -->
       <div class="border-t my-1"></div>
       <div
          @click="applyStageSelection('')"
          class="px-2 py-1 cursor-pointer hover:bg-gray-100 text-gray-500 text-xs"
          @mouseenter="hoveredArea = null"
       >
          選択解除
       </div>
    </div>

    <!-- Sub Menu: List of Stages for Hovered Area -->
    <div
      v-if="showStageSelectorPopup && hoveredArea"
      ref="subMenuRef"
      class="fixed bg-white border border-gray-300 shadow-lg rounded py-1 z-[60] overflow-y-auto"
      :style="{ top: subMenuPosition.y + 'px', left: subMenuPosition.x + 'px', maxHeight: '300px', width: '140px' }"
      @click.stop
      @mouseenter="cancelCloseSubMenu"
    >
       <div
        v-for="stage in getStagesForArea(hoveredArea)"
        :key="stage"
        @click="applyStageSelection(stage)"
        class="px-2 py-1 cursor-pointer hover:bg-gray-100 text-sm"
      >
        {{ stage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Ship, TagManagement } from '@/types/interfaces'
import { TABLE_STYLE } from '@/constants/tableStyle'

const props = withDefaults(defineProps<{
  ships: Ship[]
  sourceShips: Ship[]
  selectedEventId: number | null
  loading?: boolean
  targetHeaderHeight?: number
  tagManagementData: Map<number, TagManagement>
  stageOptions: string[]
  updateTagManagement: (data: TagManagement) => Promise<void>
  displayMode?: 'detail' | 'checkOnly'
  theme?: 'light' | 'dark' | 'gradient'
}>(), {
  displayMode: 'detail',
  theme: 'light'
})

const emit = defineEmits<{
  (e: 'filter-change', filteredShips: Ship[], isFiltering: boolean): void
}>()

// Helper function to get tag data from the shared tagManagementData
const getTagData = (orig: number): TagManagement => {
  const existing = props.tagManagementData.get(orig)
  if (existing) return existing

  // Return default values
  return {
    eventId: props.selectedEventId || 0,
    orig,
    assigned: false,
    preserve: false,
    targetStage: '',
    comment: ''
  }
}

// Filter states
const assignedFilter = ref<boolean | null>(null)
const preserveFilter = ref<boolean | null>(null)
const targetStageFilter = ref<string[]>([])
const commentFilter = ref<string[]>([])

// Filter popup states
const showAssignedFilter = ref(false)
const showPreserveFilter = ref(false)
const showTargetStageFilter = ref(false)
const showCommentFilter = ref(false)

const assignedFilterPosition = ref({ x: 0, y: 0 })
const preserveFilterPosition = ref({ x: 0, y: 0 })
const targetStageFilterPosition = ref({ x: 0, y: 0 })
const commentFilterPosition = ref({ x: 0, y: 0 })

const assignedIconRef = ref<HTMLElement | null>(null)
const preserveIconRef = ref<HTMLElement | null>(null)
const targetStageIconRef = ref<HTMLElement | null>(null)
const commentIconRef = ref<HTMLElement | null>(null)

const assignedPopupRef = ref<HTMLElement | null>(null)
const preservePopupRef = ref<HTMLElement | null>(null)
const targetStagePopupRef = ref<HTMLElement | null>(null)
const commentPopupRef = ref<HTMLElement | null>(null)

// Stage Selector State
const showStageSelectorPopup = ref(false)
const stageSelectorPosition = ref({ x: 0, y: 0 })
const stageSelectorPopupRef = ref<HTMLElement | null>(null)
const subMenuRef = ref<HTMLElement | null>(null)
const editingShipOrig = ref<number | null>(null)
const hoveredArea = ref<string | null>(null)
const subMenuPosition = ref({ x: 0, y: 0 })

const theadRef = ref<HTMLElement | null>(null)

const emptyStateMessage = computed(() => {
  if (!props.selectedEventId) {
    return '海域を選択してください'
  }
  if (props.ships.length === 0) {
    return '-'
  }
  return '該当なし'
})

// Get unique target stages from all source ships (for filter options)
const uniqueTargetStages = computed(() => {
  const stages = new Set<string>()
  props.sourceShips.forEach(ship => {
    const data = getTagData(ship.orig)
    if (data.targetStage && data.targetStage.trim()) {
      stages.add(data.targetStage)
    }
  })
  return Array.from(stages).sort()
})

// Get unique comments from all source ships (for filter options)
const uniqueComments = computed(() => {
  const comments = new Set<string>()
  props.sourceShips.forEach(ship => {
    const data = getTagData(ship.orig)
    if (data.comment && data.comment.trim()) {
      comments.add(data.comment)
    }
  })
  return Array.from(comments).sort()
})

// Displayed ships (for the table UI)
const displayedShips = computed(() => {
  // We don't apply filters here because the parent component (App.vue)
  // is expected to pass the filtered list back to us as `props.ships`.
  // However, we might want to apply local display logic if needed.
  // For now, we trust props.ships is what we should display.
  // Wait, if we stop filtering locally for display, we break the immediate UI feedback loop?
  //
  // The architectural pattern we want is:
  // 1. TagManageTable calculates filters based on `sourceShips` and emits `filter-change`.
  // 2. App.vue receives `filter-change`, updates `filteredShipsFromTagTable`.
  // 3. App.vue passes `filteredShipsFromTagTable` (or potentially sorted version from AttackTable) back to `TagManageTable` as `props.ships`.
  //
  // So, `displayedShips` should strictly reflect `props.ships`.
  return props.ships
})

// Filtered ships for EMIT (based on sourceShips + local filters)
const filteredShipsForEmit = computed(() => {
  let result = props.sourceShips

  // Apply assigned filter
  if (assignedFilter.value !== null) {
    result = result.filter(ship => getTagData(ship.orig).assigned === assignedFilter.value)
  }

  // Apply preserve filter
  if (preserveFilter.value !== null) {
    result = result.filter(ship => getTagData(ship.orig).preserve === preserveFilter.value)
  }

  // Apply target stage filter
  if (targetStageFilter.value.length > 0) {
    result = result.filter(ship => {
      const data = getTagData(ship.orig)
      const stage = data.targetStage || ''
      return targetStageFilter.value.includes(stage)
    })
  }

  // Apply comment filter
  if (commentFilter.value.length > 0) {
    result = result.filter(ship => {
      const data = getTagData(ship.orig)
      const comment = data.comment || ''
      return commentFilter.value.includes(comment)
    })
  }

  return result
})

// Watch filteredShipsForEmit and emit changes to parent
watch(filteredShipsForEmit, (newFiltered) => {
  const isFiltering = assignedFilter.value !== null ||
                     preserveFilter.value !== null ||
                     targetStageFilter.value.length > 0 ||
                     commentFilter.value.length > 0
  emit('filter-change', newFiltered, isFiltering)
}, { immediate: true })

// Debounced update function
const debouncedUpdate = useDebounceFn((data: TagManagement) => {
  props.updateTagManagement(data)
}, 500)

// Toggle assigned checkbox by clicking the cell
const toggleAssigned = (orig: number) => {
  const current = getTagData(orig)
  const updated: TagManagement = {
    ...current,
    assigned: !current.assigned
  }
  debouncedUpdate(updated)
}

// Toggle preserve checkbox by clicking the cell
const togglePreserve = (orig: number) => {
  const current = getTagData(orig)
  const updated: TagManagement = {
    ...current,
    preserve: !current.preserve
  }
  debouncedUpdate(updated)
}

const handleTargetStageChange = (orig: number, value: string) => {
  const current = getTagData(orig)
  const updated: TagManagement = {
    ...current,
    targetStage: value
  }
  debouncedUpdate(updated)
}

const handleCommentChange = (orig: number, value: string) => {
  const current = getTagData(orig)
  const updated: TagManagement = {
    ...current,
    comment: value
  }
  debouncedUpdate(updated)
}

const tempAssignedFilter = ref<boolean | null>(null)
const tempPreserveFilter = ref<boolean | null>(null)
const tempTargetStageFilter = ref<string[]>([])
const tempCommentFilter = ref<string[]>([])

const closeAllPopups = () => {
  showAssignedFilter.value = false
  showPreserveFilter.value = false
  showTargetStageFilter.value = false
  showCommentFilter.value = false
  showStageSelectorPopup.value = false
}

// Filter popup controls
const toggleAssignedFilter = (event: MouseEvent) => {
  event.stopPropagation()
  const willOpen = !showAssignedFilter.value
  if (willOpen) closeAllPopups()
  showAssignedFilter.value = willOpen

  if (showAssignedFilter.value) {
    // Initialize temp value
    tempAssignedFilter.value = assignedFilter.value
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    assignedFilterPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

const togglePreserveFilter = (event: MouseEvent) => {
  event.stopPropagation()
  const willOpen = !showPreserveFilter.value
  if (willOpen) closeAllPopups()
  showPreserveFilter.value = willOpen

  if (showPreserveFilter.value) {
    // Initialize temp value
    tempPreserveFilter.value = preserveFilter.value
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    preserveFilterPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

const applyAssignedFilter = () => {
  assignedFilter.value = tempAssignedFilter.value
  showAssignedFilter.value = false
}

const applyPreserveFilter = () => {
  preserveFilter.value = tempPreserveFilter.value
  showPreserveFilter.value = false
}

const toggleTargetStageFilter = (event: MouseEvent) => {
  event.stopPropagation()
  const willOpen = !showTargetStageFilter.value
  if (willOpen) closeAllPopups()
  showTargetStageFilter.value = willOpen

  if (showTargetStageFilter.value) {
    tempTargetStageFilter.value = [...targetStageFilter.value]
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    targetStageFilterPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

const toggleCommentFilter = (event: MouseEvent) => {
  event.stopPropagation()
  const willOpen = !showCommentFilter.value
  if (willOpen) closeAllPopups()
  showCommentFilter.value = willOpen

  if (showCommentFilter.value) {
    tempCommentFilter.value = [...commentFilter.value]
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    commentFilterPosition.value = {
      x: rect.left,
      y: rect.bottom + 5
    }
  }
}

const applyTargetStageFilter = () => {
    targetStageFilter.value = [...tempTargetStageFilter.value]
    showTargetStageFilter.value = false
}

const applyCommentFilter = () => {
    commentFilter.value = [...tempCommentFilter.value]
    showCommentFilter.value = false
}

const clearAssignedFilter = () => {
  assignedFilter.value = null
  tempAssignedFilter.value = null
  showAssignedFilter.value = false
}

const clearPreserveFilter = () => {
  preserveFilter.value = null
  tempPreserveFilter.value = null
  showPreserveFilter.value = false
}

const clearTargetStageFilter = () => {
  targetStageFilter.value = []
  tempTargetStageFilter.value = []
  showTargetStageFilter.value = false
}

const clearCommentFilter = () => {
  commentFilter.value = []
  tempCommentFilter.value = []
  showCommentFilter.value = false
}

// Stage Selector Logic
const uniqueAreas = computed(() => {
  const areas = new Set<string>()
  props.stageOptions.forEach(stage => {
    // Determine Area from stage string (e.g. "E-2-1" -> "E-2", "E-7" -> "E-7")
    // Assumption: Format is "E-{Area}-{Map}" or "E-{Area}"
    const parts = stage.split('-')
    if (parts.length >= 2) {
      // "E" + "-" + "1" -> "E-1"
      const area = `${parts[0]}-${parts[1]}`
      areas.add(area)
    } else {
      // Fallback
      areas.add(stage)
    }
  })
  // Sort areas naturally
  return Array.from(areas).sort((a, b) => {
      const aNum = parseInt(a.replace('E-', '')) || 0
      const bNum = parseInt(b.replace('E-', '')) || 0
      return aNum - bNum
  })
})

const getStagesForArea = (area: string) => {
  return props.stageOptions.filter(stage => stage.startsWith(area))
}

const openStageSelector = (event: MouseEvent, orig: number) => {
  const willOpen = true
  closeAllPopups()

  if (willOpen) {
    editingShipOrig.value = orig
    showStageSelectorPopup.value = true
    hoveredArea.value = null

    // Improve positioning to prevent overflow
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()

    // Default: show below
    let top = rect.bottom + 5
    const left = rect.left

    // Check if bottom overflow (viewport height)
    const viewportHeight = window.innerHeight
    const estimatedHeight = 300
    if (top + estimatedHeight > viewportHeight) {
        // Show above
        top = rect.top - estimatedHeight - 5
    }

    stageSelectorPosition.value = {
      x: left,
      y: top
    }
  }
}

const handleAreaHover = (event: MouseEvent, area: string) => {
  hoveredArea.value = area

  // Calculate sub-menu position based on the hovered item
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  // Default: align top with item, place to the right
  const top = rect.top
  let left = rect.right

  // Adjust if overflow
  // We can't strictly know width/height of sub-menu yet, assume width ~140, height variable
  const viewportWidth = window.innerWidth
  if (left + 140 > viewportWidth) {
      // Place to the left if no room on right
      left = rect.left - 140
  }

  subMenuPosition.value = { x: left, y: top }
}

const handleAreaClick = (event: MouseEvent, area: string) => {
  // Mobile support: click behaves like hover
  handleAreaHover(event, area)
}

const cancelCloseSubMenu = () => {
   // Logic to keep menu open if needed
}

const applyStageSelection = (stage: string) => {
    if (editingShipOrig.value !== null) {
        handleTargetStageChange(editingShipOrig.value, stage)
    }
    showStageSelectorPopup.value = false
    editingShipOrig.value = null
    hoveredArea.value = null
}

// Close popups when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // Handle Assigned Filter Popup
  if (showAssignedFilter.value && assignedPopupRef.value) {
    const clickedIcon = assignedIconRef.value?.contains(target)
    const clickedPopup = assignedPopupRef.value.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showAssignedFilter.value = false
    }
  }

  // Handle Preserve Filter Popup
  if (showPreserveFilter.value && preservePopupRef.value) {
    const clickedIcon = preserveIconRef.value?.contains(target)
    const clickedPopup = preservePopupRef.value.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showPreserveFilter.value = false
    }
  }

  // Handle Target Stage Filter Popup
  if (showTargetStageFilter.value && targetStagePopupRef.value) {
    const clickedIcon = targetStageIconRef.value?.contains(target)
    const clickedPopup = targetStagePopupRef.value.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showTargetStageFilter.value = false
    }
  }

  // Handle Comment Filter Popup
  if (showCommentFilter.value && commentPopupRef.value) {
    const clickedIcon = commentIconRef.value?.contains(target)
    const clickedPopup = commentPopupRef.value.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showCommentFilter.value = false
    }
  }

  // Handle Stage Selector Popup
  if (showStageSelectorPopup.value) {
     let clickedInsideMain = false
     if (stageSelectorPopupRef.value) {
        clickedInsideMain = stageSelectorPopupRef.value.contains(target)
     }

     let clickedInsideSub = false
     if (subMenuRef.value) {
        clickedInsideSub = subMenuRef.value.contains(target)
     }

     if (!clickedInsideMain && !clickedInsideSub) {
      showStageSelectorPopup.value = false
      editingShipOrig.value = null
      hoveredArea.value = null
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Get row background style based on tag flags
const getRowBackgroundStyle = (orig: number) => {
  const tagData = getTagData(orig)

  // Assigned flag takes priority
  if (tagData.assigned) {
    if (props.theme === 'dark' || props.theme === 'gradient') {
      return { backgroundColor: '#4b5563', color: '#f3f4f6' } // gray-600, gray-100 text
    }
    return { backgroundColor: '#e5e7eb' } // gray-200
  }

  // Preserve flag
  if (tagData.preserve) {
    if (props.theme === 'dark' || props.theme === 'gradient') {
      return { backgroundColor: '#1e40af', color: '#dbeafe' } // blue-800, blue-100 text
    }
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
  border-bottom: 1px solid #d1d5db !important;
}

select:focus,
input:focus {
  outline: none;
}

input[type="checkbox"].pointer-events-none {
  pointer-events: none;
}
</style>
