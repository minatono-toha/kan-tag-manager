<template>
  <div class="p-4 pb-0">
    <div class="flex items-center mb-2 flex-nowrap" style="min-height: 44px;">
      <h2 class="text-xl font-bold mr-4 whitespace-nowrap">特攻情報</h2>
      <button
        @click="toggleSortMode"
        class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap mr-2"
      >
        {{ sortByMode === 'area' ? '札で並べ替え' : '海域で並べ替え' }}
      </button>
      <button
        @click="toggleAllStages"
        class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap"
      >
        {{ isAllExpanded ? '全格納' : '全展開' }}
      </button>
    </div>
    <TableAnnotations type="attack" />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import TableAnnotations from '../common/TableAnnotations.vue'

const props = defineProps<{
  sortByMode: string
  isAllExpanded: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-sort-mode'): void
  (e: 'toggle-all-stages'): void
}>()

const { sortByMode, isAllExpanded } = toRefs(props)

function toggleSortMode() {
  emit('toggle-sort-mode')
}

function toggleAllStages() {
  emit('toggle-all-stages')
}
</script>

<style scoped></style>
