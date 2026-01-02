<template>
  <div class="modal-tag-management text-left relative">
    <div class="flex flex-col mb-4">
      <h3 class="text-sm font-semibold mb-2">制御札管理</h3>

      <!-- Status Summary Box (Below Title) -->
      <div class="px-3 py-1 bg-gray-500 border border-dotted border-gray-400 rounded-lg text-white text-[14px] leading-relaxed inline-block self-start min-w-[220px]">
        <div class="grid grid-cols-[auto,1fr] gap-x-1 items-center">
          <div class="whitespace-nowrap text-[12px]">出撃{{ tagData.assigned ? '' : '(予定)' }}海域：</div>
          <div>{{ parseTagFromTargetStage(tagData.targetStage)?.stage || '-' }}</div>

          <div class="whitespace-nowrap text-[12px]">割当{{ tagData.assigned ? '' : '(予定)' }}札：</div>
          <div class="flex items-center gap-1">
            <span
              v-if="assignedTagName"
              class="px-1.5 py-0.5 rounded text-black font-semibold"
              :style="{ backgroundColor: assignedTagColor }"
            >
              {{ assignedTagName }}
            </span>
            <span v-else>-</span>
            <span>札</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentShip" class="space-y-4">
      <!-- Main Row: [割当/温存 Column], 割当先, 割当札 -->
      <div class="flex flex-wrap items-start gap-x-6 gap-y-2">
        <!-- Vertical Column for 割当済 & 温存 with Box -->
        <div class="relative pt-3">
          <span class="absolute top-0 left-0 text-[10px] text-gray-400 leading-none">クリックで切替</span>
          <div class="flex flex-col items-center gap-1 border border-dotted border-gray-300 rounded px-4 py-2">
            <!-- 割当済 -->
            <div class="flex items-center">
              <span
                @click="toggleAssigned"
                class="cursor-pointer select-none text-sm font-medium whitespace-nowrap"
                :class="tagData.assigned ? 'text-gray-700' : 'text-gray-300'"
              >
                {{ tagData.assigned ? '割当済' : '割当前' }}
              </span>
            </div>

            <!-- 温存 -->
            <div class="flex items-center">
              <span
                @click="!tagData.assigned && togglePreserve()"
                @mouseenter="tagData.assigned && handleMouseEnterWarning($event, '割当済の艦は温存できません')"
                @mouseleave="handleMouseLeaveWarning"
                class="select-none text-sm font-medium whitespace-nowrap cursor-pointer"
                :class="[
                  (tagData.preserve && !tagData.assigned) ? 'text-blue-600' : 'text-gray-300'
                ]"
              >
                温存
              </span>
            </div>
          </div>
        </div>

        <!-- 割当先 (Stage Buttons) with Box -->
        <div class="relative pt-3">
          <span class="absolute top-0 left-0 text-[10px] text-gray-400 leading-none">クリックで割当先・割当札を選択</span>
          <div class="flex flex-col border border-dotted border-gray-300 rounded p-2">
            <div class="flex flex-wrap gap-1">
              <button
                v-for="area in uniqueAreas"
                :key="area"
                @click="handleAreaClick($event, area)"
                class="min-w-[50px] px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium transition-all"
                :class="{ 'bg-blue-400 text-white hover:bg-blue-500': currentStageArea === area }"
              >
                {{ area }}
              </button>
            </div>
            <!-- Clear button (Right-aligned, wider) -->
            <div v-if="tagData.targetStage" class="mt-2 flex justify-end">
              <button
                @click="clearStage"
                class="px-6 bg-gray-700 hover:bg-gray-800 rounded text-[10px] text-gray-300 leading-none h-4 flex items-center justify-center font-medium"
              >
                選択クリア
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Stage Selection Popup -->
      <div
        v-if="showStagePopup"
        ref="stagePopupRef"
        class="fixed bg-white border border-gray-300 shadow-lg rounded py-1 z-[1200] overflow-y-auto"
        :style="{ top: stagePopupPosition.y + 'px', left: stagePopupPosition.x + 'px', maxHeight: '200px', minWidth: '120px' }"
        @click.stop
      >
        <div
          v-for="stage in stagesForSelectedArea"
          :key="stage"
          @click="handleStageClick($event, stage)"
          @mouseenter="handleStageHover($event, stage)"
          class="px-2 py-1 cursor-pointer hover:bg-gray-100 text-sm flex justify-between items-center"
          :class="{ 'bg-gray-100': hoveredStage === stage }"
        >
          <span>{{ stage }}</span>
          <span v-if="getTagsForStage(stage).length > 0" class="text-gray-400 text-xs ml-2">▶</span>
        </div>
      </div>

      <!-- Tag Selection Popup (3rd level) -->
      <div
        v-if="showStagePopup && hoveredStage && getTagsForStage(hoveredStage).length > 0"
        class="fixed bg-white border border-gray-300 shadow-lg rounded py-1 z-[1300] overflow-y-auto"
        :style="{ top: tagMenuPosition.y + 'px', left: tagMenuPosition.x + 'px', maxHeight: '200px', minWidth: '140px' }"
        @click.stop
      >
        <div
          v-for="tag in getTagsForStage(hoveredStage)"
          :key="tag.tagId"
          @click="applyTagSelection(hoveredStage, tag.tagName)"
          class="px-2 py-1 cursor-pointer hover:bg-gray-100 text-sm"
          :style="{ backgroundColor: tag.tagColor, color: '#000' }"
        >
          {{ tag.tagName }}
        </div>
      </div>

      <!-- コメント -->
      <div>
        <input
          type="text"
          :value="tagData.comment"
          @input="handleCommentChange(($event.target as HTMLInputElement).value)"
          class="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          placeholder="コメントを入力"
        />
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
      @confirm="handleConfirm"
    />

    <BaseDialog
      v-model:show="showUnassignConfirm"
      type="confirm"
      :message="unassignConfirmMessage"
      @confirm="handleConfirmUnassign"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ship, TagManagement } from '@/types/interfaces'
