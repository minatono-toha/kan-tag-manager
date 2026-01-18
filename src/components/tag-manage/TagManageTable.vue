<template>
  <div>
    <div v-if="loading" class="p-4">読み込み中...</div>
    <table
      v-else
      class="text-sm border-collapse border border-gray-300"
      :style="{ tableLayout: 'fixed', width: displayMode === 'detail' ? '410px' : '120px' }"
    >
      <thead class="bg-gray-100 sticky top-0 z-10" ref="theadRef">
        <tr>
          <th
            :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px' }"
            class="border text-left align-top relative pb-6"
            :class="assignedFilter !== null ? 'bg-gray-300' : 'bg-gray-100'"
          >
            割当済
            <span
              @click="toggleAssignedFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="assignedIconRef"
            >
              <SearchIcon v-if="assignedFilter === null" />
              <FilterIcon v-else />
            </span>
          </th>
          <th
            :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px' }"
            class="border text-left align-top relative pb-6"
            :class="preserveFilter !== null ? 'bg-gray-300' : 'bg-gray-100'"
          >
            温存
            <span
              @click="togglePreserveFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="preserveIconRef"
            >
              <SearchIcon v-if="preserveFilter === null" />
              <FilterIcon v-else />
            </span>
          </th>
          <th
            v-if="displayMode === 'detail'"
            :style="{ ...cellStyle, ...headerStyle, width: '60px', minWidth: '60px' }"
            class="border text-left align-top relative pb-6"
            :class="targetStageFilter.length > 0 ? 'bg-gray-300' : 'bg-gray-100'"
          >
            割当先
            <span
              @click="toggleTargetStageFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="targetStageIconRef"
            >
              <SearchIcon v-if="targetStageFilter.length === 0" />
              <FilterIcon v-else />
            </span>
          </th>
          <th
            v-if="displayMode === 'detail'"
            :style="{ ...cellStyle, ...headerStyle, width: '120px', minWidth: '120px' }"
            class="border text-left align-top relative pb-6"
            :class="assignedTagFilter.length > 0 ? 'bg-gray-300' : 'bg-gray-100'"
          >
            割当札
            <span
              @click="toggleAssignedTagFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="assignedTagIconRef"
            >
              <SearchIcon v-if="assignedTagFilter.length === 0" />
              <FilterIcon v-else />
            </span>
          </th>
          <th
            v-if="displayMode === 'detail'"
            :style="{ ...cellStyle, ...headerStyle, width: '150px', minWidth: '150px' }"
            class="border text-left align-top relative pb-6"
            :class="commentFilter.length > 0 ? 'bg-gray-300' : 'bg-gray-100'"
          >
            コメント
            <span
              @click="toggleCommentFilter($event)"
              class="cursor-pointer absolute bottom-1 right-1 hover:opacity-70 text-gray-500"
              title="絞り込み"
              ref="commentIconRef"
            >
              <SearchIcon v-if="commentFilter.length === 0" />
              <FilterIcon v-else />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ship in displayedShips"
          :key="`${ship.orig}_${ship.shipIndex}`"
          v-memo="[
            ship.orig,
            ship.shipIndex,
            ship.ownershipCount,
            getTagData(ship.orig, ship.shipIndex).assigned,
            getTagData(ship.orig, ship.shipIndex).preserve,
            getTagData(ship.orig, ship.shipIndex).targetStage,
            getTagData(ship.orig, ship.shipIndex).comment,
            displayMode,
            theme,
            getRowClass(ship.orig, ship.shipIndex),
          ]"
          :style="{ ...rowStyle, ...rowBoxSizing }"
          class="hover:bg-gray-100"
          :class="getRowClass(ship.orig, ship.shipIndex)"
        >
          <!-- 割当済 -->
          <td
            :style="cellStyle"
            class="border text-center cursor-pointer"
            @click="toggleAssigned(ship.orig, ship.shipIndex)"
          >
            <div
              class="inline-flex items-center justify-center w-4 h-4 border border-black rounded-sm transition-colors mx-auto"
              :class="[getTagData(ship.orig, ship.shipIndex).assigned ? 'bg-blue-500' : 'bg-white']"
            >
              <svg
                v-if="getTagData(ship.orig, ship.shipIndex).assigned"
                class="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </td>
          <!-- 温存 -->
          <td
            :style="cellStyle"
            class="border text-center cursor-pointer"
            @mouseenter="
              getTagData(ship.orig, ship.shipIndex).assigned &&
              handleMouseEnterWarning($event, '割当済の艦は温存できません')
            "
            @mouseleave="handleMouseLeaveWarning"
            @click="
              !getTagData(ship.orig, ship.shipIndex).assigned &&
              togglePreserve(ship.orig, ship.shipIndex)
            "
          >
            <div
              class="inline-flex items-center justify-center w-4 h-4 border border-black rounded-sm transition-colors mx-auto"
              :class="[
                getTagData(ship.orig, ship.shipIndex).assigned
                  ? 'bg-gray-300'
                  : getTagData(ship.orig, ship.shipIndex).preserve
                    ? 'bg-blue-500'
                    : 'bg-white',
              ]"
            >
              <svg
                v-if="getTagData(ship.orig, ship.shipIndex).preserve"
                class="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </td>
          <!-- 割当先 -->
          <td
            v-if="displayMode === 'detail'"
            :style="cellStyle"
            class="border text-center relative"
          >
            <div
              class="w-full h-full px-1 py-0 text-sm border-0 bg-transparent cursor-pointer flex items-center justify-center min-h-[20px] stage-trigger"
              :style="{ fontSize: TABLE_STYLE.fontSize }"
              @click="openStageSelector($event, ship.orig, ship.shipIndex)"
            >
              {{ getStageOnlyFromTargetStage(ship.orig, ship.shipIndex) || '-' }}
            </div>
          </td>
          <!-- 割当札 -->
          <td
            v-if="displayMode === 'detail'"
            :style="{
              ...cellStyle,
              backgroundColor: getTagColorForShip(ship.orig, ship.shipIndex),
            }"
            class="border text-center text-xs cursor-help"
            @mouseenter="handleMouseEnterWarning($event, '割当札は割当先から選択')"
            @mouseleave="handleMouseLeaveWarning"
          >
            {{ getTagNameForShip(ship.orig, ship.shipIndex) }}
          </td>
          <!-- コメント -->
          <td v-if="displayMode === 'detail'" :style="cellStyle" class="border">
            <input
              type="text"
              :value="getTagData(ship.orig, ship.shipIndex).comment"
              @input="
                handleCommentChange(
                  ship.orig,
                  ship.shipIndex,
                  ($event.target as HTMLInputElement).value,
                )
              "
              class="w-full px-1 py-0 text-sm border-0 bg-transparent"
              :style="{ fontSize: TABLE_STYLE.fontSize }"
              placeholder=""
            />
          </td>
        </tr>
        <tr v-if="displayedShips.length === 0" :style="rowStyle">
          <td :style="cellStyle" class="border text-center">-</td>
          <td :style="cellStyle" class="border text-center">-</td>
          <template v-if="displayMode === 'detail'">
            <td :style="cellStyle" class="border text-center">-</td>
            <td :style="cellStyle" class="border text-center">-</td>
            <td :style="cellStyle" class="border text-center">-</td>
          </template>
        </tr>
      </tbody>
    </table>

    <!-- Filter Popups using common component -->
    <FilterPopup
      :show="showAssignedFilter"
      :position="assignedFilterPosition"
      type="radio"
      title="割当済で絞り込み"
      :modelValue="assignedFilter"
      @apply="
        (value) => {
          assignedFilter = value as boolean | null
          showAssignedFilter = false
        }
      "
      @clear="
        () => {
          assignedFilter = null
          showAssignedFilter = false
        }
      "
      @close="showAssignedFilter = false"
      ref="assignedPopupRef"
    />

    <FilterPopup
      :show="showPreserveFilter"
      :position="preserveFilterPosition"
      type="radio"
      title="温存で絞り込み"
      :modelValue="preserveFilter"
      @apply="
        (value) => {
          preserveFilter = value as boolean | null
          showPreserveFilter = false
        }
      "
      @clear="
        () => {
          preserveFilter = null
          showPreserveFilter = false
        }
      "
      @close="showPreserveFilter = false"
      ref="preservePopupRef"
    />

    <FilterPopup
      :show="showTargetStageFilter"
      :position="targetStageFilterPosition"
      type="checkbox"
      title="割当先で絞り込み"
      :modelValue="targetStageFilter"
      :options="uniqueTargetStages"
      :includeEmpty="true"
      @apply="
        (value) => {
          targetStageFilter = value as string[]
          showTargetStageFilter = false
        }
      "
      @clear="
        () => {
          targetStageFilter = []
          showTargetStageFilter = false
        }
      "
      @close="showTargetStageFilter = false"
      ref="targetStagePopupRef"
    />

    <FilterPopup
      :show="showAssignedTagFilter"
      :position="assignedTagFilterPosition"
      type="checkbox"
      title="割当札で絞り込み"
      :modelValue="assignedTagFilter"
      :options="uniqueAssignedTags"
      :includeEmpty="true"
      @apply="
        (value) => {
          assignedTagFilter = value as string[]
          showAssignedTagFilter = false
        }
      "
      @clear="
        () => {
          assignedTagFilter = []
          showAssignedTagFilter = false
        }
      "
      @close="showAssignedTagFilter = false"
      ref="assignedTagPopupRef"
    />

    <FilterPopup
      :show="showCommentFilter"
      :position="commentFilterPosition"
      type="checkbox"
      title="コメントで絞り込み"
      :modelValue="commentFilter"
      :options="uniqueComments"
      :includeEmpty="true"
      @apply="
        (value) => {
          commentFilter = value as string[]
          showCommentFilter = false
        }
      "
      @clear="
        () => {
          commentFilter = []
          showCommentFilter = false
        }
      "
      @close="showCommentFilter = false"
      ref="commentPopupRef"
    />

    <!-- Custom Tooltip UI -->
    <Teleport to="body">
      <div
        v-if="tooltipState.show"
        class="fixed z-[9999] px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap -translate-x-1/2 -translate-y-full mb-2 border border-gray-600"
        :style="{ top: tooltipState.y + 'px', left: tooltipState.x + 'px' }"
      >
        {{ tooltipState.content }}
      </div>
    </Teleport>

    <!-- Stage Selection Popup (Cascading Style) -->
    <!-- Main Menu: List of Areas -->
    <div
      v-if="showStageSelectorPopup"
      ref="stageSelectorPopupRef"
      class="fixed shadow-lg rounded py-1 z-50 overflow-y-auto border popup-container"
      :style="{
        top: stageSelectorPosition.y + 'px',
        left: stageSelectorPosition.x + 'px',
        maxHeight: '300px',
        width: '120px',
      }"
      @click.stop
    >
      <div
        v-for="area in uniqueAreas"
        :key="area"
        class="px-2 py-1 cursor-pointer text-sm flex justify-between items-center relative group popup-item focus:outline-none"
        tabindex="0"
        @mouseenter="handleAreaHover($event, area)"
        @click="handleAreaClick($event, area)"
        @keydown.enter="handleAreaClick($event, area)"
        @keydown.space.prevent="handleAreaClick($event, area)"
        :class="{ 'popup-item-active': hoveredArea === area }"
      >
        <span>{{ area }}</span>
        <span class="text-gray-400 text-xs ml-2">▶</span>
      </div>
      <!-- Option to clear selection -->
      <div class="border-t my-1"></div>
      <div
        @click="applyStageSelection('')"
        @keydown.enter="applyStageSelection('')"
        @keydown.space.prevent="applyStageSelection('')"
        class="px-2 py-1 cursor-pointer text-gray-500 text-xs popup-item focus:outline-none"
        tabindex="0"
        @mouseenter="hoveredArea = null"
      >
        選択解除
      </div>
    </div>

    <!-- Sub Menu: List of Stages for Hovered Area -->
    <div
      v-if="showStageSelectorPopup && hoveredArea"
      ref="subMenuRef"
      class="fixed shadow-lg rounded py-1 z-[60] overflow-y-auto border popup-container"
      :style="{
        top: subMenuPosition.y + 'px',
        left: subMenuPosition.x + 'px',
        maxHeight: '300px',
        width: '140px',
      }"
      @click.stop
      @mouseenter="cancelCloseSubMenu"
    >
      <div
        v-for="stage in getStagesForArea(hoveredArea)"
        :key="stage"
        @click="handleStageClick($event, stage)"
        @keydown.enter="handleStageClick($event, stage)"
        @keydown.space.prevent="handleStageClick($event, stage)"
        @mouseenter="handleStageHover($event, stage)"
        class="px-2 py-1 cursor-pointer text-sm flex justify-between items-center popup-item focus:outline-none"
        tabindex="0"
        :class="{ 'popup-item-active': hoveredStage === stage }"
      >
        <span>{{ stage }}</span>
        <span v-if="getTagsForStage(stage).length > 0" class="text-gray-400 text-xs ml-2">▶</span>
      </div>
    </div>

    <!-- 3rd Level Menu: List of Tags for Hovered Stage -->
    <div
      v-if="showStageSelectorPopup && hoveredStage && getTagsForStage(hoveredStage).length > 0"
      ref="tagMenuRef"
      class="fixed shadow-lg rounded py-1 z-[70] overflow-y-auto border popup-container"
      :style="{
        top: tagMenuPosition.y + 'px',
        left: tagMenuPosition.x + 'px',
        maxHeight: '300px',
        width: '160px',
      }"
      @click.stop
    >
      <div
        v-for="tag in getTagsForStage(hoveredStage)"
        :key="tag.tagId"
        @click="applyTagSelection(hoveredStage, tag.tagName)"
        @keydown.enter="applyTagSelection(hoveredStage, tag.tagName)"
        @keydown.space.prevent="applyTagSelection(hoveredStage, tag.tagName)"
        class="px-2 py-1 cursor-pointer text-sm popup-item focus:outline-none focus:ring-1 focus:ring-blue-500"
        tabindex="0"
        :style="{ backgroundColor: tag.tagColor, color: '#000' }"
      >
        {{ tag.tagName }}
      </div>
    </div>

    <!-- Validation Alert -->
    <BaseDialog
      v-model:show="showValidationAlert"
      type="alert"
      message="先に割当先と割当札を選択してください"
    />

    <!-- Confirmation Dialog -->
    <BaseDialog
      v-model:show="showConfirmDialog"
      type="confirm"
      :message="confirmMessage"
      @confirm="handleConfirmStageChange"
    />

    <BaseDialog
      v-model:show="showUnassignConfirm"
      type="confirm"
      :message="unassignConfirmMessage"
      @confirm="handleConfirmUnassign"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { ExpandedShip, TagManagement } from '@/types/interfaces'
