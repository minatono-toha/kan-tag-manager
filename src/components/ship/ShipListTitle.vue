<template>
  <div class="p-4 pb-0">
    <div class="flex items-center mb-2 flex-nowrap" style="min-height: 44px;">
      <h2 class="text-xl font-bold mr-4 whitespace-nowrap">艦船情報</h2>
      <button
        @click="toggleDisplayMode"
        class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap"
      >
        {{ displayMode === 'detail' ? '艦名のみ' : '詳細表示' }}
      </button>
    </div>
    <TableAnnotations type="ship" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TableAnnotations from '../common/TableAnnotations.vue'

const displayMode = ref<'detail' | 'nameOnly'>('detail')

const emit = defineEmits<{
  (e: 'display-mode-change', mode: 'detail' | 'nameOnly'): void
}>()

function toggleDisplayMode() {
  displayMode.value = displayMode.value === 'detail' ? 'nameOnly' : 'detail'
  emit('display-mode-change', displayMode.value)
}
</script>

<style scoped></style>