import BaseDialog from '@/components/common/BaseDialog.vue'

const props = defineProps<{
  ship: Ship
  shipIndex: number
  selectedEventId: number
  tagManagementData: Map<string, TagManagement>
  stageOptions: string[]
  stageTagMap: Record<string, { tagId: number; tagName: string; tagColor: string }[]>
  tagMap: Record<number, { tagId: number; tagName: string; tagColor: string }>
  updateTagManagement: (data: TagManagement) => Promise<void>
}>()

const currentShip = computed(() => props.ship)

// Get tag data for the current ship
const tagData = computed(() => {
  const key = `${props.ship.orig}_${props.shipIndex}`
  const existing = props.tagManagementData.get(key)
  if (existing) return existing

  return {
    eventId: props.selectedEventId,
    orig: props.ship.orig,
    shipIndex: props.shipIndex,
    assigned: false,
    preserve: false,
    targetStage: '',
    comment: ''
  }
})

const showValidationAlert = ref(false)

// Confirmation Dialog State
const showConfirmDialog = ref(false)
const pendingAction = ref<(() => void) | null>(null)
const confirmMessage = "すでに制御札割当済の艦の情報を変更しようとしています\n実行してよろしいですか"

// Unassign Confirmation State
const showUnassignConfirm = ref(false)
const unassignConfirmMessage = "割当済チェックを外しますか"

// Custom Tooltip State
const tooltipState = ref({
  show: false,
  content: '',
  x: 0,
  y: 0
})

const handleMouseEnterWarning = (e: MouseEvent, content: string) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltipState.value = {
    show: true,
    content,
    x: rect.left + rect.width / 2,
    y: rect.top - 5 // Position just above the element
  }
}

const handleMouseLeaveWarning = () => {
  tooltipState.value.show = false
}

// Toggle functions
const toggleAssigned = () => {
  // If already assigned, show confirmation dialog to unassign
  if (tagData.value.assigned) {
    showUnassignConfirm.value = true
    return
  }

  // Validation: If trying to set assigned to true, check if targetStage is empty
  if (!tagData.value.assigned && !tagData.value.targetStage) {
    showValidationAlert.value = true
    return
  }

  const updated: TagManagement = {
    ...tagData.value,
    assigned: !tagData.value.assigned
  }
  props.updateTagManagement(updated)
}

const handleConfirmUnassign = () => {
  const updated: TagManagement = {
    ...tagData.value,
    assigned: false
  }
  props.updateTagManagement(updated)
  showUnassignConfirm.value = false
}

const togglePreserve = () => {
  const updated: TagManagement = {
    ...tagData.value,
    preserve: !tagData.value.preserve
  }
  props.updateTagManagement(updated)
}

// Stage selection
const showStagePopup = ref(false)
const stagePopupPosition = ref({ x: 0, y: 0 })
const stagePopupRef = ref<HTMLElement | null>(null)
const selectedArea = ref<string | null>(null)
const hoveredStage = ref<string | null>(null)
const tagMenuPosition = ref({ x: 0, y: 0 })

const uniqueAreas = computed(() => {
  const areas = new Set<string>()
  props.stageOptions.forEach(stage => {
    const parts = stage.split('-')
    if (parts.length >= 2) {
      const area = `${parts[0]}-${parts[1]}`
      areas.add(area)
    } else {
      areas.add(stage)
    }
  })
  return Array.from(areas).sort((a, b) => {
    const aNum = parseInt(a.replace('E-', '')) || 0
    const bNum = parseInt(b.replace('E-', '')) || 0
    return aNum - bNum
  })
})