import { TABLE_STYLE } from '@/constants/tableStyle'
import FilterPopup from '@/components/common/FilterPopup.vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
import SearchIcon from '@/components/common/SearchIcon.vue'
import FilterIcon from '@/components/common/FilterIcon.vue'
import { useFilterPopupManager } from '@/composables/useFilterPopup'

const props = withDefaults(
  defineProps<{
    ships: ExpandedShip[]
    sourceShips: ExpandedShip[]
    selectedEventId: number | null
    loading?: boolean
    targetHeaderHeight?: number
    tagManagementData: Map<string, TagManagement>
    stageOptions: string[]
    stageTagMap: Record<string, { tagId: number; tagName: string; tagColor: string }[]>
    tagMap: Record<number, { tagId: number; tagName: string; tagColor: string }>
    updateTagManagement: (data: TagManagement) => Promise<void>
    displayMode?: 'detail' | 'checkOnly'
    theme?: 'light' | 'dark' | 'gradient'
  }>(),
  {
    displayMode: 'detail',
    theme: 'light',
  },
)

const emit = defineEmits<{
  (e: 'filter-change', filteredShips: ExpandedShip[], isFiltering: boolean): void
}>()

// Helper function to get tag data from the shared tagManagementData
const getTagData = (orig: number, shipIndex: number): TagManagement => {
  const key = `${orig}_${shipIndex}`
  const existing = props.tagManagementData.get(key)
  if (existing) return existing

  // Return default values
  return {
    eventId: props.selectedEventId || 0,
    orig,
    shipIndex,
    assigned: false,
    preserve: false,
    targetStage: '',
    tagId: 0,
    comment: '',
  }
}

