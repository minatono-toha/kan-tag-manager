<template>
  <div class="tabs-container shadow-sm transition-colors duration-300" :class="isDarkTheme ? 'bg-transparent' : 'bg-white'">
    <div class="px-1 pt-[2px] text-sm font-bold" :class="isDarkTheme ? 'text-gray-300' : 'text-gray-700'">艦種選択ボタン</div>
    <div class="flex flex-wrap gap-0 px-1 pb-0 pt-[1px]">
      <!-- 全選択ボタン -->
      <button
        class="px-4 py-1 rounded-t-lg rounded-b-none text-sm font-medium transition-colors duration-200 border-r last:border-r-0"
        :class="[
          allSelectedClass,
          isDarkTheme ? 'border-white/30' : 'border-gray-300'
        ]"
        @click="$emit('toggle-all')"
      >
        全選択
      </button>

      <!-- フィルターボタン -->
      <button
        v-for="filter in filters"
        :key="filter.id"
        class="px-4 py-1 rounded-t-lg rounded-b-none text-sm font-medium transition-colors duration-200 border-r last:border-r-0"
        :class="[
          getFilterButtonClass(filter.id),
          isDarkTheme ? 'border-white/30' : 'border-gray-300'
        ]"
        @click="$emit('toggle-filter', filter.id)"
      >
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  filters: { id: number; label: string }[]
  selectedFilterIds: number[]
  isAllSelected: boolean
  theme?: 'light' | 'dark' | 'gradient'
}>(), {
  theme: 'light'
})

defineEmits<{
  (e: 'toggle-filter', id: number): void
  (e: 'toggle-all'): void
}>()



const isDarkTheme = computed(() => props.theme === 'dark' || props.theme === 'gradient')

// "Select All" Button Class
const allSelectedClass = computed(() => {
  if (props.isAllSelected) {
    // Active: Blue (Consistent across themes for 'All')
    return 'bg-blue-600 text-white hover:bg-blue-700'
  } else {
    // Inactive
    return isDarkTheme.value
      ? 'bg-gray-700/40 text-gray-400 hover:bg-gray-700/60' // Dark mode inactive (40% Opacity Gray)
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Light mode inactive
  }
})

// Filter Button Class
const getFilterButtonClass = (id: number) => {
  const isSelected = props.selectedFilterIds.includes(id)

  if (isSelected) {
    // Active: Dark Gray (Lighter than before for contrast)
    return 'bg-gray-500 text-white hover:bg-gray-400'
  } else {
    // Inactive
    return isDarkTheme.value
      ? 'bg-gray-700/40 text-gray-400 hover:bg-gray-700/60' // Dark mode inactive (40% Opacity Gray)
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Light mode inactive
  }
}
</script>

<style scoped>
.tabs-container {
  position: sticky;
  top: 120px; /* イベント選択の高さ分下に配置 */
  z-index: 10;
}
</style>