const currentStageArea = computed(() => {
  if (!tagData.value.targetStage) return null
  const stage = parseTagFromTargetStage(tagData.value.targetStage)?.stage || tagData.value.targetStage
  const parts = stage.split('-')
  if (parts.length >= 2) {
    return `${parts[0]}-${parts[1]}`
  }
  return null
})

const stagesForSelectedArea = computed(() => {
  if (!selectedArea.value) return []
  return props.stageOptions.filter(stage => stage.startsWith(selectedArea.value!))
})

const handleAreaClick = (event: MouseEvent, area: string) => {
  selectedArea.value = area
  showStagePopup.value = true
  hoveredStage.value = null

  const rect = (event.target as HTMLElement).getBoundingClientRect()
  stagePopupPosition.value = {
    x: rect.left,
    y: rect.bottom + 5
  }
}

const handleStageClick = (event: MouseEvent, stage: string) => {
  const tags = getTagsForStage(stage)
  if (tags.length === 0) {
    // No tags, just set the stage
    applyStageSelection(stage)
  }
  // Otherwise, wait for tag selection from hover menu
}

const handleStageHover = (event: MouseEvent, stage: string) => {
  hoveredStage.value = stage

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  tagMenuPosition.value = {
    x: rect.right + 5,
    y: rect.top
  }
}

const getTagsForStage = (stage: string) => {
  return props.stageTagMap[stage] || []
}

const applyStageSelection = (stage: string) => {
  if (tagData.value.assigned && tagData.value.targetStage !== stage) {
    pendingAction.value = () => executeStageSelection(stage)
    showConfirmDialog.value = true
    return
  }
  executeStageSelection(stage)
}

const executeStageSelection = (stage: string) => {
  const updated: TagManagement = {
    ...tagData.value,
    targetStage: stage
  }
  props.updateTagManagement(updated)
  showStagePopup.value = false
  selectedArea.value = null
  hoveredStage.value = null
  pendingAction.value = null
}

const applyTagSelection = (stage: string, tagName: string) => {
  const value = `${stage} (${tagName})`
  if (tagData.value.assigned && tagData.value.targetStage !== value) {
    pendingAction.value = () => executeTagSelection(stage, tagName)
    showConfirmDialog.value = true
    return
  }
  executeTagSelection(stage, tagName)
}

const executeTagSelection = (stage: string, tagName: string) => {
  const value = `${stage} (${tagName})`
  const updated: TagManagement = {
    ...tagData.value,
    targetStage: value
  }
  props.updateTagManagement(updated)
  showStagePopup.value = false
  selectedArea.value = null
  hoveredStage.value = null
  pendingAction.value = null
}

const clearStage = () => {
  if (tagData.value.assigned && tagData.value.targetStage) {
    pendingAction.value = () => executeClearStage()
    showConfirmDialog.value = true
    return
  }
  executeClearStage()
}

const executeClearStage = () => {
  const updated: TagManagement = {
    ...tagData.value,
    targetStage: ''
  }
  props.updateTagManagement(updated)
  pendingAction.value = null
}

const handleConfirm = () => {
  if (pendingAction.value) {
    pendingAction.value()
  }
}

// Parse tag from targetStage
const parseTagFromTargetStage = (targetStage: string) => {
  if (!targetStage) return null
  const match = targetStage.match(/^(.+?)\s*\((.+)\)$/)
  if (match) {
    return {
      stage: match[1],
      tagName: match[2]
    }
  }
  return {
    stage: targetStage,
    tagName: null
  }
}

// Get assigned tag info
const assignedTagName = computed(() => {
  if (!tagData.value.targetStage) return ''
  const parsed = parseTagFromTargetStage(tagData.value.targetStage)
  return parsed && parsed.tagName ? parsed.tagName : ''
})

const assignedTagColor = computed(() => {
  if (!assignedTagName.value) return 'transparent'
  const tags = Object.values(props.tagMap)
  const tag = tags.find(t => t.tagName === assignedTagName.value)
  return tag ? tag.tagColor : '#e5e7eb'
})

const handleCommentChange = (value: string) => {
  const updated: TagManagement = {
    ...tagData.value,
    comment: value
  }
  props.updateTagManagement(updated)
}

// Close popup when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (stagePopupRef.value && !stagePopupRef.value.contains(event.target as Node)) {
    const target = event.target as HTMLElement
    if (!target.closest('.modal-tag-management button')) {
      showStagePopup.value = false
      selectedArea.value = null
      hoveredStage.value = null
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.modal-tag-management {
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
}
</style>