// Filter states
const assignedFilter = ref<boolean | null>(null)
const preserveFilter = ref<boolean | null>(null)
const targetStageFilter = ref<string[]>([])
const assignedTagFilter = ref<string[]>([])
const commentFilter = ref<string[]>([])

// Filter popup management
const filterManager = useFilterPopupManager()

const assignedPopup = filterManager.register()
const preservePopup = filterManager.register()
const targetStagePopup = filterManager.register()
const assignedTagPopup = filterManager.register()
const commentPopup = filterManager.register()

// Explicitly declare ref types for FilterPopup components
const assignedPopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)
const preservePopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)
const targetStagePopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)
const assignedTagPopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)
const commentPopupRef = ref<InstanceType<typeof FilterPopup> | null>(null)

// Destructure for compatibility with existing template
const showAssignedFilter = assignedPopup.show
const assignedFilterPosition = assignedPopup.position
const assignedIconRef = assignedPopup.iconRef

const showPreserveFilter = preservePopup.show
const preserveFilterPosition = preservePopup.position
const preserveIconRef = preservePopup.iconRef

const showTargetStageFilter = targetStagePopup.show
const targetStageFilterPosition = targetStagePopup.position
const targetStageIconRef = targetStagePopup.iconRef

const showAssignedTagFilter = assignedTagPopup.show
const assignedTagFilterPosition = assignedTagPopup.position
const assignedTagIconRef = assignedTagPopup.iconRef

