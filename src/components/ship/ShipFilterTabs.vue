<template>
  <div class="tabs-container bg-white border-b shadow-sm">
    <div class="px-4 pt-2 text-sm font-bold text-gray-700">艦種選択ボタン</div>
    <div class="flex flex-wrap gap-2 px-4 pb-4 pt-1">
      <!-- 全選択ボタン -->
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        :class="isAllSelected
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        @click="$emit('toggle-all')"
      >
        全選択
      </button>

      <!-- フィルターボタン -->
      <button
        v-for="filter in filters"
        :key="filter.id"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        :class="selectedFilterIds.includes(filter.id)
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        @click="$emit('toggle-filter', filter.id)"
      >
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filters: { id: number; label: string }[]
  selectedFilterIds: number[]
  isAllSelected: boolean
}>()

defineEmits<{
  (e: 'toggle-filter', id: number): void
  (e: 'toggle-all'): void
}>()
</script>

<style scoped>
.tabs-container {
  position: sticky;
  top: 120px; /* イベント選択の高さ分下に配置 */
  z-index: 10;
}
</style>