const showCommentFilter = commentPopup.show
const commentFilterPosition = commentPopup.position
const commentIconRef = commentPopup.iconRef

// Validation Alert State
const showValidationAlert = ref(false)

// Confirmation Dialog State
const showConfirmDialog = ref(false)
const pendingStageSelection = ref<{ stage: string; tagId: number } | null>(null)
const confirmMessage =
  'すでに制御札割当済の艦の情報を変更しようとしています\n実行してよろしいですか'

// Unassign Confirmation State
const showUnassignConfirm = ref(false)
const pendingUnassign = ref<{ orig: number; shipIndex: number } | null>(null)
const unassignConfirmMessage = '割当済チェックを外しますか'

// Custom Tooltip State
const tooltipState = ref({
  show: false,
  content: '',
  x: 0,
  y: 0,
})

const handleMouseEnterWarning = (e: MouseEvent, content: string) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltipState.value = {
    show: true,
    content,
    x: rect.left + rect.width / 2,
    y: rect.top - 5, // Position just above the cell
  }
}

const handleMouseLeaveWarning = () => {
  tooltipState.value.show = false
}

// Stage Selector State
const showStageSelectorPopup = ref(false)
const stageSelectorPosition = ref({ x: 0, y: 0 })
const stageSelectorPopupRef = ref<HTMLElement | null>(null)
const subMenuRef = ref<HTMLElement | null>(null)
const tagMenuRef = ref<HTMLElement | null>(null)
const editingShipOrig = ref<number | null>(null)
const editingShipIndex = ref<number>(0)
const hoveredArea = ref<string | null>(null)
const subMenuPosition = ref({ x: 0, y: 0 })
const hoveredStage = ref<string | null>(null)
const tagMenuPosition = ref({ x: 0, y: 0 })
const activeStageCell = ref<HTMLElement | null>(null)

const theadRef = ref<HTMLElement | null>(null)

// Get unique target stages from all source ships (for filter options)
const uniqueTargetStages = computed(() => {
  const stages = new Set<string>()
  props.sourceShips.forEach((ship) => {
    const data = getTagData(ship.orig, ship.shipIndex)
    if (data.targetStage && data.targetStage.trim()) {
      stages.add(data.targetStage)
    }
  })
  return Array.from(stages).sort()
})

// Get unique comments from all source ships (for filter options)
const uniqueComments = computed(() => {
  const comments = new Set<string>()
  props.sourceShips.forEach((ship) => {
    const data = getTagData(ship.orig, ship.shipIndex)
    if (data.comment && data.comment.trim()) {
      comments.add(data.comment)
    }
  })
  return Array.from(comments).sort()
})

// Get unique assigned tags from all source ships (for filter options)
const uniqueAssignedTags = computed(() => {
  const tags = new Set<string>()
  props.sourceShips.forEach((ship) => {
    const tagName = getTagNameForShip(ship.orig, ship.shipIndex)
    if (tagName && tagName.trim()) {
      tags.add(tagName)
    }
  })
  return Array.from(tags).sort()
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
    result = result.filter(
      (ship) => getTagData(ship.orig, ship.shipIndex).assigned === assignedFilter.value,
    )
  }

  // Apply preserve filter
  if (preserveFilter.value !== null) {
    result = result.filter(
      (ship) => getTagData(ship.orig, ship.shipIndex).preserve === preserveFilter.value,
    )
  }

  // Apply target stage filter
  if (targetStageFilter.value.length > 0) {
    result = result.filter((ship) => {
      const data = getTagData(ship.orig, ship.shipIndex)
      const stage = data.targetStage || ''
      return targetStageFilter.value.includes(stage)
    })
  }

  // Apply comment filter
  if (commentFilter.value.length > 0) {
    result = result.filter((ship) => {
      const data = getTagData(ship.orig, ship.shipIndex)
      const comment = data.comment || ''
      return commentFilter.value.includes(comment)
    })
  }

  // Apply assigned tag filter
  if (assignedTagFilter.value.length > 0) {
    result = result.filter((ship) => {
      const tagName = getTagNameForShip(ship.orig, ship.shipIndex)
      return assignedTagFilter.value.includes(tagName)
    })
  }

  return result
})

// Watch filteredShipsForEmit and emit changes to parent
watch(
  filteredShipsForEmit,
  (newFiltered) => {
    const isFiltering =
      assignedFilter.value !== null ||
      preserveFilter.value !== null ||
      targetStageFilter.value.length > 0 ||
      assignedTagFilter.value.length > 0 ||
      commentFilter.value.length > 0
    emit('filter-change', newFiltered, isFiltering)
  },
  { immediate: true },
)

// Toggle assigned checkbox by clicking the cell
const toggleAssigned = (orig: number, shipIndex: number) => {
  const current = getTagData(orig, shipIndex)

  // If already assigned, shoe confirmation dialog to unassign
  if (current.assigned) {
    pendingUnassign.value = { orig, shipIndex }
    showUnassignConfirm.value = true
    return
  }

  // Validation: If trying to set assigned to true, check if targetStage is empty
  if (!current.assigned && !current.targetStage) {
    showValidationAlert.value = true
    return
  }

  const updated: TagManagement = {
    ...current,
    assigned: !current.assigned,
  }
  props.updateTagManagement(updated)
}

const handleConfirmUnassign = () => {
  if (pendingUnassign.value) {
    const { orig, shipIndex } = pendingUnassign.value
    const current = getTagData(orig, shipIndex)
    const updated: TagManagement = {
      ...current,
      assigned: false,
    }
    props.updateTagManagement(updated)
    pendingUnassign.value = null
  }
  showUnassignConfirm.value = false
}

// Toggle preserve checkbox by clicking the cell
const togglePreserve = (orig: number, shipIndex: number) => {
  const current = getTagData(orig, shipIndex)
  const updated: TagManagement = {
    ...current,
    preserve: !current.preserve,
  }
  props.updateTagManagement(updated)
}

const executeStageChange = (orig: number, shipIndex: number, value: string, tagId: number = 0) => {
  const current = getTagData(orig, shipIndex)

  // Safety inference: If tagId is 0 but value has (TagName), try to find tagId
  let finalTagId = tagId
  if (finalTagId === 0 && value) {
    const parsed = parseTagFromTargetStage(value)
    if (parsed && parsed.tagName) {
      const tagEntry = Object.values(props.tagMap).find((t) => t.tagName === parsed.tagName)
      if (tagEntry) {
        finalTagId = tagEntry.tagId
        console.log(`[tagId Inference] Inferred tagId ${finalTagId} from "${value}"`)
      }
    }
  }

  const updated: TagManagement = {
    ...current,
    targetStage: value,
    tagId: finalTagId,
  }

  // If we assigned a specific tag, automatically set assigned to true
  if (finalTagId > 0) {
    updated.assigned = true
  }

  props.updateTagManagement(updated)
}

const handleTargetStageChange = (orig: number, shipIndex: number, value: string, tagId: number = 0) => {
  executeStageChange(orig, shipIndex, value, tagId)
}

const handleCommentChange = (orig: number, shipIndex: number, comment: string) => {
  const current = getTagData(orig, shipIndex)
  const updated: TagManagement = {
    ...current,
    comment,
  }
  props.updateTagManagement(updated)
}

const closeAllPopups = () => {
  filterManager.closeAll()
  showStageSelectorPopup.value = false
}

// Filter popup controls
const toggleAssignedFilter = (event: MouseEvent) => {
  assignedPopup.toggle(event)
}

const togglePreserveFilter = (event: MouseEvent) => {
  preservePopup.toggle(event)
}

const toggleTargetStageFilter = (event: MouseEvent) => {
  targetStagePopup.toggle(event)
}

const toggleAssignedTagFilter = (event: MouseEvent) => {
  assignedTagPopup.toggle(event)
}

const toggleCommentFilter = (event: MouseEvent) => {
  commentPopup.toggle(event)
}

// Extract tag info from targetStage string: "E-1-1 (TagName)" -> { stage: "E-1-1", tagName: "TagName" }
const parseTagFromTargetStage = (targetStage: string) => {
  if (!targetStage) return null
  const match = targetStage.match(/^(.+?)\s*\((.+)\)$/)
  if (match) {
    return {
      stage: match[1],
      tagName: match[2],
    }
  }
  return {
    stage: targetStage,
    tagName: null,
  }
}

const getStageOnlyFromTargetStage = (orig: number, shipIndex: number) => {
  const data = getTagData(orig, shipIndex)
  return data.targetStage
}

const getTagNameForShip = (orig: number, shipIndex: number): string => {
  const data = getTagData(orig, shipIndex)
  if (!data.tagId || data.tagId === 0) return ''
  return props.tagMap[data.tagId]?.tagName || ''
}

const getTagColorForShip = (orig: number, shipIndex: number): string => {
  const data = getTagData(orig, shipIndex)
  if (!data.tagId || data.tagId === 0) return 'transparent'
  return props.tagMap[data.tagId]?.tagColor || 'transparent'
}

// Stage Selector Logic
// ----------------------------------------------------

// Computed: Unique Areas from stageTagMap
const uniqueAreas = computed(() => {
  if (!props.stageTagMap) return []
  return Object.keys(props.stageTagMap)
})

const getStagesForArea = (area: string) => {
  return [area]
}

const getTagsForStage = (stage: string) => {
  return props.stageTagMap[stage] || []
}

const openStageSelector = (event: MouseEvent, orig: number, shipIndex: number) => {
  editingShipOrig.value = orig
  editingShipIndex.value = shipIndex
  activeStageCell.value = event.currentTarget as HTMLElement

  // Position logic
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  stageSelectorPosition.value = {
    x: rect.left,
    y: rect.bottom + 5,
  }

  // Adjust if off-screen
  if (stageSelectorPosition.value.y + 300 > window.innerHeight) {
    stageSelectorPosition.value.y = rect.top - 300
  }

  showStageSelectorPopup.value = true
}

const closeStageSelector = () => {
  showStageSelectorPopup.value = false
  editingShipOrig.value = null
  editingShipIndex.value = 0
  hoveredArea.value = null
  hoveredStage.value = null
  activeStageCell.value = null
}

const handleAreaHover = (event: MouseEvent | KeyboardEvent, area: string) => {
  hoveredArea.value = area
  hoveredStage.value = null // Reset lower level

  // Position sub-menu next to the area item
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  subMenuPosition.value = {
    x: rect.right - 5, // Slightly overlap
    y: rect.top,
  }
}

const handleAreaClick = (event: MouseEvent | KeyboardEvent, area: string) => {
  // Mobile support: click implies hover
  handleAreaHover(event, area)
}

const handleStageHover = (event: MouseEvent | KeyboardEvent, stage: string) => {
  hoveredStage.value = stage

  // Position tag-menu next to the stage item
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  tagMenuPosition.value = {
    x: rect.right - 5,
    y: rect.top,
  }
}

const cancelCloseSubMenu = () => {
  // Helper to keep sub menu open when moving mouse
}

// Apply Logic
const applyTagSelection = (stage: string, tagName: string) => {
  // Find tagId
  const tags = props.stageTagMap[stage]
  const tag = tags.find((t) => t.tagName === tagName)
  if (!tag) return

  applyStageSelection(stage, tag.tagId)
}

const applyStageSelection = (stage: string, tagId: number = 0) => {
  if (editingShipOrig.value === null) return

  const orig = editingShipOrig.value
  const shipIndex = editingShipIndex.value

  // Check if we are overwriting an existing assignment
  const current = getTagData(orig, shipIndex)
  if (current.assigned && current.targetStage) {
    // If changing stage/tag on an assigned ship, ask confirmation?
    // Current requirement says: "割り当て済みの艦の情報（割当先、コメント）を変更しようとした場合... 確認ダイアログを表示"
    // So yes.
    pendingStageSelection.value = { stage, tagId }
    showConfirmDialog.value = true
    closeStageSelector()
    return
  }

  executeStageChange(orig, shipIndex, stage, tagId)
  closeStageSelector()
}

const handleConfirmStageChange = () => {
  if (pendingStageSelection.value && editingShipOrig.value !== null) {
      executeStageChange(
      editingShipOrig.value,
      editingShipIndex.value,
      pendingStageSelection.value.stage,
      pendingStageSelection.value.tagId,
    )
    pendingStageSelection.value = null
  }
  showConfirmDialog.value = false
}

const handleStageClick = (event: MouseEvent | KeyboardEvent, stage: string) => {
  // If there are tags, just handle hover logic (expand sub-menu)
  // If no tags, select the stage immediately
  const tags = getTagsForStage(stage)
  if (tags && tags.length > 0) {
    handleStageHover(event, stage)
  } else {
    applyStageSelection(stage)
  }
}

// Close popups when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // Handle Assigned Filter Popup
  if (showAssignedFilter.value && assignedPopupRef.value) {
    const clickedIcon = assignedIconRef.value?.contains(target)
    const clickedPopup = (assignedPopupRef.value as InstanceType<typeof FilterPopup>).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showAssignedFilter.value = false
    }
  }

  // Handle Preserve Filter Popup
  if (showPreserveFilter.value && preservePopupRef.value) {
    const clickedIcon = preserveIconRef.value?.contains(target)
    const clickedPopup = (preservePopupRef.value as InstanceType<typeof FilterPopup>).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showPreserveFilter.value = false
    }
  }

  // Handle Target Stage Filter Popup
  if (showTargetStageFilter.value && targetStagePopupRef.value) {
    const clickedIcon = targetStageIconRef.value?.contains(target)
    const clickedPopup = (targetStagePopupRef.value as InstanceType<typeof FilterPopup>).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showTargetStageFilter.value = false
    }
  }

  // Handle Assigned Tag Filter Popup
  if (showAssignedTagFilter.value && assignedTagPopupRef.value) {
    const clickedIcon = assignedTagIconRef.value?.contains(target)
    const clickedPopup = (assignedTagPopupRef.value as InstanceType<typeof FilterPopup>).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showAssignedTagFilter.value = false
    }
  }

  // Handle Comment Filter Popup
  if (showCommentFilter.value && commentPopupRef.value) {
    const clickedIcon = commentIconRef.value?.contains(target)
    const clickedPopup = (commentPopupRef.value as InstanceType<typeof FilterPopup>).popupRef?.contains(target)
    if (!clickedIcon && !clickedPopup) {
      showCommentFilter.value = false
    }
  }

  // Handle Stage Selector Popup
  if (showStageSelectorPopup.value) {
    const clickedInsideMain = stageSelectorPopupRef.value?.contains(target)
    const clickedInsideSub = subMenuRef.value?.contains(target)
    const clickedInsideTag = tagMenuRef.value?.contains(target)
    const clickedTargetTrigger = target.closest('.stage-trigger') === activeStageCell.value

    if (!clickedInsideMain && !clickedInsideSub && !clickedInsideTag && !clickedTargetTrigger) {
      closeStageSelector()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleStageSelectorKeydown)
})

const handleStageSelectorKeydown = (event: KeyboardEvent) => {
  if (!showStageSelectorPopup.value) return

  if (event.key === 'Escape') {
    closeStageSelector()
  } else if (event.key === 'Tab') {
    // Gather all focusable elements across all open menus
    const focusable: HTMLElement[] = []
    if (stageSelectorPopupRef.value) {
      focusable.push(
        ...(Array.from(
          stageSelectorPopupRef.value.querySelectorAll('[tabindex="0"]'),
        ) as HTMLElement[]),
      )
    }
    if (subMenuRef.value) {
      focusable.push(
        ...(Array.from(subMenuRef.value.querySelectorAll('[tabindex="0"]')) as HTMLElement[]),
      )
    }
    if (tagMenuRef.value) {
      focusable.push(
        ...(Array.from(tagMenuRef.value.querySelectorAll('[tabindex="0"]')) as HTMLElement[]),
      )
    }

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

watch(showStageSelectorPopup, (newShow) => {
  if (newShow) {
    document.addEventListener('keydown', handleStageSelectorKeydown)
    setTimeout(() => {
      if (stageSelectorPopupRef.value) {
        const first = stageSelectorPopupRef.value.querySelector('[tabindex="0"]') as HTMLElement
        first?.focus()
      }
    }, 0)
  } else {
    document.removeEventListener('keydown', handleStageSelectorKeydown)
  }
})

// Get row class based on tag flags for better performance than inline styles
const getRowClass = (orig: number, shipIndex: number) => {
  const tagData = getTagData(orig, shipIndex)

  // Assigned flag takes priority
  if (tagData.assigned) {
    return 'row-assigned'
  }

  // Preserve flag
  if (tagData.preserve) {
    return 'row-preserve'
  }

  return ''
}

// Static style objects
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
  height: props.targetHeaderHeight
    ? `${props.targetHeaderHeight}px`
    : `${TABLE_STYLE.headerHeight}px`,
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

th,
td {
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 1px solid #d1d5db !important;
  border-bottom: 1px solid #d1d5db !important;
}

select:focus,
input:focus {
  outline: none;
}

input[type='checkbox'].pointer-events-none {
  pointer-events: none;
}

/* Optimization: Row Highlight Classes */
.row-assigned {
  background-color: var(--bg-row-assigned) !important;
  color: var(--text-row-assigned) !important;
}

.row-preserve {
  background-color: var(--bg-row-preserve) !important;
  color: var(--text-row-preserve) !important;
}

.popup-container {
  background-color: var(--bg-popup) !important;
  color: var(--text-popup) !important;
  border-color: var(--border-popup) !important;
}

.popup-item:hover,
.popup-item:focus,
.popup-item-active {
  background-color: var(--bg-popup-hover) !important;
  outline: none;
}
</style>
